import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { authCookieOptions } from "./environment";
import { signRecovery, verifyRecovery } from "./recovery-token";
const COOKIE = "sf-password-recovery";
function secret() {
  const value = process.env.AUTH_RECOVERY_SECRET;
  if (!value || !/^[a-f0-9]{64}$/i.test(value))
    throw new Error("Configure a 32-byte recovery secret.");
  return value;
}
async function identity(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getClaims();
  if (
    error ||
    !data?.claims ||
    typeof data.claims.sub !== "string" ||
    typeof data.claims.session_id !== "string"
  )
    return null;
  return { userId: data.claims.sub, sessionId: data.claims.session_id };
}
export async function issueRecovery(supabase: SupabaseClient) {
  const subject = await identity(supabase);
  if (!subject) throw new Error("No verified recovery session.");
  (await cookies()).set(
    COOKIE,
    signRecovery(subject.userId, subject.sessionId, secret()),
    { ...authCookieOptions, maxAge: 900 },
  );
}
export async function hasRecovery(supabase: SupabaseClient) {
  const subject = await identity(supabase);
  if (!subject) return false;
  return verifyRecovery(
    (await cookies()).get(COOKIE)?.value ?? "",
    subject.userId,
    subject.sessionId,
    secret(),
  );
}
export async function clearRecovery() {
  (await cookies()).set(COOKIE, "", { ...authCookieOptions, maxAge: 0 });
}
