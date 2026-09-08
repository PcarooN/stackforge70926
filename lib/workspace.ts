import { SCENARIOS, createBlueprint } from "./blueprint";

export type Draft = {
  id: string;
  name: string;
  template: string;
  value: number;
  updatedAt: string;
};
export type Simulation = { passed: boolean; steps: string[] };
export const MAX_DRAFTS = 50;
export function validateDraft(input: unknown): Draft {
  if (!input || typeof input !== "object") throw new Error("Invalid project.");
  const d = input as Record<string, unknown>;
  if (typeof d.id !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(d.id))
    throw new Error("Invalid project ID.");
  if (
    typeof d.name !== "string" ||
    !d.name.trim() ||
    d.name.trim().length > 64 ||
    /[\x00-\x1f\x7f]/.test(d.name)
  )
    throw new Error("Use a project name of 1–64 characters.");
  if (typeof d.template !== "string" || typeof d.value !== "number")
    throw new Error("Invalid blueprint parameters.");
  createBlueprint(d.template, d.value);
  if (
    typeof d.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(d.updatedAt))
  )
    throw new Error("Invalid project date.");
  return {
    id: d.id,
    name: d.name.trim(),
    template: d.template,
    value: d.value,
    updatedAt: new Date(d.updatedAt).toISOString(),
  };
}
export function parseDrafts(raw: string): Draft[] {
  const input: unknown = JSON.parse(raw);
  if (!Array.isArray(input) || input.length > MAX_DRAFTS)
    throw new Error(
      "Project storage is invalid or exceeds 50 projects. Export or recover your saved data before replacing it.",
    );
  const drafts = input.map(validateDraft);
  if (new Set(drafts.map((d) => d.id)).size !== drafts.length)
    throw new Error("Duplicate project IDs.");
  return drafts;
}
export function importBlueprint(raw: string): {
  template: string;
  value: number;
} {
  if (raw.length > 100_000)
    throw new Error("Choose a JSON file smaller than 100 KB.");
  const b = JSON.parse(raw);
  if (
    !b ||
    typeof b !== "object" ||
    b.format !== "stackforge-concept/v0" ||
    b.illustrativeOnly !== true
  )
    throw new Error("Choose a StackForge concept/v0 blueprint.");
  const s = SCENARIOS.find((x) => x.id === b.template);
  if (!s) throw new Error("This template is not supported.");
  const key = Object.keys(createBlueprint(s.id, s.value).parameters)[0];
  const value = b.parameters?.[key];
  if (typeof value !== "number")
    throw new Error("Invalid blueprint parameter.");
  const canonical = createBlueprint(s.id, value);
  if (
    b.target !== canonical.target ||
    JSON.stringify(b.nodes) !== JSON.stringify(canonical.nodes) ||
    JSON.stringify(b.edges) !== JSON.stringify(canonical.edges)
  )
    throw new Error(
      "This file has unsupported graph changes. Only the three built-in workflows can be imported.",
    );
  return { template: s.id, value };
}
export function simulate(
  template: string,
  value: number,
  eligible: boolean,
  level: number,
): Simulation {
  createBlueprint(template, value);
  if (!Number.isInteger(level) || level < 0 || level > 100)
    throw new Error("Test level must be 0–100.");
  const s = SCENARIOS.find((x) => x.id === template)!;
  const passed = template === "progression-unlock" ? level >= value : eligible;
  const result =
    template === "welcome-reward"
      ? `Would grant ${value.toLocaleString("en-US")} starter credits.`
      : template === "scheduled-reward"
        ? `Would grant a reward every ${value} minutes while online.`
        : `Would unlock a role at level ${value}.`;
  return {
    passed,
    steps: [
      `Received sample event: ${s.trigger}.`,
      `${s.condition}: ${passed ? "passed" : "not met"}.`,
      passed ? result : "Action skipped. No reward or role would be granted.",
    ],
  };
}
