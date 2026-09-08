"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { authEnvironment } from "../../../lib/auth/environment";
import { clearRecovery } from "../../../lib/auth/recovery";
import { readText } from "../../../lib/auth/validation";
import { validateProfile, type SettingsState } from "../../../lib/profile";
const failed = (
  message = "Couldn’t save your changes. Please try again.",
): SettingsState => ({ status: "error", message });
async function verifiedClient() {
  const supabase = await createClient("write");
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email_confirmed_at || !data.user.email) return null;
  return { supabase, user: data.user };
}
export async function saveProfile(
  _state: SettingsState,
  form: FormData,
): Promise<SettingsState> {
  void _state;
  const result = validateProfile({
    displayName: readText(form, "displayName"),
    bio: readText(form, "bio"),
    game: readText(form, "game"),
    avatarTone: readText(form, "avatarTone"),
  });
  if (result.error || !result.value)
    return failed(result.error || "Invalid profile.");
  try {
    const auth = await verifiedClient();
    if (!auth) return failed("Your session has expired. Sign in again.");
    const { error } = await auth.supabase.auth.updateUser({
      data: { sf_profile: result.value },
    });
    if (error) return failed();
  } catch {
    return failed();
  }
  revalidatePath("/", "layout");
  return {
    status: "success",
    message:
      "Profile saved. Your name and avatar are updated across your account.",
  };
}
export async function savePreferences(
  _state: SettingsState,
  form: FormData,
): Promise<SettingsState> {
  void _state;
  try {
    const auth = await verifiedClient();
    if (!auth) return failed("Your session has expired. Sign in again.");
    const { error } = await auth.supabase.auth.updateUser({
      data: {
        sf_preferences: {
          reducedMotion: readText(form, "reducedMotion") === "on",
          compact: readText(form, "compact") === "on",
        },
      },
    });
    if (error) return failed();
  } catch {
    return failed();
  }
  revalidatePath("/", "layout");
  return {
    status: "success",
    message:
      "Preferences saved. System reduced-motion settings are always respected.",
  };
}
export async function sendOwnReset(): Promise<SettingsState> {
  try {
    const auth = await verifiedClient();
    if (!auth) return failed("Your session has expired. Sign in again.");
    const { error } = await auth.supabase.auth.resetPasswordForEmail(
      auth.user.email!,
      { redirectTo: `${authEnvironment().origin}/auth/confirm` },
    );
    if (error)
      return failed("Couldn’t send the reset email. Please try again later.");
    return {
      status: "success",
      message:
        "Password-reset email requested for your verified address. Check your inbox and spam folder.",
    };
  } catch {
    return failed("The request could not be completed. Please try again.");
  }
}
export async function endAllSessions(
  _state: SettingsState,
  form: FormData,
): Promise<SettingsState> {
  void _state;
  if (readText(form, "confirmAll") !== "on")
    return failed("Confirm that you want to sign out all devices.");
  try {
    const auth = await verifiedClient();
    if (!auth) return failed("Your session has expired. Sign in again.");
    const { error } = await auth.supabase.auth.signOut({ scope: "global" });
    if (error) return failed("Couldn’t sign out all sessions. Try again.");
    await clearRecovery();
  } catch {
    return failed("Couldn’t sign out all sessions. Try again.");
  }
  revalidatePath("/", "layout");
  redirect("/login?notice=signed-out");
}
