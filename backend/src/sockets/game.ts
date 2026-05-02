import { FastifyInstance, FastifyRequest } from "fastify";
import { Rooms } from "../models/game.models.js";
import type { WebSocket } from "ws";

export const rooms: Rooms = {};

const roomSockets: Record<string, Record<string, WebSocket>> = {};

function broadcastRoom(roomId: string, message: unknown) {
  const sockets = roomSockets[roomId];
  if (!sockets) return;

  for (const socket of Object.values(sockets)) {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(message));
    }
  }
}

export async function gameSocket(fastify: FastifyInstance) {
  fastify.get(
    "/room/:roomId",
    { preHandler: [fastify.requireAuth], websocket: true },
    (socket: WebSocket, request: FastifyRequest) => {
      const { roomId } = request.params as { roomId: string };

      const userId = request.user.id;
      const userName = request.user.name;

      socket.on("message", (raw: string) => {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case "create":
            //créer la room
            break;

          case "join":
            if (!roomSockets[roomId]) {
              roomSockets[roomId] = {};
            }

            roomSockets[roomId][userId] = socket;

            rooms[roomId].players[userId] = { name: userName, score: 0 };
            rooms[roomId].answers[userId] = null;

            broadcastRoom(roomId, {
              playerNumber: Object.keys(rooms[roomId].players).length,
            });
            break;

          case "submit_answer":
            //ajouter réponse
            break;
        }
      });
    },
  );
}
