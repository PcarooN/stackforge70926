import { z } from "zod";
import type { BlockCategory, ParsedIntent, PipelineState } from "../types.js";
import { BLOCK_REGISTRY } from "../blocks/registry.js";

const intentSchema = z.object({
  category: z.enum(["economy", "admin", "events", "progression"]),
  triggers: z.array(z.string()).describe("Short phrases describing what starts the system"),
  actions: z.array(z.string()).describe("Short phrases describing what the system should do"),
  ambiguous: z.boolean().describe("True only if the request doesn't fit any category well"),
});

const CATEGORY_KEYWORDS: Record<BlockCategory, string[]> = {
  economy: ["shop", "currency", "money", "buy", "sell", "trade", "payout", "reward"],
  admin: ["ban", "kick", "whitelist", "report", "moderation", "audit"],
  events: ["join", "schedule", "seasonal", "discord", "welcome", "notify", "event"],
  progression: ["level", "xp", "job", "role", "permission", "rank"],
};

/**
 * Deterministic fallback used when no LLM API key is configured.
 * Keyword-matches the prompt against each category's vocabulary and
 * picks the best match. This keeps the service runnable with zero
 * external dependencies during local development.
 */
function heuristicParse(prompt: string): ParsedIntent {
  const lower = prompt.toLowerCase();
  const scores: Record<BlockCategory, number> = { economy: 0, admin: 0, events: 0, progression: 0 };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [BlockCategory, string[]][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[category] += 1;
    }
  }

  const [bestCategory, bestScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] as [
    BlockCategory,
    number,
  ];

  const matchedBlocks = BLOCK_REGISTRY.filter(
    (b) => b.category === bestCategory && b.triggerKeywords.some((kw) => lower.includes(kw)),
  );

  return {
    category: bestCategory,
    triggers: matchedBlocks.filter((b) => b.outputs.includes("trigger")).map((b) => b.name),
    actions: matchedBlocks.filter((b) => !b.outputs.includes("trigger")).map((b) => b.name),
    ambiguous: bestScore === 0,
  };
}

async function llmParse(prompt: string, apiKey: string): Promise<ParsedIntent> {
  const { ChatAnthropic } = await import("@langchain/anthropic");

  const model = new ChatAnthropic({
    apiKey,
    model: "claude-sonnet-4-6",
    temperature: 0,
  }).withStructuredOutput(intentSchema);

  const categoryList = Object.keys(CATEGORY_KEYWORDS).join(", ");
  const result = await model.invoke(
    `You are classifying a request to build a game-server system into one of these ` +
      `categories: ${categoryList}. Extract short trigger phrases (what starts the ` +
      `system) and action phrases (what it should do). Request: "${prompt}"`,
  );

  return result;
}

export async function parseIntentNode(state: PipelineState): Promise<Partial<PipelineState>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const intent = apiKey ? await llmParse(state.prompt, apiKey) : heuristicParse(state.prompt);
    return { intent };
  } catch (err) {
    return {
      status: "error",
      errors: [`Failed to parse intent: ${err instanceof Error ? err.message : String(err)}`],
    };
  }
}
