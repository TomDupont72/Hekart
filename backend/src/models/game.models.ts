import type { WebSocket } from "ws";
import { rankDict } from "../utils.js";

const MAX_SCORE = 100;
const RATIO = 5;

type Player = {
  name: string;
  score: number;
  totalScore: number;
  rank: number;
  lastRank: number;
};

type Question = {
  question: string;
  answer: number;
  unit: string | null;
};

export class Room {
  status: "lobby" | "playing" | "results" = "lobby";
  round: number = 0;
  players: Record<string, Player> = {};
  answers: Record<string, number | null> = {};
  questions: Question[] = [];
  roundEndsAt: number | null = null;
  roundTimer: NodeJS.Timeout | null = null;
  mean: number = 0;

  addPlayer(userId: string, name: string) {
    this.players[userId] = {
      name,
      score: 0,
      totalScore: 0,
      rank: 0,
      lastRank: 0,
    };
    this.answers[userId] = null;
  }

  countPlayers() {
    return Object.keys(this.players).length;
  }

  calculateScores() {
    const question = this.questions[this.round];
    if (!question) return;

    if (Object.keys(this.players).length === 2) {
      this.mean = this.questions[this.round].answer;
    } else {
      const answersArray = Object.values(this.answers).filter(
        (item): item is number =>
          item !== null &&
          item >= question.answer * 0.01 &&
          item <= question.answer * 100,
      );

      const mean =
        answersArray.length > 0
          ? answersArray.reduce((sum, val) => sum + val, 0) /
            answersArray.length
          : 0;

      this.mean = Math.round(mean * 100) / 100;
    }

    Object.keys(this.answers).forEach((key) => {
      if (this.answers[key] === null || this.answers[key] === 0) {
        this.players[key].score = 0;
      } else {
        const diff = Math.max(
          this.answers[key] / this.mean,
          this.mean / this.answers[key],
        );
        this.players[key].score = Math.round(
          MAX_SCORE / (1 + RATIO * (diff - 1) ** 2),
        );
      }

      this.players[key].totalScore += this.players[key].score;
    });
  }

  clearAnswers() {
    Object.keys(this.answers).forEach((key) => {
      this.answers[key] = null;
    });
  }

  countAnswersNotSubmitted() {
    return Object.values(this.answers).filter((item) => item == null).length;
  }

  calculateRank() {
    const ranks = rankDict(
      Object.fromEntries(
        Object.keys(this.players).map((key) => {
          return [key, this.players[key].totalScore];
        }),
      ),
    );

    Object.keys(this.players).forEach((key) => {
      this.players[key].rank = ranks[key];
    });
  }

  updateLastRank() {
    Object.keys(this.players).forEach((key) => {
      this.players[key].lastRank = this.players[key].rank;
    });
  }
}

export class RoomManager {
  rooms: Record<string, Room> = {};
  sockets: Record<string, Record<string, WebSocket>> = {};
}
