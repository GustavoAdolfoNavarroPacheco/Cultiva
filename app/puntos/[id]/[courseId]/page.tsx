import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, puntosDigitales } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";
import { getCurrentUser } from "@/lib/auth/current-user";
import { LessonMediaActions } from "./LessonMediaActions";
import {
  ArrowLeftIcon,
  MapPinIcon,
  BookIcon,
} from "@/app/components/icons";

export const dynamic = "force-dynamic";

export default async function PuntoCoursePage({
  params,
}: {
  params: Promise<{ id: string; courseId: string }>;
}) {
  const { id, courseId: courseIdParam } = await params;
  const puntoId = Number(id);
  const courseId = Number(courseIdParam);
  if (Number.isNaN(puntoId) || Number.isNaN(courseId)) notFound();

  const [punto] = await db.select().from(puntosDigitales).where(eq(puntosDigitales.id, puntoId)).limit(1);
  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!punto || !course) notFound();

  const [courseLessons, user] = await Promise.all([
    db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(asc(lessons.order)),
    getCurrentUser(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader role={user?.role} />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Back button */}
          <Link
            href={`/puntos/${puntoId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Volver a {punto.name}</span>
          </Link>

          {/* Course Banner Header */}
          <div className="rounded-3xl bg-slate-900 p-8 sm:p-11 text-white shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-200 border border-slate-700">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-400" /> {punto.name}
              </span>
              <span className="rounded-full bg-emerald-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {courseLessons.length} Lecciones
              </span>
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-3 text-lg text-slate-300 font-medium leading-relaxed max-w-3xl">
                {course.description}
              </p>
            )}
          </div>

          {/* Lessons List */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <BookIcon className="w-6 h-6 text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900">
                Lecciones para Descarga y Previsualización
              </h2>
            </div>

            {courseLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="card-farmer p-7 sm:p-9"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-800 font-display text-sm font-bold text-white shadow-xs">
                    {lesson.order}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Lección {lesson.order}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl mt-1">
                  {lesson.title}
                </h3>

                {lesson.summary && (
                  <p className="mt-2 text-base text-slate-600 font-medium leading-relaxed">
                    {lesson.summary}
                  </p>
                )}

                {/* Download and Preview Actions Container */}
                <div className="mt-7 pt-5 border-t border-slate-100">
                  <LessonMediaActions
                    puntoId={puntoId}
                    courseId={courseId}
                    lessonId={lesson.id}
                    lessonTitle={lesson.title}
                    videoUrl={lesson.videoUrl}
                    pdfUrl={lesson.pdfUrl}
                  />
                  {!lesson.videoUrl && !lesson.pdfUrl && (
                    <p className="text-sm text-slate-400 font-medium italic">
                      Archivos de esta lección aún no están subidos.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {courseLessons.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                <BookIcon className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="mt-3 text-lg font-bold text-slate-900">Este curso todavía no tiene lecciones.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
