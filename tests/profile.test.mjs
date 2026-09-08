import test from "node:test";
import assert from "node:assert/strict";
import {
  readProfile,
  readPreferences,
  validateProfile,
  isAvatarTone,
} from "../lib/profile.ts";
const valid = {
  displayName: "Berkay",
  bio: "Building worlds.",
  game: "FiveM",
  avatarTone: "blue",
};
test("accept and normalize profile", () =>
  assert.deepEqual(
    validateProfile({ ...valid, displayName: " Berkay " }).value,
    valid,
  ));
test("reject invalid names", () => {
  for (const name of ["", "a".repeat(51), "hello\nworld"])
    assert.ok(validateProfile({ ...valid, displayName: name }).error);
});
test("reject oversized bio", () =>
  assert.ok(validateProfile({ ...valid, bio: "x".repeat(241) }).error));
test("reject invalid avatar or game", () => {
  assert.ok(validateProfile({ ...valid, avatarTone: "__proto__" }).error);
  assert.ok(validateProfile({ ...valid, game: "Unsupported" }).error);
});
test("drop unrecognized privilege fields", () =>
  assert.deepEqual(
    validateProfile({ ...valid, role: "admin", plan: "business" }).value,
    valid,
  ));
test("malformed metadata has safe defaults", () => {
  for (const m of [null, undefined, [], false, "x"])
    assert.deepEqual(readProfile(m), {
      displayName: "",
      bio: "",
      game: "Undecided",
      avatarTone: "blue",
    });
});
test("preferences require explicit boolean true", () =>
  assert.deepEqual(
    readPreferences({ sf_preferences: { compact: "true", reducedMotion: 1 } }),
    { compact: false, reducedMotion: false },
  ));
test("read saved metadata", () =>
  assert.deepEqual(readProfile({ sf_profile: valid }), valid));
test("avatar allowlist rejects inherited names", () => {
  assert.equal(isAvatarTone("constructor"), false);
  assert.equal(isAvatarTone("sage"), true);
});
