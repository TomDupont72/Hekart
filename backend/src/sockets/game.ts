import { FastifyInstance, FastifyRequest } from "fastify";
import { RoomManager } from "../models/game.models.js";
import type { WebSocket } from "ws";
import {
  endRound,
  joinGame,
  startRound,
  submitAnswer,
  ROUND_DURATION,
} from "../services/game.service.js";
import { SubmitAnswerSchema } from "../modules/game.schemas.js";

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

function broadcastRoomOnSubmitted(roomId: string, message: unknown) {
  const sockets = roomManager.sockets[roomId];
  const answers = roomManager.rooms[roomId].answers;
  if (!sockets) return;
  Object.keys(sockets).forEach((key) => {
    if (sockets[key].readyState === 1 && answers[key] !== null) {
      sockets[key].send(JSON.stringify(message));
    }
  });
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

        if (!roomManager.rooms[roomId]) {
          socket.send(JSON.stringify({ error: "Room not found" }));
          return;
        }

        switch (msg.type) {
          case "join": {
            const data = joinGame(userId, name, roomId, socket, roomManager);

            broadcastRoom(roomId, data);
            break;
          }

          case "start_round": {
            const data = startRound(roomId);

            broadcastRoom(roomId, data);
            setTimeout(() => {
              const data = endRound(roomId);
              broadcastRoom(roomId, data);
            }, ROUND_DURATION);
            break;
          }

          case "end_round": {
            const data = endRound(roomId);

            broadcastRoom(roomId, data);
            break;
          }

          case "submit_answer": {
            const formData = {
              answer: Number(msg.answer),
            };

            const result = SubmitAnswerSchema.safeParse(formData);

            if (!result.success) {
              socket.send(
                JSON.stringify({
                  error: "Message invalide.",
                  details: result.error.issues,
                }),
              );
              return;
            }

            const data = submitAnswer(roomId, userId, result.data.answer);

            broadcastRoomOnSubmitted(roomId, data);
            break;
          }
        }
      });
    },
  );
}
