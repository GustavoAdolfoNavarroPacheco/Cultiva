import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, whatsappSteps } from "@/lib/db/schema";
import { ChatSimulator } from "./ChatSimulator";
import { PublicHeader } from "@/app/components/PublicHeader";

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
    <div className="flex min-h-screen flex-col bg-emerald-50/40">
      <PublicHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Back button */}
          <Link
            href="/whatsapp"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-base font-bold text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm mb-6 min-h-[48px]"
          >
            <span>⬅</span>
            <span>Volver a Cursos de WhatsApp</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-3xl font-black text-emerald-950 sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-2 text-base text-emerald-900/80 font-medium">
              Simulador interactivo del Agente Agro.ai. Responde las preguntas para completar el curso.
            </p>
          </div>

          {/* Simulator Component */}
          <div>
            <ChatSimulator courseId={courseId} steps={steps} lessonsById={lessonsById} />
          </div>
        </div>
      </main>
    </div>
  );
}
