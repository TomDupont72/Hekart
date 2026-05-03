import { z } from "zod";

const GameSchema = z.object({
  roomId: z
    .string()
    .trim()
    .length(6)
    .regex(/^[A-Z0-9]+$/, "Id de partie invalide."),
  answer: z.number().min(0, "La réponse doit être un nombre positif."),
});

export const JoinGameSchema = GameSchema.pick({
  roomId: true,
});

export const SubmitAnswerSchema = GameSchema.pick({
  answer: true,
});
