import { customAlphabet } from "nanoid";
import { rooms } from "../sockets/game";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const nanoid = customAlphabet(alphabet, 6);

export async function createGame() {
  const roomId = nanoid();

  rooms[roomId] = {
    status: "lobby",
    round: 0,
    players: {},
    answers: {},
    questions: [],
  };

  return roomId;
}
