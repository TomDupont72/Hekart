import { customAlphabet } from "nanoid";
import { Room, RoomManager } from "../models/game.models.js";
import type { WebSocket } from "ws";
import { countQuestions, getQuestionsByIds } from "../db/questions.db.js";
import { getRandomDistinct } from "../utils.js";
import { roomManager } from "../sockets/game.js";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const ROUND_DURATION = 10 * 1000;
const ROUND_NUMBER = 2;

const nanoid = customAlphabet(ALPHABET, 6);

export async function createGame(roomManager: RoomManager) {
  const roomId = nanoid();

  const totalQuestions = await countQuestions();

  const questionIds = getRandomDistinct(ROUND_NUMBER, totalQuestions);
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
    status: roomManager.rooms[roomId].status,
    playerNumber: roomManager.rooms[roomId].countPlayers(),
    round: roomManager.rooms[roomId].round,
  };
}

export function startRound(roomId: string) {
  roomManager.rooms[roomId].status = "playing";
  roomManager.rooms[roomId].clearAnswers();
  roomManager.rooms[roomId].roundEndsAt = Date.now() + ROUND_DURATION;

  return {
    status: roomManager.rooms[roomId].status,
    question:
      roomManager.rooms[roomId].questions[roomManager.rooms[roomId].round],
    submitted: false,
    roundEndsAt: roomManager.rooms[roomId].roundEndsAt,
    roundDuration: ROUND_DURATION / 1000,
    round: roomManager.rooms[roomId].round,
  };
}

export function endRound(roomId: string) {
  roomManager.rooms[roomId].status = "results";
  roomManager.rooms[roomId].updateLastRank();
  roomManager.rooms[roomId].calculateScores();
  roomManager.rooms[roomId].calculateRank();
  roomManager.rooms[roomId].round += 1;

  return {
    status: roomManager.rooms[roomId].status,
    question:
      roomManager.rooms[roomId].questions[roomManager.rooms[roomId].round - 1],
    mean: roomManager.rooms[roomId].mean,
    players: roomManager.rooms[roomId].players,
    answers: roomManager.rooms[roomId].answers,
    round: roomManager.rooms[roomId].round,
    totalRounds: ROUND_NUMBER,
  };
}

export function submitAnswer(roomId: string, userId: string, answer: number) {
  roomManager.rooms[roomId].answers[userId] = answer;

  return {
    status: roomManager.rooms[roomId].status,
    question:
      roomManager.rooms[roomId].questions[roomManager.rooms[roomId].round],
    submitted: true,
    answerNotSubmittedNumber:
      roomManager.rooms[roomId].countAnswersNotSubmitted(),
    round: roomManager.rooms[roomId].round,
  };
}

export function endGame(roomId: string, userId: string) {
  delete roomManager.sockets[roomId][userId];

  if (Object.keys(roomManager.sockets[roomId]).length === 0) {
    if (roomManager.rooms[roomId].roundTimer) {
      clearTimeout(roomManager.rooms[roomId].roundTimer);
      roomManager.rooms[roomId].roundTimer = null;
    }

    delete roomManager.sockets[roomId];
    delete roomManager.rooms[roomId];
  }
}
