import type { PipelineState, ValidationIssue } from "../types.js";
import { getBlockById } from "../blocks/registry.js";

/**
 * Checks that every required input on every selected block is either
 * wired to an upstream block's output, or flagged as unresolved.
 * This is the safety net that catches malformed compositions before
 * they're compiled into a spec.
 */
export function validateNode(state: PipelineState): Partial<PipelineState> {
  if (!state.selectedBlocks) {
    return { status: "error", errors: ["validateNode ran without selected blocks"] };
  }

  const issues: ValidationIssue[] = [];

  for (const selected of state.selectedBlocks) {
    const def = getBlockById(selected.blockId);
    if (!def) {
      issues.push({ blockId: selected.blockId, input: "-", message: "Unknown block id" });
      continue;
    }
    for (const input of def.requiredInputs) {
      if (!selected.wiring[input]) {
        issues.push({
          blockId: selected.blockId,
          input,
          message: `"${def.name}" needs "${input}" but no block in this system provides it`,
        });
      }
    }
  }

  return { validationIssues: issues };
}

export function routeAfterValidation(state: PipelineState): "compile" | "clarify" {
  return state.validationIssues && state.validationIssues.length > 0 ? "clarify" : "compile";
}
