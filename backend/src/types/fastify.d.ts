import { RoomManager } from "../models/game.models";

declare module "fastify" {
  interface FastifyInstance {
    roomManager: RoomManager;
  }
}
