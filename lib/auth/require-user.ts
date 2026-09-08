import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isAuthConfigured } from "./environment";

// Call this in EVERY future protected page, action, and data-access function.
// A layout check alone is not a data authorization boundary.
export async function requireUser() {
  if (!isAuthConfigured()) redirect("/login");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || !data.user.email_confirmed_at) redirect("/login");
  return { supabase, user: data.user };
}
