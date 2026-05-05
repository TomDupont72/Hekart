import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createGame } from "../services/game.service.js";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/create-game",
    { preHandler: [fastify.requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await createGame(fastify.roomManager);

      return reply.send({ data });
    },
  );
}
