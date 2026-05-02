import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createGame } from "../services/game.service";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/create-game",
    { preHandler: [fastify.requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await createGame();

      return reply.send({ data });
    },
  );
}
