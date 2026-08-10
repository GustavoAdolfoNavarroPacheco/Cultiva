import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, puntosDigitales } from "@/lib/db/schema";
import { logDownloadAction } from "@/lib/actions/downloads";
import { PublicHeader } from "@/app/components/PublicHeader";

export const dynamic = "force-dynamic";

function DownloadButton({
  puntoId,
  courseId,
  lessonId,
  fileType,
  url,
}: {
  puntoId: number;
  courseId: number;
  lessonId: number;
  fileType: "video" | "pdf";
  url: string;
}) {
  const isVideo = fileType === "video";

  return (
    <form action={logDownloadAction} className="w-full sm:w-auto">
      <input type="hidden" name="puntoId" value={puntoId} />
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="fileType" value={fileType} />
      <input type="hidden" name="url" value={url} />
      <button
        type="submit"
        className={isVideo ? "btn-farmer-primary w-full text-base" : "btn-farmer-secondary w-full text-base"}
      >
        <span>{isVideo ? "🎬 DESCARGAR VIDEO" : "📄 DESCARGAR GUÍA (PDF)"}</span>
      </button>
    </form>
  );
}

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

  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.order));

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50/40">
      <PublicHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <Link
            href={`/puntos/${puntoId}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-base font-bold text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm mb-6 min-h-[48px]"
          >
            <span>⬅</span>
            <span>Volver a {punto.name}</span>
          </Link>

          {/* Course Banner Header */}
          <div className="rounded-3xl bg-gradient-to-r from-green-900 to-green-700 p-6 sm:p-10 text-white shadow-xl shadow-green-900/20 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100 backdrop-blur-md">
                📍 {punto.name}
              </span>
              <span className="rounded-full bg-amber-400 text-green-950 px-3 py-1 text-xs font-black uppercase tracking-wider">
                {courseLessons.length} Lecciones
              </span>
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-3 text-lg text-emerald-100 font-medium leading-relaxed max-w-2xl">
                {course.description}
              </p>
            )}
          </div>

          {/* Lessons List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
              <span>📚</span> Lecciones para Descarga
            </h2>

            {courseLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="card-farmer animate-sprout-in p-6 sm:p-8"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 font-display text-base font-black text-white shadow-md">
                    {lesson.order}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider text-green-800">
                    Lección {lesson.order}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-emerald-950 sm:text-3xl mt-1">
                  {lesson.title}
                </h3>

                {lesson.summary && (
                  <p className="mt-2 text-base text-emerald-900/80 font-medium leading-relaxed">
                    {lesson.summary}
                  </p>
                )}

                {/* Download Actions Container */}
                <div className="mt-6 pt-4 border-t border-emerald-900/10 flex flex-wrap gap-3">
                  {lesson.videoUrl && (
                    <DownloadButton
                      puntoId={puntoId}
                      courseId={courseId}
                      lessonId={lesson.id}
                      fileType="video"
                      url={lesson.videoUrl}
                    />
                  )}
                  {lesson.pdfUrl && (
                    <DownloadButton
                      puntoId={puntoId}
                      courseId={courseId}
                      lessonId={lesson.id}
                      fileType="pdf"
                      url={lesson.pdfUrl}
                    />
                  )}
                  {!lesson.videoUrl && !lesson.pdfUrl && (
                    <p className="text-base text-emerald-900/60 font-medium italic">
                      Archivos de esta lección aún no están subidos.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {courseLessons.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-emerald-900/10 p-8">
                <span className="text-4xl">📄</span>
                <p className="mt-3 text-lg font-bold text-emerald-950">Este curso todavía no tiene lecciones.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
