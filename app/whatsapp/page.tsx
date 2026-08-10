import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, whatsappSteps } from "@/lib/db/schema";

export const metadata = { title: "Agente de WhatsApp — Agro.ai" };
export const dynamic = "force-dynamic";

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

  const coursesWithSteps = publishedCourses.filter((course) => course.stepCount > 0);

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin"
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint hover:text-green-700"
        >
          ← Panel
        </Link>

        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-green-600">
          Agente de WhatsApp
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          Elige un curso para empezar
        </h1>
        <p className="mt-3 text-ink-soft">
          Esta es una simulación del flujo guiado por chat — preguntas y respuestas fijas, como en la
          fase demo del agente.
        </p>

        <ul className="mt-10 space-y-4">
          {coursesWithSteps.map((course, index) => (
            <li key={course.id} className="animate-sprout-in" style={{ animationDelay: `${index * 80}ms` }}>
              <Link
                href={`/whatsapp/${course.id}`}
                className="glass btn-glow block rounded-[var(--radius-lg)] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-bold text-ink">{course.title}</p>
                  <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                    {course.stepCount} pasos
                  </span>
                </div>
                {course.description && (
                  <p className="mt-1 text-[13px] text-ink-soft">{course.description}</p>
                )}
              </Link>
            </li>
          ))}
          {coursesWithSteps.length === 0 && (
            <p className="text-ink-faint">
              Todavía no hay cursos con un flujo de WhatsApp configurado.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
