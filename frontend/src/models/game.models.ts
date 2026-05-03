export type Room = {
  status?: "lobby" | "playing" | "results" | "finished";
  playerNumber?: number;
  question?: {
    question: string;
    answer: number;
    unit: string | null;
  };
  submitted?: boolean;
  answerNotSubmittedNumber?: number;
};
