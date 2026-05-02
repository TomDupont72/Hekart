import type { WebSocket } from "ws";

type Player = {
  name: string;
  score: number;
};

export class Room {
  status: "lobby" | "playing" | "results" | "finished" = "lobby";
  round: number = 0;
  players: Record<string, Player> = {};
  anwsers: Record<string, number | null> = {};
  questions: string[] = [];

  addPlayer(userId: string, name: string) {
    this.players[userId] = { name, score: 0 };
    this.anwsers[userId] = null;
  }

  countPlayers() {
    return Object.keys(this.players).length;
  }
}

export class RoomManager {
  rooms: Record<string, Room> = {};
  sockets: Record<string, Record<string, WebSocket>> = {};
}
