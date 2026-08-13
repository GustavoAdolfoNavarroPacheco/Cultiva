import Link from "next/link";
import { and, eq, sql, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  courses,
  whatsappSteps,
  chatSessions,
  whatsappConversations,
  whatsappMessages,
} from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";
import { PageTransition } from "@/app/components/PageTransition";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  ChatIcon,
  BookIcon,
  TagIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@/app/components/icons";

export const metadata = { title: "Agente de WhatsApp — Plataforma Educativa Sector Agro" };
export const dynamic = "force-dynamic";

export default async function WhatsappCoursesPage() {
  const [publishedCourses, allSteps, user] = await Promise.all([
    db
      .select({
        id: courses.id,
        title: courses.title,
        category: courses.category,
        description: courses.description,
      })
      .from(courses)
      .where(eq(courses.published, true))
      .orderBy(asc(courses.id)),
    db
      .select({
        id: whatsappSteps.id,
        courseId: whatsappSteps.courseId,
        order: whatsappSteps.order,
      })
      .from(whatsappSteps),
    getCurrentUser(),
  ]);

  const studentId = user?.role === "student" ? Number(user.sub) : null;

  // Mapa de max steps por curso
  const maxStepsByCourse: Record<number, number> = {};
  for (const s of allSteps) {
    maxStepsByCourse[s.courseId] = Math.max(maxStepsByCourse[s.courseId] || 0, s.order);
  }

  // Cargar sesiones y conversaciones del estudiante si está logeado
  let sessionsByCourse: Record<number, { currentStepOrder: number; completed: boolean }> = {};
  let hasGlobalCompletionInChat = false;

  if (studentId) {
    const studentSessions = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.studentId, studentId));

    for (const s of studentSessions) {
      sessionsByCourse[s.courseId] = {
        currentStepOrder: s.currentStepOrder,
        completed: s.completed,
      };
    }

    const [conv] = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.studentId, studentId))
      .limit(1);

    if (conv) {
      const messages = await db
        .select({ content: whatsappMessages.content, author: whatsappMessages.author })
        .from(whatsappMessages)
        .where(eq(whatsappMessages.conversationId, conv.id));

      hasGlobalCompletionInChat = messages.some(
        (m) =>
          m.author === "AGENTE_IA" &&
          (m.content.includes("[CURSO_COMPLETADO]") ||
            m.content.toLowerCase().includes("has completado satisfactoriamente"))
      );
    }
  }

  // Calcular progreso de cada curso
  const coursesWithProgress = publishedCourses.map((course) => {
    const maxSteps = maxStepsByCourse[course.id] || 3;
    const session = sessionsByCourse[course.id];

    let progressPercentage = 0;
    let status: "COMPLETADO" | "EN_PROGRESO" | "NO_INICIADO" = "NO_INICIADO";

    if (session) {
      if (session.completed) {
        progressPercentage = 100;
        status = "COMPLETADO";
      } else if (session.currentStepOrder > 0) {
        progressPercentage = Math.min(99, Math.round((session.currentStepOrder / maxSteps) * 100));
        status = "EN_PROGRESO";
      }
    } else if (hasGlobalCompletionInChat && publishedCourses.length === 1) {
      progressPercentage = 100;
      status = "COMPLETADO";
    }

    return {
      ...course,
      progressPercentage,
      status,
      maxSteps,
    };
  });

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
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <BookIcon className="w-6 h-6 text-emerald-700" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    Cursos Disponibles para WhatsApp ({coursesWithProgress.length})
                  </h2>
                </div>
              </div>

              <div className="space-y-5">
                {coursesWithProgress.map((course) => {
                  const isCompleted = course.status === "COMPLETADO";
                  const inProgress = course.status === "EN_PROGRESO";

                  return (
                    <div key={course.id} className="card-farmer p-7 sm:p-9 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1 text-xs font-normal uppercase tracking-wider text-slate-700 border border-slate-200">
                            <TagIcon className="w-3.5 h-3.5 text-slate-500" /> {course.category ?? "Agroindustria"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1 text-xs font-normal uppercase tracking-wider text-emerald-900 border border-emerald-200">
                            <SparklesIcon className="w-3.5 h-3.5 text-emerald-700" /> Tutor IA Activo
                          </span>
                        </div>

                        {/* Badge de Progreso del Curso */}
                        {studentId && (
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
                                <CheckCircleIcon className="w-4 h-4 text-emerald-700" />
                                <span>100% Completado</span>
                              </span>
                            ) : inProgress ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                                <span>{course.progressPercentage}% En Progreso</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">
                                <span>0% No Iniciado</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl leading-snug">
                          {course.title}
                        </h3>

                        {course.description && (
                          <p className="mt-2 text-base text-slate-600 font-normal leading-relaxed">
                            {course.description}
                          </p>
                        )}
                      </div>

                      {/* Barra de Progreso Visual */}
                      {studentId && (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Avance del curso</span>
                            <span>{course.progressPercentage}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? "bg-emerald-600"
                                  : inProgress
                                  ? "bg-amber-500"
                                  : "bg-slate-300"
                              }`}
                              style={{ width: `${course.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <Link
                          href={`/whatsapp/${course.id}`}
                          className="btn-farmer-primary text-base"
                        >
                          <span>
                            {isCompleted
                              ? "Repasar Curso en WhatsApp"
                              : inProgress
                              ? "Continuar Clase por WhatsApp"
                              : "Iniciar Clase por WhatsApp"}
                          </span>
                          <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {coursesWithProgress.length === 0 && (
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
