import "dotenv/config";
import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import { authRoutes } from "./routes/auth.js";
import websocket from "@fastify/websocket";
import { authGuard } from "./plugins/auth-guard.js";
import { gameSocket } from "./sockets/game.js";
import { gameRoutes } from "./routes/game.js";
import { RoomManager } from "./models/game.models.js";
import { socketGuard } from "./plugins/socket-guard.js";

const app = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024,
  trustProxy: true,
});

app.decorate("roomManager", new RoomManager());

await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

await app.register(helmet);

await app.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
});

await app.register(websocket);

app.get("/api/health", async () => {
  return { status: "ok" };
});

await app.register(authRoutes, { prefix: "/api/auth" });

await app.register(authGuard);
await app.register(socketGuard);

await app.register(gameRoutes, { prefix: "api/game" });
await app.register(gameSocket, { prefix: "ws/game" });

await app.listen({
  port: Number(process.env.PORT ?? 8000),
  host: process.env.HOST ?? "0.0.0.0",
});
