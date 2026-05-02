import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createGame } from "../services/game.service.js";
import { roomManager } from "../sockets/game.js";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/create-game",
    { preHandler: [fastify.requireAuth] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = createGame(roomManager);

      return reply.send({ data });
    },
  );
}
