import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, whatsappSteps } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";
import { PageTransition } from "@/app/components/PageTransition";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ChatIcon, BookIcon, TagIcon, ArrowRightIcon } from "@/app/components/icons";

export const metadata = { title: "Agente de WhatsApp — Plataforma Educativa Sector Agro" };
export const dynamic = "force-dynamic";

export default async function WhatsappCoursesPage() {
  const [publishedCourses, user] = await Promise.all([
    db
      .select({
        id: courses.id,
        title: courses.title,
        category: courses.category,
        description: courses.description,
        stepCount: sql<number>`count(${whatsappSteps.id})`,
      })
      .from(courses)
      .leftJoin(whatsappSteps, eq(whatsappSteps.courseId, courses.id))
      .where(and(eq(courses.published, true)))
      .groupBy(courses.id),
    getCurrentUser(),
  ]);

  const coursesList = publishedCourses;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader role={user?.role} />

      <PageTransition>
        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-5xl space-y-10">
            {/* Hero Banner */}
            <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl border border-slate-800">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-3.5 py-1 text-xs font-normal uppercase tracking-wider text-emerald-300 border border-emerald-800/80 mb-4">
                  <ChatIcon className="w-4 h-4 text-emerald-400" /> Asistente Virtual Interactivo
                </span>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
                  Aprende desde tu WhatsApp
                </h1>
                <p className="mt-3 text-lg text-slate-300 font-medium leading-relaxed">
                  Selecciona un curso a continuación para interactuar paso a paso con nuestro tutor de inteligencia agropecuaria, resolver quizzes y descargar guías en PDF.
                </p>
              </div>
            </div>

            {/* Courses List */}
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <BookIcon className="w-6 h-6 text-emerald-700" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Cursos Disponibles para WhatsApp ({coursesList.length})
                </h2>
              </div>

              <div className="space-y-5">
                {coursesList.map((course) => (
                  <div
                    key={course.id}
                    className="card-farmer p-7 sm:p-9"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1 text-xs font-normal uppercase tracking-wider text-slate-700 border border-slate-200">
                        <TagIcon className="w-3.5 h-3.5 text-slate-500" /> {course.category ?? "Agroindustria"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1 text-xs font-normal uppercase tracking-wider text-emerald-900 border border-emerald-200">
                        <ChatIcon className="w-3.5 h-3.5 text-emerald-700" /> Tutor IA Activo
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl leading-snug">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="mt-2 text-base text-slate-600 font-normal leading-relaxed">
                        {course.description}
                      </p>
                    )}

                    <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
                      <Link
                        href={`/whatsapp/${course.id}`}
                        className="btn-farmer-primary text-base"
                      >
                        <span>Iniciar Clase por WhatsApp</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {coursesList.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                    <ChatIcon className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="mt-3 text-lg font-bold text-slate-900">
                      Todavía no hay cursos publicados.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
