import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, puntosDigitales } from "@/lib/db/schema";
import { logDownloadAction } from "@/lib/actions/downloads";

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
  return (
    <form action={logDownloadAction}>
      <input type="hidden" name="puntoId" value={puntoId} />
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="fileType" value={fileType} />
      <input type="hidden" name="url" value={url} />
      <button
        type="submit"
        className={`rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.1em] ${
          fileType === "video"
            ? "bg-offline text-paper"
            : "border border-offline/50 text-offline-ink"
        }`}
      >
        Descargar {fileType === "video" ? "video" : "PDF"}
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
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/puntos/${puntoId}`}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint hover:text-clay"
        >
          ← {punto.name}
        </Link>

        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          {course.title}
        </h1>
        {course.description && <p className="mt-3 text-ink-soft">{course.description}</p>}

        <ul className="mt-10 space-y-4">
          {courseLessons.map((lesson) => (
            <li key={lesson.id} className="rounded-xl border border-paper-line bg-paper-deep/40 p-5">
              <p className="font-mono text-[11px] text-ink-faint">Lección {lesson.order}</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{lesson.title}</p>
              {lesson.summary && <p className="mt-1 text-[14px] text-ink-soft">{lesson.summary}</p>}

              <div className="mt-4 flex flex-wrap gap-3">
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
                  <p className="text-[13px] text-ink-faint">Sin archivos disponibles todavía.</p>
                )}
              </div>
            </li>
          ))}
          {courseLessons.length === 0 && (
            <p className="text-ink-faint">Este curso todavía no tiene lecciones.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
