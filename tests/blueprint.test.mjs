import test from "node:test";
import assert from "node:assert/strict";
import { SCENARIOS, createBlueprint } from "../lib/blueprint.ts";
for (const s of SCENARIOS) {
  test(s.id + ": valid deterministic JSON", () => {
    const b = createBlueprint(s.id, s.value);
    assert.deepEqual(JSON.parse(JSON.stringify(b)), b);
    assert.deepEqual(b, createBlueprint(s.id, s.value));
    assert.equal(b.illustrativeOnly, true);
    for (const e of b.edges) {
      assert.ok(b.nodes.some((n) => n.id === e.source));
      assert.ok(b.nodes.some((n) => n.id === e.target));
    }
  });
  test(s.id + ": valid bounds and invalid parameters", () => {
    assert.doesNotThrow(() => createBlueprint(s.id, s.min));
    assert.doesNotThrow(() => createBlueprint(s.id, s.max));
    for (const v of [
      NaN,
      Infinity,
      -Infinity,
      s.min - 1,
      s.max + 1,
      s.min + 0.5,
      s.min + 1,
    ])
      assert.throws(() => createBlueprint(s.id, v));
  });
}
test("reject unknown templates", () =>
  assert.throws(() => createBlueprint("unknown", 500)));
test("correct parameter semantics", () => {
  assert.deepEqual(createBlueprint("welcome-reward", 500).parameters, {
    startingBalance: 500,
  });
  assert.deepEqual(createBlueprint("scheduled-reward", 30).parameters, {
    intervalMinutes: 30,
  });
  assert.deepEqual(createBlueprint("progression-unlock", 10).parameters, {
    requiredLevel: 10,
  });
});
