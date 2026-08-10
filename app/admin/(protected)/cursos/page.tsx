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
      <h1 className="font-display text-3xl font-extrabold text-ink">Cursos</h1>
      <p className="mt-1 text-ink-soft">
        Cada curso alimenta a la vez las lecciones descargables y el flujo del agente de WhatsApp.
      </p>

      <div className="mt-8 animate-sprout-in">
        <CourseCreateForm />
      </div>

      <div
        className="glass animate-sprout-in mt-8 overflow-x-auto rounded-[var(--radius-lg)]"
        style={{ animationDelay: "120ms" }}
      >
        <table className="w-full min-w-[560px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-white/60 text-ink-faint">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Título</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Categoría</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Lecciones</th>
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {courseList.map((course) => (
              <tr key={course.id} className="border-b border-white/50 transition-colors last:border-0 hover:bg-white/40">
                <td className="px-5 py-3 font-medium text-ink">{course.title}</td>
                <td className="px-5 py-3 text-ink-soft">{course.category ?? "—"}</td>
                <td className="px-5 py-3 text-ink-soft">{course.lessonCount}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${
                      course.published ? "bg-green-100 text-green-700" : "bg-ink/5 text-ink-faint"
                    }`}
                  >
                    {course.published ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/cursos/${course.id}`}
                    className="text-[12px] font-semibold uppercase tracking-[0.06em] text-green-700 hover:underline"
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
