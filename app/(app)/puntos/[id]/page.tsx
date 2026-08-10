import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons, puntosDigitales } from "@/lib/db/schema";

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
    <div className="mx-auto max-w-3xl">
      <Link
        href="/puntos"
        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint hover:text-green-700"
      >
        ← Puntos digitales
      </Link>

      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-green-600">
        {punto.zona}
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">{punto.name}</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Elige un curso para ver sus lecciones y descargarlas a tu teléfono.
      </p>

      <ul className="mt-10 space-y-4">
        {publishedCourses.map((course, index) => (
          <li key={course.id} className="animate-sprout-in" style={{ animationDelay: `${index * 80}ms` }}>
            <Link
              href={`/puntos/${punto.id}/${course.id}`}
              className="glass btn-glow block rounded-[var(--radius-lg)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg font-bold text-ink">{course.title}</p>
                <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                  {course.lessonCount} lecciones
                </span>
              </div>
              {course.description && <p className="mt-1 text-[13px] text-ink-soft">{course.description}</p>}
            </Link>
          </li>
        ))}
        {publishedCourses.length === 0 && (
          <p className="text-ink-faint">Todavía no hay cursos publicados.</p>
        )}
      </ul>
    </div>
  );
}
