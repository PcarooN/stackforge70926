import type { PipelineState } from "../types.js";

export function clarifyNode(state: PipelineState): Partial<PipelineState> {
  const lines = (state.validationIssues ?? []).map((i) => `- ${i.message}`);
  return {
    status: "needs_clarification",
    clarification:
      `This system is missing a few connections before it can be built:\n` + lines.join("\n"),
  };
}

export function compileSpecNode(state: PipelineState): Partial<PipelineState> {
  if (!state.selectedBlocks || !state.intent) {
    return { status: "error", errors: ["compileSpecNode ran without selected blocks or intent"] };
  }

  return {
    status: "ok",
    spec: {
      targetGame: state.targetGame,
      category: state.intent.category,
      blocks: state.selectedBlocks,
      createdAt: new Date().toISOString(),
    },
  };
}
