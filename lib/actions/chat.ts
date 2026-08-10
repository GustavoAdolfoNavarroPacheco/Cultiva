"use server";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chatSessions, whatsappSteps, type ChatAnswer } from "@/lib/db/schema";

async function getMaxOrder(courseId: number) {
  const steps = await db
    .select({ order: whatsappSteps.order })
    .from(whatsappSteps)
    .where(eq(whatsappSteps.courseId, courseId));
  return steps.reduce((max, step) => Math.max(max, step.order), 0);
}

export async function startOrResumeChatSession(courseId: number, existingToken?: string | null) {
  if (existingToken) {
    const [existing] = await db
      .select()
      .from(chatSessions)
      .where(and(eq(chatSessions.token, existingToken), eq(chatSessions.courseId, courseId)))
      .limit(1);
    if (existing) return existing;
  }

  const token = randomUUID();
  const [session] = await db
    .insert(chatSessions)
    .values({ courseId, token, currentStepOrder: 1 })
    .returning();

  return session;
}

export async function advanceChatSession(token: string) {
  const [session] = await db.select().from(chatSessions).where(eq(chatSessions.token, token)).limit(1);
  if (!session) throw new Error("Sesión no encontrada");

  const maxOrder = await getMaxOrder(session.courseId);
  const nextOrder = session.currentStepOrder + 1;
  const completed = nextOrder > maxOrder;

  const [updated] = await db
    .update(chatSessions)
    .set({
      currentStepOrder: completed ? maxOrder : nextOrder,
      completed,
      updatedAt: new Date(),
    })
    .where(eq(chatSessions.id, session.id))
    .returning();

  return updated;
}

export async function resetChatSession(courseId: number, token: string) {
  await db.delete(chatSessions).where(eq(chatSessions.token, token));
  return startOrResumeChatSession(courseId, null);
}

export async function submitAnswer(token: string, stepId: number, optionIndex: number) {
  const [session] = await db.select().from(chatSessions).where(eq(chatSessions.token, token)).limit(1);
  if (!session) throw new Error("Sesión no encontrada");

  const [step] = await db.select().from(whatsappSteps).where(eq(whatsappSteps.id, stepId)).limit(1);
  if (!step) throw new Error("Paso no encontrado");

  const correct = step.correctOptionIndex === optionIndex;
  const answer: ChatAnswer = { stepId, optionIndex, correct };
  const answers = [...session.answers, answer];

  const maxOrder = await getMaxOrder(session.courseId);
  const nextOrder = session.currentStepOrder + 1;
  const completed = nextOrder > maxOrder;

  const [updated] = await db
    .update(chatSessions)
    .set({
      answers,
      currentStepOrder: completed ? maxOrder : nextOrder,
      completed,
      updatedAt: new Date(),
    })
    .where(eq(chatSessions.id, session.id))
    .returning();

  return { session: updated, correct };
}
