import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeEmail,
  validEmail,
  passwordError,
  confirmationType,
  confirmationDestination,
  validToken,
  readText,
} from "../lib/auth/validation.ts";
import { signRecovery, verifyRecovery } from "../lib/auth/recovery-token.ts";
test("normalize email without changing passwords", () =>
  assert.equal(normalizeEmail(" User@Example.COM "), "user@example.com"));
test("reject malformed and oversized emails", () => {
  for (const value of [
    "",
    "a@",
    "a b@example.com",
    "a".repeat(250) + "@example.com",
  ])
    assert.equal(validEmail(value), false);
  assert.equal(validEmail("user+tag@example.com"), true);
});
test("password minimum and UTF-8 byte maximum", () => {
  assert.ok(passwordError("short"));
  assert.equal(passwordError("correct horse battery staple"), null);
  assert.ok(passwordError("x".repeat(73)));
  assert.ok(passwordError("😀".repeat(20)));
});
test("allow only signup email and recovery token types", () => {
  for (const value of ["invite", "magiclink", "email_change", null, []])
    assert.equal(confirmationType(value), null);
  assert.equal(confirmationType("email"), "email");
  assert.equal(confirmationType("recovery"), "recovery");
});
test("fixed internal redirect destinations", () => {
  assert.equal(confirmationDestination("email"), "/dashboard");
  assert.equal(confirmationDestination("recovery"), "/reset-password");
});
test("token bounds and syntax", () => {
  assert.equal(validToken("a".repeat(64)), true);
  for (const value of [
    null,
    [],
    "short",
    "a".repeat(513),
    "<script>".repeat(8),
  ])
    assert.equal(validToken(value), false);
});
test("form text helper does not coerce files", () => {
  const f = new FormData();
  f.set("email", new Blob(["secret"]));
  assert.equal(readText(f, "email"), "");
  assert.equal(readText(f, "missing"), "");
});
const key = "a".repeat(64);
const now = 1000000;
test("recovery token is bound to verified user and session", () => {
  const t = signRecovery("u1", "s1", key, now);
  assert.equal(verifyRecovery(t, "u1", "s1", key, now + 1), true);
  assert.equal(verifyRecovery(t, "u2", "s1", key, now + 1), false);
  assert.equal(verifyRecovery(t, "u1", "s2", key, now + 1), false);
});
test("recovery token expires and rejects tampering", () => {
  const t = signRecovery("u1", "s1", key, now);
  assert.equal(verifyRecovery(t, "u1", "s1", key, now + 900000), false);
  assert.equal(verifyRecovery(t, "u1", "s1", "b".repeat(64), now), false);
  assert.equal(verifyRecovery("x" + t, "u1", "s1", key, now), false);
  assert.equal(verifyRecovery("invalid", "u1", "s1", key, now), false);
});
