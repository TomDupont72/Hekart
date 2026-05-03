import type { WebSocket } from "ws";

const MAX_SCORE = 100;
const RATIO = 0.3;

type Player = {
  name: string;
  score: number;
};

type Question = {
  question: string;
  answer: number;
  unit: string | null;
};

export class Room {
  status: "lobby" | "playing" | "results" | "finished" = "lobby";
  round: number = 0;
  players: Record<string, Player> = {};
  answers: Record<string, number | null> = {};
  questions: Question[] = [];
  roundEndsAt: number | null = null;
  roundTimer: NodeJS.Timeout | null = null;

  addPlayer(userId: string, name: string) {
    this.players[userId] = { name, score: 0 };
    this.answers[userId] = null;
  }

  countPlayers() {
    return Object.keys(this.players).length;
  }

  calculateScores() {
    const answersArray = Object.values(this.answers).filter(
      (item) => item !== null,
    );

    const mean =
      answersArray.reduce((sum, val) => sum + val, 0) / answersArray.length;

    Object.keys(this.answers).forEach((key) => {
      if (this.answers[key] === null) {
        this.players[key].score = 0;
      } else {
        this.players[key].score =
          MAX_SCORE *
          Math.exp((-RATIO * Math.abs(this.answers[key] - mean)) / mean);
      }
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
}

export class RoomManager {
  rooms: Record<string, Room> = {};
  sockets: Record<string, Record<string, WebSocket>> = {};
}
