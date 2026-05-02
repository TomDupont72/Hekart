import { customAlphabet } from "nanoid";
import { Room, RoomManager } from "../models/game.models.js";
import type { WebSocket } from "ws";
import { countQuestions, getQuestionsByIds } from "../db/questions.db.js";
import { getRandomDistinct } from "../utils.js";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const nanoid = customAlphabet(alphabet, 6);

export async function createGame(roomManager: RoomManager) {
  const roomId = nanoid();

  const totalQuestions = await countQuestions();

  const questionIds = getRandomDistinct(10, totalQuestions);
  const questions = await getQuestionsByIds(questionIds);

  roomManager.rooms[roomId] = new Room();
  roomManager.sockets[roomId] = {};
  roomManager.rooms[roomId].questions = questions;

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
