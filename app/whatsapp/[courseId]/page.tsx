import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, whatsappSteps } from "@/lib/db/schema";
import { ChatSimulator } from "./ChatSimulator";

export const dynamic = "force-dynamic";

export default async function WhatsappCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId: courseIdParam } = await params;
  const courseId = Number(courseIdParam);
  if (Number.isNaN(courseId)) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) notFound();

  const [steps, courseLessons] = await Promise.all([
    db
      .select()
      .from(whatsappSteps)
      .where(eq(whatsappSteps.courseId, courseId))
      .orderBy(asc(whatsappSteps.order)),
    db.select().from(lessons).where(eq(lessons.courseId, courseId)),
  ]);

  if (steps.length === 0) notFound();

  const lessonsById = Object.fromEntries(courseLessons.map((lesson) => [lesson.id, lesson]));

  return (
    <div className="min-h-screen bg-paper-deep/40 px-6 py-16">
      <div className="mx-auto max-w-xl">
        <Link
          href="/whatsapp"
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint hover:text-clay"
        >
          ← Otros cursos
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
          {course.title}
        </h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          Simulación del agente de WhatsApp — fase demo con preguntas y respuestas fijas.
        </p>

        <div className="mt-8">
          <ChatSimulator courseId={courseId} steps={steps} lessonsById={lessonsById} />
        </div>
      </div>
    </div>
  );
}
