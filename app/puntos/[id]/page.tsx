import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, puntosDigitales } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";
import { PageTransition } from "@/app/components/PageTransition";
import { ArrowLeftIcon, MapPinIcon, TagIcon, BookIcon, ArrowRightIcon } from "@/app/components/icons";

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
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader />

      <PageTransition>
        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Back button */}
            <Link
              href="/puntos"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Volver a Puntos Digitales</span>
            </Link>

            {/* Punto Info Card */}
            <div className="rounded-3xl bg-white p-7 sm:p-9 border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                  <MapPinIcon className="w-3.5 h-3.5" /> {punto.zona}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {publishedCourses.length} cursos disponibles
                </span>
              </div>
              <h1 className="font-display text-3xl font-black text-slate-900 sm:text-4xl">
                {punto.name}
              </h1>
              <p className="mt-2 text-base text-slate-600 font-medium">
                Elige el curso que deseas capacitarte para descargar sus lecciones en video o formato PDF.
              </p>
            </div>

            {/* Courses List */}
            <div className="space-y-5">
              {publishedCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="card-farmer animate-sprout-in p-7 sm:p-9"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
                      <TagIcon className="w-3.5 h-3.5 text-slate-500" /> {course.category ?? "Capacitación"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 border border-amber-200">
                      <BookIcon className="w-3.5 h-3.5 text-amber-700" /> {course.lessonCount} Lecciones
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl leading-snug">
                    {course.title}
                  </h3>

                  {course.description && (
                    <p className="mt-2 text-base text-slate-600 font-medium leading-relaxed">
                      {course.description}
                    </p>
                  )}

                  <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
                    <Link
                      href={`/puntos/${punto.id}/${course.id}`}
                      className="btn-farmer-primary text-base"
                    >
                      <span>Ver Lecciones y Descargar</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}

              {publishedCourses.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                  <BookIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="mt-3 text-lg font-bold text-slate-900">Todavía no hay cursos publicados para este punto.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
