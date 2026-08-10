import Link from "next/link";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, whatsappSteps } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";

export const metadata = { title: "Agente de WhatsApp — Agro.ai" };
export const dynamic = "force-dynamic";

export default async function WhatsappCoursesPage() {
  const publishedCourses = await db
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
    .groupBy(courses.id);

  const coursesWithSteps = publishedCourses.filter((course) => course.stepCount > 0);

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50/40">
      <PublicHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 p-6 sm:p-10 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-6 -mr-6 text-8xl opacity-10 pointer-events-none select-none">
              💬
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-green-100 backdrop-blur-md border border-white/20">
                <span>🟢</span> Asistente Virtual Interactivo
              </span>
              <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Aprende desde tu WhatsApp
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-emerald-100 font-medium leading-relaxed">
                Selecciona un curso a continuación para simular una conversación interactiva con nuestro asistente de inteligencia agropecuaria.
              </p>
            </div>
          </div>

          {/* Courses List */}
          <div className="mt-10">
            <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2 mb-6">
              <span>📚</span> Cursos Disponibles para WhatsApp ({coursesWithSteps.length})
            </h2>

            <div className="space-y-5">
              {coursesWithSteps.map((course, index) => (
                <div
                  key={course.id}
                  className="card-farmer animate-sprout-in p-6 sm:p-8"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900 border border-emerald-200">
                      🏷️ {course.category ?? "Agroindustria"}
                    </span>
                    <span className="rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-green-900 border border-green-300">
                      💬 {course.stepCount} Pasos de Chat
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
                      href={`/whatsapp/${course.id}`}
                      className="btn-farmer-primary text-base min-h-[52px]"
                    >
                      <span>Iniciar Clase por WhatsApp 💬</span>
                    </Link>
                  </div>
                </div>
              ))}

              {coursesWithSteps.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-emerald-900/10 p-8">
                  <span className="text-4xl">📭</span>
                  <p className="mt-3 text-lg font-bold text-emerald-950">
                    Todavía no hay cursos con un flujo de WhatsApp configurado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
