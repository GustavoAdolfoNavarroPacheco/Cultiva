import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, puntosDigitales } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";

export const dynamic = "force-dynamic";

export default async function PuntoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const puntoId = Number(id);
  if (Number.isNaN(puntoId)) notFound();

  const [punto] = await db.select().from(puntosDigitales).where(eq(puntosDigitales.id, puntoId)).limit(1);
  if (!punto) notFound();

  const publishedCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      category: courses.category,
      description: courses.description,
      lessonCount: sql<number>`count(${lessons.id})`,
    })
    .from(courses)
    .leftJoin(lessons, eq(lessons.courseId, courses.id))
    .where(and(eq(courses.published, true)))
    .groupBy(courses.id);

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50/40">
      <PublicHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <Link
            href="/puntos"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-base font-bold text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm mb-6 min-h-[48px]"
          >
            <span>⬅</span>
            <span>Volver a Puntos Digitales</span>
          </Link>

          {/* Punto Info Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-green-600/30 shadow-lg shadow-green-900/5 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-green-800 border border-green-300">
                📍 {punto.zona}
              </span>
              <span className="text-sm font-semibold text-emerald-800/80">
                {publishedCourses.length} cursos disponibles
              </span>
            </div>
            <h1 className="font-display text-3xl font-black text-emerald-950 sm:text-4xl">
              {punto.name}
            </h1>
            <p className="mt-2 text-lg text-emerald-900/80 font-medium">
              Elige el curso que deseas capacitarte para descargar sus lecciones en video o formato PDF.
            </p>
          </div>

          {/* Courses List */}
          <div className="space-y-5">
            {publishedCourses.map((course, index) => (
              <div
                key={course.id}
                className="card-farmer animate-sprout-in p-6 sm:p-8"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900 border border-emerald-200">
                    🏷️ {course.category ?? "Capacitación"}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 border border-amber-200">
                    📖 {course.lessonCount} Lecciones
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-emerald-950 sm:text-3xl leading-snug">
                  {course.title}
                </h3>

                {course.description && (
                  <p className="mt-2 text-base text-emerald-900/80 font-medium leading-relaxed">
                    {course.description}
                  </p>
                )}

                <div className="mt-6 pt-4 border-t border-emerald-900/10 flex justify-end">
                  <Link
                    href={`/puntos/${punto.id}/${course.id}`}
                    className="btn-farmer-primary text-base min-h-[52px]"
                  >
                    <span>Ver Lecciones y Descargar ➔</span>
                  </Link>
                </div>
              </div>
            ))}

            {publishedCourses.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-emerald-900/10 p-8">
                <span className="text-4xl">📚</span>
                <p className="mt-3 text-lg font-bold text-emerald-950">Todavía no hay cursos publicados para este punto.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
