import type { PipelineState, SelectedBlock } from "../types.js";
import { BLOCK_REGISTRY } from "../blocks/registry.js";

/**
 * Purely deterministic — no LLM call here. The model's job ended at
 * classifying intent; picking actual blocks is a lookup against the
 * tested library, which is the whole point of the "blocks not
 * free-form code" approach.
 */
export function selectBlocksNode(state: PipelineState): Partial<PipelineState> {
  if (!state.intent) {
    return { status: "error", errors: ["selectBlocksNode ran without a parsed intent"] };
  }

  const { category, triggers, actions } = state.intent;
  const candidates = BLOCK_REGISTRY.filter(
    (b) => b.category === category && b.supportedGames.includes(state.targetGame),
  );

  const phrases = [...triggers, ...actions].map((p) => p.toLowerCase());

  const matched = candidates.filter((block) =>
    phrases.some((phrase) =>
      block.triggerKeywords.some((kw) => phrase.includes(kw) || kw.includes(phrase)),
    ) || phrases.some((phrase) => block.name.toLowerCase().includes(phrase)),
  );

  const chosen = matched.length > 0 ? matched : candidates.slice(0, 1);

  const selectedBlocks: SelectedBlock[] = chosen.map((block) => {
    const wiring: Record<string, string | null> = {};
    for (const input of block.requiredInputs) {
      const provider = chosen.find((b) => b.id !== block.id && b.outputs.includes(input));
      wiring[input] = provider ? provider.id : null;
    }
    return { blockId: block.id, wiring };
  });

  return { selectedBlocks };
}
