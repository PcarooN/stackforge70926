export const SCENARIOS = [
  {
    id: "welcome-reward",
    name: "Welcome reward",
    category: "Economy",
    trigger: "Player joins",
    condition: "First visit only",
    action: "Grant starter funds",
    outcome: "A little head start. A better first session.",
    detail:
      "Connect a join event to a first-visit check, then set the amount a new player receives.",
    param: "Starting balance",
    value: 500,
    min: 100,
    max: 2000,
    step: 100,
    unit: "credits",
  },
  {
    id: "scheduled-reward",
    name: "Scheduled reward",
    category: "Events",
    trigger: "Timer fires",
    condition: "Player is online",
    action: "Grant a reward",
    outcome: "Give players another reason to stay.",
    detail:
      "Choose how often an online-player reward runs. This preview changes the schedule, not a live server.",
    param: "Reward interval",
    value: 30,
    min: 15,
    max: 120,
    step: 15,
    unit: "minutes",
  },
  {
    id: "progression-unlock",
    name: "Progression unlock",
    category: "Progression",
    trigger: "Player levels up",
    condition: "Required level reached",
    action: "Unlock a role",
    outcome: "Turn progress into something players can use.",
    detail:
      "Define a level threshold and connect it to a role unlock. Exact framework permissions are still to be specified.",
    param: "Required level",
    value: 10,
    min: 5,
    max: 50,
    step: 5,
    unit: "levels",
  },
] as const;

export type Scenario = (typeof SCENARIOS)[number];

/** Deterministic concept schema. Not a game compiler. */
export function createBlueprint(scenarioId: string, value: number) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId);
  if (!scenario) throw new Error("Unknown template.");
  if (
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < scenario.min ||
    value > scenario.max ||
    (value - scenario.min) % scenario.step !== 0
  )
    throw new Error("Invalid parameter value.");
  const key =
    scenario.id === "welcome-reward"
      ? "startingBalance"
      : scenario.id === "scheduled-reward"
        ? "intervalMinutes"
        : "requiredLevel";
  return {
    format: "stackforge-concept/v0",
    illustrativeOnly: true,
    target: "unspecified",
    template: scenario.id,
    nodes: [
      { id: "trigger", kind: "trigger", label: scenario.trigger },
      { id: "condition", kind: "condition", label: scenario.condition },
      { id: "action", kind: "action", label: scenario.action },
    ],
    edges: [
      { source: "trigger", target: "condition" },
      { source: "condition", target: "action" },
    ],
    parameters: { [key]: value },
  };
}
