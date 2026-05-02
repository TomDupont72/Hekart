import { z } from "zod";

const GameSchema = z.object({
  roomId: z
    .string()
    .trim()
    .length(6)
    .regex(/^[A-Z0-9]+$/, "Id de partie invalide."),
});

export const JoinGameSchema = GameSchema.pick({
  roomId: true,
});
