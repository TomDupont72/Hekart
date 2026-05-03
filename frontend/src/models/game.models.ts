export type Room =
  | { status: "none" }
  | {
      status: "lobby";
      playerNumber: number;
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
        }
      >;
      answers: Record<string, number | null>;
    };
