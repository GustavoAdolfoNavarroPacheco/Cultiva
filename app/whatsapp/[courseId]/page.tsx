import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, whatsappSteps } from "@/lib/db/schema";
import { ChatSimulator } from "./ChatSimulator";
import { PublicHeader } from "@/app/components/PublicHeader";
import { ArrowLeftIcon } from "@/app/components/icons";

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
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Back button */}
          <Link
            href="/whatsapp"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Volver a Cursos de WhatsApp</span>
          </Link>

          {/* Header */}
          <div>
            <h1 className="font-display text-3xl font-black text-slate-900 sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-2 text-base text-slate-600 font-medium">
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
