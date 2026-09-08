import type { FastifyInstance } from "fastify";
import { BLOCK_REGISTRY } from "../blocks/registry.js";

export async function registerBlocksRoute(app: FastifyInstance) {
  app.get("/v1/blocks", async (request, reply) => {
    const category = (request.query as { category?: string }).category;
    const blocks = category ? BLOCK_REGISTRY.filter((b) => b.category === category) : BLOCK_REGISTRY;
    return reply.send({ blocks });
  });
}
