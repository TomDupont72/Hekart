export type Room =
  | { status: "none"; round: number }
  | {
      status: "lobby";
      playerNumber: number;
      round: number;
    }
  | {
      status: "playing";
      question: {
        question: string;
        answer: number;
        unit: string | null;
      };
      submitted: false;
      roundEndsAt: number;
      roundDuration: number;
      round: number;
    }
  | {
      status: "playing";
      question: {
        question: string;
        answer: number;
        unit: string | null;
      };
      submitted: true;
      answerNotSubmittedNumber: number;
      round: number;
    }
  | {
      status: "results";
      question: {
        question: string;
        answer: number;
        unit: string | null;
      };
      mean: number;
      players: Record<
        string,
        {
          name: string;
          score: number;
          totalScore: number;
          rank: number;
          lastRank: number;
        }
      >;
      answers: Record<string, number | null>;
      round: number;
      totalRounds: number;
      mode: "classic" | "mean";
    };
