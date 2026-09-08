import { createHmac, timingSafeEqual } from "node:crypto";
export function signRecovery(
  userId: string,
  sessionId: string,
  secret: string,
  now = Date.now(),
) {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, sid: sessionId, exp: now + 15 * 60 * 1000 }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
export function verifyRecovery(
  token: string,
  userId: string,
  sessionId: string,
  secret: string,
  now = Date.now(),
): boolean {
  if (token.length > 2048) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest();
  let supplied: Buffer;
  try {
    supplied = Buffer.from(signature, "base64url");
  } catch {
    return false;
  }
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  )
    return false;
  try {
    const data: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (!data || typeof data !== "object") return false;
    const item = data as Record<string, unknown>;
    return (
      item.sub === userId &&
      item.sid === sessionId &&
      typeof item.exp === "number" &&
      item.exp > now &&
      item.exp <= now + 15 * 60 * 1000
    );
  } catch {
    return false;
  }
}
