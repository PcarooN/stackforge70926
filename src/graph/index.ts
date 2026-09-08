import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import type { PipelineState } from "../types.js";
import { parseIntentNode } from "./parse-intent.js";
import { selectBlocksNode } from "./select-blocks.js";
import { validateNode, routeAfterValidation } from "./validate.js";
import { clarifyNode, compileSpecNode } from "./finalize.js";

/**
 * LangGraph state channels. Each node returns a partial PipelineState;
 * LangGraph merges it into the running state between steps.
 */
const StateAnnotation = Annotation.Root({
  prompt: Annotation<PipelineState["prompt"]>,
  targetGame: Annotation<PipelineState["targetGame"]>,
  intent: Annotation<PipelineState["intent"]>,
  selectedBlocks: Annotation<PipelineState["selectedBlocks"]>,
  validationIssues: Annotation<PipelineState["validationIssues"]>,
  spec: Annotation<PipelineState["spec"]>,
  status: Annotation<PipelineState["status"]>,
  clarification: Annotation<PipelineState["clarification"]>,
  errors: Annotation<PipelineState["errors"]>,
});

const graph = new StateGraph(StateAnnotation)
  .addNode("parseIntent", parseIntentNode)
  .addNode("selectBlocks", selectBlocksNode)
  .addNode("validate", validateNode)
  .addNode("clarify", clarifyNode)
  .addNode("compileSpec", compileSpecNode)
  .addEdge(START, "parseIntent")
  .addEdge("parseIntent", "selectBlocks")
  .addEdge("selectBlocks", "validate")
  .addConditionalEdges("validate", routeAfterValidation, {
    clarify: "clarify",
    compile: "compileSpec",
  })
  .addEdge("clarify", END)
  .addEdge("compileSpec", END);

export const systemGenerationGraph = graph.compile();

export async function runGeneration(prompt: string, targetGame: PipelineState["targetGame"]) {
  const initialState: PipelineState = { prompt, targetGame, status: "pending" };
  const result = await systemGenerationGraph.invoke(initialState);
  return result as PipelineState;
}
