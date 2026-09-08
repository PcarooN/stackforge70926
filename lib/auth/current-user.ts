import { readProfile, readPreferences, type PublicViewer } from "../profile";
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isAuthConfigured } from "./environment";

// React cache is request-scoped here, not a shared user cache.
// Return only verified, minimal display information to the navbar.
export const getCurrentViewer = cache(
  async (): Promise<PublicViewer | null> => {
    if (!isAuthConfigured()) return null;
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user?.email_confirmed_at || !data.user.email)
        return null;
      const profile = readProfile(data.user.user_metadata);
      return {
        email: data.user.email,
        displayName: profile.displayName,
        avatarTone: profile.avatarTone,
        preferences: readPreferences(data.user.user_metadata),
      };
    } catch {
      return null;
    }
  },
);

export async function redirectIfAuthenticated() {
  if (await getCurrentViewer()) redirect("/dashboard");
}
