import { customAlphabet } from "nanoid";
import { Room, RoomManager } from "../models/game.models.js";
import type { WebSocket } from "ws";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const nanoid = customAlphabet(alphabet, 6);

export function createGame(roomManager: RoomManager) {
  const roomId = nanoid();

  roomManager.rooms[roomId] = new Room();
  roomManager.sockets[roomId] = {};

  return roomId;
}

export function joinGame(
  userId: string,
  name: string,
  roomId: string,
  socket: WebSocket,
  roomManager: RoomManager,
) {
  roomManager.sockets[roomId][userId] = socket;
  roomManager.rooms[roomId].addPlayer(userId, name);

  return {
    playerNumber: roomManager.rooms[roomId].countPlayers(),
  };
}
