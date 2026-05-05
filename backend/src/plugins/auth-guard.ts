import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";
import { prisma } from "../db/prisma.js";

async function authGuardPlugin(fastify: FastifyInstance) {
  fastify.decorate(
    "requireAuth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
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

      request.user = {
        id: session.session.userId,
        name: user.name,
      };
    },
  );
}

export const authGuard = fp(authGuardPlugin);

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }

  interface FastifyRequest {
    user: {
      id: string;
      name: string;
    };
  }
}
