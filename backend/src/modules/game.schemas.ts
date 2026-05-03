import { z } from "zod";

const GameSchema = z.object({
  answer: z.number().min(0, "La réponse doit être un nombre positif."),
});

export const SubmitAnswerSchema = GameSchema.pick({
  answer: true,
});
