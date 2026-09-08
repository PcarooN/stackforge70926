import type { BlockDefinition } from "../types.js";

/**
 * The block library. In production this would be seeded from the
 * `oyun-modu-studyosu` QA pipeline per the roadmap — every entry here
 * is meant to represent a system that has already been tested for a
 * given game target, not something generated on the fly.
 */
export const BLOCK_REGISTRY: BlockDefinition[] = [
  // Economy
  {
    id: "economy.currency",
    category: "economy",
    name: "Currency",
    description: "Defines a spendable in-game currency with a starting balance.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["currency", "money", "cash", "balance", "coins"],
    requiredInputs: [],
    outputs: ["balanceChanged"],
  },
  {
    id: "economy.shop",
    category: "economy",
    name: "Item shop",
    description: "A purchasable item catalog that debits a currency block.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["shop", "store", "buy", "purchase", "sell"],
    requiredInputs: ["currencySource"],
    outputs: ["itemGranted"],
  },
  {
    id: "economy.payout",
    category: "economy",
    name: "Payout",
    description: "Grants currency or items on a trigger, e.g. a job completion.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["payout", "reward", "grant", "starter pack", "bonus"],
    requiredInputs: ["trigger", "currencySource"],
    outputs: ["balanceChanged"],
  },
  {
    id: "economy.trade",
    category: "economy",
    name: "Player trading",
    description: "Peer-to-peer item and currency exchange between two players.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["trade", "exchange", "swap"],
    requiredInputs: ["currencySource"],
    outputs: ["itemGranted", "balanceChanged"],
  },

  // Admin & moderation
  {
    id: "admin.ban",
    category: "admin",
    name: "Ban",
    description: "Removes a player from the server for a duration or permanently.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["ban", "kick", "remove player"],
    requiredInputs: ["trigger"],
    outputs: ["auditLogEntry"],
  },
  {
    id: "admin.whitelist",
    category: "admin",
    name: "Whitelist",
    description: "Restricts server join access to an approved player list.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["whitelist", "allowlist", "approved players"],
    requiredInputs: [],
    outputs: ["joinDecision"],
  },
  {
    id: "admin.auditlog",
    category: "admin",
    name: "Audit log",
    description: "Records moderation actions to a persistent log.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["log", "audit", "record", "history"],
    requiredInputs: ["source"],
    outputs: [],
  },
  {
    id: "admin.reportvote",
    category: "admin",
    name: "Report vote threshold",
    description: "Auto-flags a player once enough reports accumulate.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["report", "vote", "threshold", "flag"],
    requiredInputs: [],
    outputs: ["trigger"],
  },

  // Events & automation
  {
    id: "events.onjoin",
    category: "events",
    name: "On player join",
    description: "Fires when a player connects to the server.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["join", "connect", "on player join"],
    requiredInputs: [],
    outputs: ["trigger"],
  },
  {
    id: "events.schedule",
    category: "events",
    name: "Scheduled job",
    description: "Fires on a recurring schedule, e.g. daily or hourly.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["schedule", "recurring", "daily", "timer", "cron"],
    requiredInputs: [],
    outputs: ["trigger"],
  },
  {
    id: "events.seasonal",
    category: "events",
    name: "Seasonal event window",
    description: "Enables a set of blocks only within a date range.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["seasonal", "event", "holiday", "limited time"],
    requiredInputs: [],
    outputs: ["trigger"],
  },
  {
    id: "events.discordlog",
    category: "events",
    name: "Log to Discord",
    description: "Sends a message to a Discord webhook when triggered.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["discord", "webhook", "notify"],
    requiredInputs: ["trigger"],
    outputs: [],
  },
  {
    id: "events.welcomedm",
    category: "events",
    name: "Send welcome DM",
    description: "Sends a direct message to a player, e.g. on first join.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["welcome", "dm", "message", "greet"],
    requiredInputs: ["trigger"],
    outputs: [],
  },

  // Player progression
  {
    id: "progression.levels",
    category: "progression",
    name: "Levels",
    description: "Tracks player XP and level thresholds.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["level", "xp", "experience", "rank up"],
    requiredInputs: ["trigger"],
    outputs: ["levelChanged"],
  },
  {
    id: "progression.jobs",
    category: "progression",
    name: "Jobs",
    description: "Assigns a player role tied to in-game responsibilities.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["job", "role", "career", "assign role"],
    requiredInputs: [],
    outputs: ["roleAssigned"],
  },
  {
    id: "progression.permissiontier",
    category: "progression",
    name: "Permission tier",
    description: "Unlocks server permissions as a player's level increases.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["permission", "tier", "unlock", "access level"],
    requiredInputs: ["levelSource"],
    outputs: [],
  },
  {
    id: "progression.checkbalance",
    category: "progression",
    name: "Check balance",
    description: "Conditional gate that checks a currency balance before continuing.",
    supportedGames: ["fivem", "minecraft", "unturned"],
    triggerKeywords: ["check balance", "afford", "sufficient funds"],
    requiredInputs: ["currencySource"],
    outputs: ["trigger"],
  },
];

export function getBlocksForCategory(category: string) {
  return BLOCK_REGISTRY.filter((b) => b.category === category);
}

export function getBlockById(id: string) {
  return BLOCK_REGISTRY.find((b) => b.id === id);
}
