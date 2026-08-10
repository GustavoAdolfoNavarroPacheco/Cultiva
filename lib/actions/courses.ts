"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { slugify } from "@/lib/utils/slugify";

const courseSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export type CourseFormState = { error?: string };

async function uniqueSlug(base: string, ignoreId?: number) {
  const slugBase = slugify(base) || "curso";
  let slug = slugBase;
  let attempt = 1;

  while (true) {
    const existing = await db.select({ id: courses.id }).from(courses).where(eq(courses.slug, slug));
    const conflict = existing.find((row) => row.id !== ignoreId);
    if (!conflict) return slug;
    attempt += 1;
    slug = `${slugBase}-${attempt}`;
  }
}

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = await uniqueSlug(parsed.data.title);

  const [course] = await db
    .insert(courses)
    .values({
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      published: parsed.data.published ?? false,
      slug,
    })
    .returning();

  revalidatePath("/admin/cursos");
  redirect(`/admin/cursos/${course.id}`);
}

export async function updateCourse(
  courseId: number,
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = await uniqueSlug(parsed.data.title, courseId);

  await db
    .update(courses)
    .set({
      title: parsed.data.title,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      published: parsed.data.published ?? false,
      slug,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId));

  revalidatePath("/admin/cursos");
  revalidatePath(`/admin/cursos/${courseId}`);
  return {};
}

export async function deleteCourse(courseId: number) {
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/admin/cursos");
  redirect("/admin/cursos");
}
