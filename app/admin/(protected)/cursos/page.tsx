import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/db/schema";
import { CourseCreateForm } from "./CourseForms";

async function getCourses() {
  return db
    .select({
      id: courses.id,
      title: courses.title,
      category: courses.category,
      published: courses.published,
      createdAt: courses.createdAt,
      lessonCount: sql<number>`count(${lessons.id})`,
    })
    .from(courses)
    .leftJoin(lessons, eq(lessons.courseId, courses.id))
    .groupBy(courses.id)
    .orderBy(desc(courses.createdAt));
}

export default async function CoursesPage() {
  const courseList = await getCourses();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Cursos</h1>
      <p className="mt-1 text-ink-soft">
        Cada curso alimenta a la vez las lecciones descargables y el flujo del agente de WhatsApp.
      </p>

      <div className="mt-8">
        <CourseCreateForm />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-paper-line bg-paper">
        <table className="w-full min-w-[560px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-paper-line text-ink-faint">
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Título</th>
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Categoría</th>
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Lecciones</th>
              <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em]">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {courseList.map((course) => (
              <tr key={course.id} className="border-b border-paper-line last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{course.title}</td>
                <td className="px-5 py-3 text-ink-soft">{course.category ?? "—"}</td>
                <td className="px-5 py-3 text-ink-soft">{course.lessonCount}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                      course.published ? "bg-offline/15 text-offline-ink" : "bg-ink/5 text-ink-faint"
                    }`}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/cursos/${course.id}`}
                    className="font-mono text-[12px] uppercase tracking-[0.08em] text-clay hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {courseList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-faint">
                  Todavía no hay cursos. Crea el primero arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
