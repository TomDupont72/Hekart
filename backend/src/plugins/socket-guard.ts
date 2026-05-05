import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { MAX_PLAYER } from "../services/game.service.js";
import fp from "fastify-plugin";

async function socketGuardPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "requireSocket",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { roomId } = request.params as { roomId: string };
      const roomManager = fastify.roomManager;
      const userId = request.user.id;
      const room = roomManager.rooms[roomId];

      if (!room) {
        return reply.status(404).send({ message: "Room not found" });
      }

      if (
        room.status === "lobby" &&
        !room.players[userId] &&
        room.countPlayers() >= MAX_PLAYER
      ) {
        return reply.status(403).send({ message: "The room is full" });
      }

      if (room.status !== "lobby" && !room.players[userId]) {
        return reply.status(403).send({ message: "Access forbidden" });
      }
    },
  );
}

export const socketGuard = fp(socketGuardPlugin);

declare module "fastify" {
  interface FastifyInstance {
    requireSocket: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
