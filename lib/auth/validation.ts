export type AuthState = {
  status: "idle" | "error" | "success";
  message: string;
  email?: string;
};
export type AuthMode = "login" | "signup" | "forgot" | "reset";
export const INITIAL_AUTH_STATE: AuthState = { status: "idle", message: "" };
export function readText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
export function validEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function passwordError(value: string): string | null {
  if (Array.from(value).length < 12)
    return "Use at least 12 characters for your password.";
  if (new TextEncoder().encode(value).length > 72)
    return "Keep your password within 72 UTF-8 bytes (non-English characters may use more than one byte).";
  return null;
}
export function confirmationType(value: unknown): "email" | "recovery" | null {
  return value === "email" || value === "recovery" ? value : null;
}
export function validToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{20,512}$/.test(value);
}
// No user-controlled redirect destinations are accepted.
export function confirmationDestination(type: "email" | "recovery") {
  return type === "recovery" ? "/reset-password" : "/dashboard";
}
