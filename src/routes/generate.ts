import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { runGeneration } from "../graph/index.js";

const generateRequestSchema = z.object({
  prompt: z.string().min(3).max(2000),
  targetGame: z.enum(["fivem", "minecraft", "unturned"]),
});

export async function registerGenerateRoute(app: FastifyInstance) {
  app.post("/v1/generate", async (request, reply) => {
    const parsed = generateRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ status: "error", errors: parsed.error.issues.map((i) => i.message) });
    }

    const result = await runGeneration(parsed.data.prompt, parsed.data.targetGame);
    return reply.send(result);
  });
}
