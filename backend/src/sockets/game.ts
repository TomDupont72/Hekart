import { FastifyInstance, FastifyRequest } from "fastify";
import { RoomManager } from "../models/game.models.js";
import type { WebSocket } from "ws";
import {
  endRound,
  joinGame,
  startRound,
  submitAnswer,
  ROUND_DURATION,
  leaveGame,
  ROUND_NUMBER,
  setParameters,
} from "../services/game.service.js";
import { SubmitAnswerSchema } from "../modules/game.schemas.js";

function broadcastRoom(
  roomId: string,
  roomManager: RoomManager,
  message: unknown,
) {
  const sockets = roomManager.sockets[roomId];
  if (!sockets) return;

  for (const socket of Object.values(sockets)) {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(message));
    }
  }
}

function broadcastRoomOnSubmitted(
  roomId: string,
  roomManager: RoomManager,
  message: unknown,
) {
  const sockets = roomManager.sockets[roomId];
  const answers = roomManager.rooms[roomId].answers;
  if (!sockets) return;
  Object.keys(sockets).forEach((key) => {
    if (sockets[key].readyState === 1 && answers[key] !== null) {
      sockets[key].send(JSON.stringify(message));
    }
  });
}

function broadcastRoomOnAdmin(roomManager: RoomManager) {
  const sockets = roomManager.adminSockets;
  if (!sockets) return;

  const message = {
    data: Object.fromEntries(
      Object.entries(roomManager.rooms).map(([key, value]) => [
        key,
        value.countPlayers(),
      ]),
    ),
  };

  for (const socket of Object.values(sockets)) {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(message));
    }
  }
}

export async function gameSocket(fastify: FastifyInstance) {
  fastify.get(
    "/room/:roomId",
    {
      preHandler: [fastify.requireAuth, fastify.requireSocket],
      websocket: true,
    },
    (socket: WebSocket, request: FastifyRequest) => {
      const roomManager: RoomManager = fastify.roomManager;

      const { roomId } = request.params as { roomId: string };

      const userId = request.user.id;
      const name = request.user.name;

      socket.on("message", (raw: string) => {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case "join": {
            const data = joinGame(userId, name, roomId, socket, roomManager);
            broadcastRoom(roomId, roomManager, data);
            broadcastRoomOnAdmin(roomManager);
            console.log(roomManager.adminSockets);
            break;
          }

          case "set_parameters": {
            if (roomManager.rooms[roomId].status !== "lobby") {
              socket.send(JSON.stringify({ error: "Game already started" }));
            }

            const mode = msg.mode;

            // Faire la validation

            setParameters(mode, roomId, roomManager);
            break;
          }

          case "start_round": {
            if (roomManager.rooms[roomId].status === "playing") {
              socket.send(JSON.stringify({ error: "Round already started" }));
            }

            const data = startRound(roomId, roomManager);

            broadcastRoom(roomId, roomManager, data);
            roomManager.rooms[roomId].roundTimer = setTimeout(() => {
              const data = endRound(roomId, roomManager);
              broadcastRoom(roomId, roomManager, data);
            }, ROUND_DURATION);
            break;
          }

          case "end_round": {
            if (roomManager.rooms[roomId].status !== "playing") {
              socket.send(JSON.stringify({ error: "Round already ended" }));
            }

            const data = endRound(roomId, roomManager);

            broadcastRoom(roomId, roomManager, data);
            break;
          }

          case "submit_answer": {
            if (roomManager.rooms[roomId].status !== "playing") {
              socket.send(JSON.stringify({ error: "Round already ended" }));
            }

            if (roomManager.rooms[roomId].answers[userId] !== null) {
              socket.send(JSON.stringify({ error: "Answer already sent" }));
            }

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

            const data = submitAnswer(
              roomId,
              userId,
              result.data.answer,
              roomManager,
            );

            if (data.answerNotSubmittedNumber === 0) {
              if (roomManager.rooms[roomId].roundTimer) {
                clearTimeout(roomManager.rooms[roomId].roundTimer);
                roomManager.rooms[roomId].roundTimer = null;
              }

              const data = endRound(roomId, roomManager);
              broadcastRoom(roomId, roomManager, data);
              break;
            }

            broadcastRoomOnSubmitted(roomId, roomManager, data);
            break;
          }

          case "leave_game": {
            if (
              roomManager.rooms[roomId].round !== ROUND_NUMBER &&
              roomManager.rooms[roomId].status != "lobby"
            ) {
              socket.send(JSON.stringify({ error: "Game not ended" }));
            }

            const data = leaveGame(roomId, userId, roomManager);
            socket.close();

            broadcastRoom(roomId, roomManager, data);
            broadcastRoomOnAdmin(roomManager);
            break;
          }

          default: {
            socket.send(JSON.stringify({ error: "Unknown message type" }));
          }
        }
      });
    },
  );

  fastify.get(
    "/rooms",
    {
      preHandler: [fastify.requireAuth /* Ajouter fastify.requireAdmin */],
      websocket: true,
    },
    (socket: WebSocket, request: FastifyRequest) => {
      const roomManager: RoomManager = fastify.roomManager;

      const userId = request.user.id;

      socket.on("message", (raw: string) => {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case "get_rooms": {
            // Refacto ici
            roomManager.adminSockets[userId] = socket;
            broadcastRoomOnAdmin(roomManager);
          }

          // Ne pas oublier de fermer la socket
        }
      });
    },
  );
}
