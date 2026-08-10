import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/db/schema";
import { CourseCreateForm } from "./CourseForms";
import { BookIcon, ArrowRightIcon } from "@/app/components/icons";

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
    <div className="space-y-8">
      {/* Header matched strictly to Panel Principal font hierarchy */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
          Gestión de Cursos
        </h1>
        <p className="mt-1 text-base text-slate-600 font-medium">
          Cada curso alimenta a la vez las lecciones descargables y el flujo interactivo del agente de WhatsApp.
        </p>
      </div>

      {/* Creation Form */}
      <div className="animate-sprout-in">
        <CourseCreateForm />
      </div>

      {/* Existing Courses Table & Card Container with clear dividers */}
      <div className="card-farmer animate-sprout-in overflow-hidden" style={{ animationDelay: "120ms" }}>
        <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-xl font-bold text-slate-900">Cursos Registrados ({courseList.length})</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-500">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Nombre del Curso</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Lecciones</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {courseList.map((course) => (
                <tr
                  key={course.id}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4.5 font-bold text-slate-900 text-base">
                    {course.title}
                  </td>
                  <td className="px-6 py-4.5 text-slate-600 font-medium">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                      {course.category ?? "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-slate-700 font-bold">
                    {course.lessonCount} lecciones
                  </td>
                  <td className="px-6 py-4.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        course.published
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-slate-100 text-slate-600 border border-slate-300"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${course.published ? "bg-emerald-600" : "bg-slate-400"}`} />
                      {course.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <Link
                      href={`/admin/cursos/${course.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Gestionar</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {courseList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Todavía no hay cursos registrados. Utiliza el formulario superior para crear el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
