import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
});

app.get("/health", async () => {
  return { status: "ok" };
});

await app.listen({
  port: Number(process.env.PORT ?? 8000),
  host: process.env.HOST ?? "0.0.0.0",
});
