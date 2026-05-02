import { prisma } from "./prisma.js";

export async function countQuestions() {
  return await prisma.questions.count();
}

export async function getQuestionsByIds(ids: number[]) {
  return await prisma.questions.findMany({
    where: { id: { in: ids } },
    select: {
      question: true,
      answer: true,
      unit: true,
    },
  });
}
