"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";

const lessonSchema = z.object({
  title: z.string().min(2, "El título es obligatorio"),
  summary: z.string().optional(),
  videoUrl: z.string().url("URL de video inválida").or(z.literal("")).optional(),
  pdfUrl: z.string().url("URL de PDF inválida").or(z.literal("")).optional(),
});

export async function createLesson(courseId: number, formData: FormData) {
  const parsed = lessonSchema.parse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    videoUrl: formData.get("videoUrl"),
    pdfUrl: formData.get("pdfUrl"),
  });

  const [{ maxOrder }] = await db
    .select({ maxOrder: sql<number>`coalesce(max(${lessons.order}), 0)` })
    .from(lessons)
    .where(eq(lessons.courseId, courseId));

  await db.insert(lessons).values({
    courseId,
    order: maxOrder + 1,
    title: parsed.title,
    summary: parsed.summary || null,
    videoUrl: parsed.videoUrl || null,
    pdfUrl: parsed.pdfUrl || null,
  });

  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function updateLesson(lessonId: number, courseId: number, formData: FormData) {
  const parsed = lessonSchema.parse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    videoUrl: formData.get("videoUrl"),
    pdfUrl: formData.get("pdfUrl"),
  });

  await db
    .update(lessons)
    .set({
      title: parsed.title,
      summary: parsed.summary || null,
      videoUrl: parsed.videoUrl || null,
      pdfUrl: parsed.pdfUrl || null,
    })
    .where(eq(lessons.id, lessonId));

  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function deleteLesson(lessonId: number, courseId: number) {
  await db.delete(lessons).where(eq(lessons.id, lessonId));
  revalidatePath(`/admin/cursos/${courseId}`);
}
