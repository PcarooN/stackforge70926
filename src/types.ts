export type TargetGame = "fivem" | "minecraft" | "unturned";

export type BlockCategory = "economy" | "admin" | "events" | "progression";

/**
 * A block is a pre-tested unit that can be composed with others.
 * This registry is the "library" — the LLM never invents blocks,
 * it only selects and parameterizes ones that already exist here.
 */
export interface BlockDefinition {
  id: string;
  category: BlockCategory;
  name: string;
  description: string;
  supportedGames: TargetGame[];
  /** Trigger keywords this block responds to during intent matching. */
  triggerKeywords: string[];
  /** Named inputs this block requires to be wired from other blocks or user params. */
  requiredInputs: string[];
  /** Named outputs this block exposes for downstream blocks to consume. */
  outputs: string[];
}

export interface ParsedIntent {
  category: BlockCategory;
  /** Short phrases describing what should trigger the system, e.g. "on player join". */
  triggers: string[];
  /** Short phrases describing what should happen, e.g. "grant starter pack". */
  actions: string[];
  /** True if the model could not confidently classify the request. */
  ambiguous: boolean;
}

export interface SelectedBlock {
  blockId: string;
  /** Wiring: which required input is satisfied by which upstream block's output. */
  wiring: Record<string, string | null>;
}

export interface ValidationIssue {
  blockId: string;
  input: string;
  message: string;
}

export interface GeneratedSpec {
  targetGame: TargetGame;
  category: BlockCategory;
  blocks: SelectedBlock[];
  createdAt: string;
}

/** The state object threaded through every node in the LangGraph pipeline. */
export interface PipelineState {
  prompt: string;
  targetGame: TargetGame;
  intent?: ParsedIntent;
  selectedBlocks?: SelectedBlock[];
  validationIssues?: ValidationIssue[];
  spec?: GeneratedSpec;
  status: "pending" | "needs_clarification" | "error" | "ok";
  clarification?: string;
  errors?: string[];
}
