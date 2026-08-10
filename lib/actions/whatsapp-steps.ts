"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { whatsappSteps } from "@/lib/db/schema";

const stepSchema = z.object({
  kind: z.enum(["welcome", "lesson", "question", "closing"]),
  lessonId: z.coerce.number().optional(),
  messageText: z.string().min(2, "El mensaje es obligatorio"),
  question: z.string().optional(),
  optionsRaw: z.string().optional(),
  correctOptionIndex: z.coerce.number().optional(),
});

function parseStepForm(formData: FormData) {
  const parsed = stepSchema.parse({
    kind: formData.get("kind"),
    lessonId: formData.get("lessonId") || undefined,
    messageText: formData.get("messageText"),
    question: formData.get("question") || undefined,
    optionsRaw: formData.get("options") || undefined,
    correctOptionIndex: formData.get("correctOptionIndex") || undefined,
  });

  const isQuestion = parsed.kind === "question";
  const options = isQuestion
    ? (parsed.optionsRaw ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : undefined;

  return {
    kind: parsed.kind,
    lessonId: parsed.kind === "welcome" || parsed.kind === "closing" ? null : parsed.lessonId ?? null,
    messageText: parsed.messageText,
    question: isQuestion ? parsed.question ?? null : null,
    options: options && options.length > 0 ? options : null,
    correctOptionIndex: isQuestion ? parsed.correctOptionIndex ?? null : null,
  };
}

export async function createWhatsappStep(courseId: number, formData: FormData) {
  const data = parseStepForm(formData);

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${whatsappSteps.order}), 0)` })
    .from(whatsappSteps)
    .where(eq(whatsappSteps.courseId, courseId));

  await db.insert(whatsappSteps).values({
    courseId,
    order: maxOrder + 1,
    ...data,
  });

  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function updateWhatsappStep(stepId: number, courseId: number, formData: FormData) {
  const data = parseStepForm(formData);

  await db.update(whatsappSteps).set(data).where(eq(whatsappSteps.id, stepId));

  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function deleteWhatsappStep(stepId: number, courseId: number) {
  await db.delete(whatsappSteps).where(eq(whatsappSteps.id, stepId));
  revalidatePath(`/admin/cursos/${courseId}`);
}
