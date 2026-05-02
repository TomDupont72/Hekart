type Player = {
  name: string;
  score: number;
};

type Room = {
  status: "lobby" | "playing" | "results" | "finished";
  round: number;
  players: Record<string, Player>;
  answers: Record<string, number | null>;
  questions: string[];
};

export type Rooms = Record<string, Room>;
