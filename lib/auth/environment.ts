import "server-only";
export function authEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const site = process.env.AUTH_SITE_URL;
  const recoverySecret = process.env.AUTH_RECOVERY_SECRET;
  if (!recoverySecret || !/^[a-f0-9]{64}$/i.test(recoverySecret))
    throw new Error("Configure AUTH_RECOVERY_SECRET.");
  if (!url || !key || !site)
    throw new Error("Authentication configuration is incomplete.");
  const apiUrl = new URL(url);
  const siteUrl = new URL(site);
  if (
    apiUrl.protocol !== "https:" &&
    !(
      apiUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(apiUrl.hostname)
    )
  )
    throw new Error("Invalid authentication service URL.");
  if (
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.pathname !== "/"
  )
    throw new Error("AUTH_SITE_URL must be an origin without a path.");
  if (
    siteUrl.protocol !== "https:" &&
    !(
      siteUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(siteUrl.hostname) &&
      process.env.NODE_ENV !== "production"
    )
  )
    throw new Error("Use HTTPS for the production site URL.");
  if (!key.startsWith("sb_publishable_"))
    throw new Error("Use a publishable key, never a secret/service-role key.");
  return { url: apiUrl.origin, key, origin: siteUrl.origin };
}
export function isAuthConfigured() {
  try {
    authEnvironment();
    return true;
  } catch {
    return false;
  }
}
export const authCookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
