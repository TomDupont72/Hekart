import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";
import { prisma } from "../db/prisma.js";

async function authGuardPlugin(app: FastifyInstance) {
  app.decorate(
    "requireAuth",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.session?.userId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.session.userId },
        select: {
          name: true,
        },
      });

      if (!user) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      req.user = {
        id: session.session.userId,
        name: user.name,
      };
    },
  );
}

export const authGuard = fp(authGuardPlugin);

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>;
  }

  interface FastifyRequest {
    user: {
      id: string;
      name: string;
    };
  }
}
