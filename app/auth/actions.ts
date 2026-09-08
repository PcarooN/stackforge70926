"use server";
import { redirectIfAuthenticated } from "../../lib/auth/current-user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { authEnvironment, isAuthConfigured } from "../../lib/auth/environment";
import {
  readText,
  normalizeEmail,
  validEmail,
  passwordError,
  validToken,
  confirmationType,
  confirmationDestination,
  type AuthState,
} from "../../lib/auth/validation";

import {
  issueRecovery,
  hasRecovery,
  clearRecovery,
} from "../../lib/auth/recovery";

const unavailable = (): AuthState => ({
  status: "error",
  message: "Authentication is temporarily unavailable. Please try again later.",
});
const fail = (message: string, email?: string): AuthState => ({
  status: "error",
  message,
  ...(email ? { email } : {}),
});

export async function signIn(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  void _previous;
  await redirectIfAuthenticated();
  const email = normalizeEmail(readText(form, "email"));
  const password = readText(form, "password");
  if (!validEmail(email) || !password || password.length > 1024)
    return fail("Enter a valid email address and password.", email);
  if (!isAuthConfigured()) return unavailable();
  try {
    const supabase = await createClient("write");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user || !data.user.email_confirmed_at) {
      if (data.session) await supabase.auth.signOut({ scope: "local" });
      return fail(
        "Unable to sign in. Check your credentials and confirm your email before trying again.",
        email,
      );
    }
  } catch {
    return unavailable();
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  void _previous;
  await redirectIfAuthenticated();
  const email = normalizeEmail(readText(form, "email"));
  const password = readText(form, "password");
  if (!validEmail(email)) return fail("Enter a valid email address.", email);
  const issue = passwordError(password);
  if (issue) return fail(issue, email);
  if (password !== readText(form, "confirmPassword"))
    return fail("Your passwords do not match.", email);
  if (!isAuthConfigured()) return unavailable();
  try {
    const supabase = await createClient("write");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${authEnvironment().origin}/auth/confirm` },
    });
    if (error) {
      // Log only diagnostic codes; never log credentials, tokens or form data.
      console.error("[auth/signUp]", {
        code: error.code,
        status: error.status,
      });

      return fail(
        "We couldn’t process this request. Try again later, or sign in if you already have an account.",
        email,
      );
    }
    // Email confirmation MUST be enabled in Supabase. Do not retain a session
    // returned by a project accidentally configured to auto-confirm signups.
    if (data.session) await supabase.auth.signOut({ scope: "local" });
  } catch {
    return unavailable();
  }
  return {
    status: "success",
    message:
      "If this address is eligible, a confirmation email will arrive shortly. Already registered? Sign in or reset your password.",
  };
}

export async function requestPasswordReset(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  void _previous;
  const email = normalizeEmail(readText(form, "email"));
  if (!validEmail(email)) return fail("Enter a valid email address.", email);
  if (!isAuthConfigured()) return unavailable();
  try {
    const supabase = await createClient("write");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${authEnvironment().origin}/auth/confirm`,
    });
    if (error)
      return fail(
        "We couldn’t process this request right now. Please try again later.",
        email,
      );
  } catch {
    return unavailable();
  }
  return {
    status: "success",
    message:
      "If an account exists for that address, you’ll receive a password reset email. Check your inbox and spam folder.",
  };
}

export async function confirmEmail(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  void _previous;
  const type = confirmationType(readText(form, "type"));
  const token_hash = readText(form, "token_hash");
  if (!type || !validToken(token_hash))
    return fail("This link is invalid. Request a new email and try again.");
  if (!isAuthConfigured()) return unavailable();
  try {
    const supabase = await createClient("write");
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (error)
      return fail(
        "This link has expired or was already used. Request a new email and try again.",
      );
    if (type === "recovery") await issueRecovery(supabase);
    else await clearRecovery();
  } catch {
    return unavailable();
  }
  revalidatePath("/", "layout");
  redirect(confirmationDestination(type));
}

export async function updatePassword(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  void _previous;
  const password = readText(form, "password");
  const issue = passwordError(password);
  if (issue) return fail(issue);
  if (password !== readText(form, "confirmPassword"))
    return fail("Your passwords do not match.");
  if (!isAuthConfigured()) return unavailable();
  try {
    const supabase = await createClient("write");
    // Never trust a hidden user ID, URL flag or client session for this mutation.
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user || !data.user.email_confirmed_at)
      return fail("Your session has expired. Request a new reset email.");
    if (!(await hasRecovery(supabase)))
      return fail(
        "Open a fresh password-reset email before changing your password.",
      );
    const { error } = await supabase.auth.updateUser({ password });
    if (error)
      return fail(
        "Unable to update your password. Use a different password or request a fresh reset link.",
      );
    await clearRecovery();
    // Supabase handles password-change refresh-token revocation. Explicitly end
    // the current browser session; existing access JWTs may last until expiry.
    const { error: signOutError } = await supabase.auth.signOut({
      scope: "local",
    });
    if (signOutError)
      return fail(
        "Password updated, but sign-out could not be confirmed. Try signing out from your dashboard.",
      );
  } catch {
    return unavailable();
  }
  revalidatePath("/", "layout");
  redirect("/login?notice=password-updated");
}

export async function signOut(): Promise<AuthState> {
  if (!isAuthConfigured()) return unavailable();
  try {
    const supabase = await createClient("write");
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) return fail("Could not sign out. Please try again.");
    await clearRecovery();
  } catch {
    return unavailable();
  }
  revalidatePath("/", "layout");
  redirect("/login?notice=signed-out");
}
