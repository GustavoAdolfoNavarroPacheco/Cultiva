import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, whatsappSteps } from "@/lib/db/schema";

export const metadata = { title: "Agente de WhatsApp — Cultiva" };

export default async function WhatsappCoursesPage() {
  const publishedCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      category: courses.category,
      description: courses.description,
      stepCount: sql<number>`count(${whatsappSteps.id})`,
    })
    .from(courses)
    .leftJoin(whatsappSteps, eq(whatsappSteps.courseId, courses.id))
    .where(and(eq(courses.published, true)))
    .groupBy(courses.id);

  return (
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint hover:text-clay">
          ← Cultiva
        </Link>

        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.22em] text-whatsapp-ink">
          Agente de WhatsApp
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
          Elige un curso para empezar
        </h1>
        <p className="mt-3 text-ink-soft">
          Esta es una simulación del flujo guiado por chat — preguntas y respuestas fijas, como en la
          fase demo del agente.
        </p>

        <ul className="mt-10 space-y-4">
          {publishedCourses
            .filter((course) => course.stepCount > 0)
            .map((course) => (
              <li key={course.id}>
                <Link
                  href={`/whatsapp/${course.id}`}
                  className="block rounded-xl border border-paper-line bg-paper-deep/40 p-5 transition-colors hover:border-whatsapp"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-lg font-semibold text-ink">{course.title}</p>
                    <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                      {course.stepCount} pasos
                    </span>
                  </div>
                  {course.description && (
                    <p className="mt-1 text-[13px] text-ink-soft">{course.description}</p>
                  )}
                </Link>
              </li>
            ))}
          {publishedCourses.filter((course) => course.stepCount > 0).length === 0 && (
            <p className="text-ink-faint">
              Todavía no hay cursos con un flujo de WhatsApp configurado.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
