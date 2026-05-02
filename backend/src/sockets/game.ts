import { FastifyInstance, FastifyRequest } from "fastify";
import { RoomManager } from "../models/game.models.js";
import type { WebSocket } from "ws";
import { joinGame } from "../services/game.service.js";

export const roomManager = new RoomManager();

function broadcastRoom(roomId: string, message: unknown) {
  const sockets = roomManager.sockets[roomId];
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
      const name = request.user.name;

      socket.on("message", (raw: string) => {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case "join": {
            if (!roomManager.rooms[roomId]) {
              socket.send(JSON.stringify({ error: "Room not found" }));
              return;
            }

            const data = joinGame(userId, name, roomId, socket, roomManager);

            broadcastRoom(roomId, data);
            break;
          }

          case "submit_answer":
            //ajouter réponse
            break;
        }
      });
    },
  );
}
