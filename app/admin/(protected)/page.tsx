import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  chatSessions,
  courses,
  downloadLogs,
  lessons,
  puntosDigitales,
} from "@/lib/db/schema";
import {
  BookIcon,
  LessonIcon,
  SignalIcon,
  DownloadIcon,
  ChatIcon,
  CheckIcon,
} from "@/app/components/icons";

async function getStats() {
  const [[courseCount], [lessonCount], [puntoCount], [downloadCount], [chatCount], [chatCompleted]] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(courses),
      db.select({ count: sql<number>`count(*)` }).from(lessons),
      db.select({ count: sql<number>`count(*)` }).from(puntosDigitales),
      db.select({ count: sql<number>`count(*)` }).from(downloadLogs),
      db.select({ count: sql<number>`count(*)` }).from(chatSessions),
      db
        .select({ count: sql<number>`count(*)` })
        .from(chatSessions)
        .where(eq(chatSessions.completed, true)),
    ]);

  return {
    courses: courseCount.count,
    lessons: lessonCount.count,
    puntos: puntoCount.count,
    downloads: downloadCount.count,
    chats: chatCount.count,
    chatsCompleted: chatCompleted.count,
  };
}

async function getRecentDownloads() {
  return db
    .select({
      id: downloadLogs.id,
      fileType: downloadLogs.fileType,
      createdAt: downloadLogs.createdAt,
      lessonTitle: lessons.title,
      puntoName: puntosDigitales.name,
      courseTitle: courses.title,
    })
    .from(downloadLogs)
    .leftJoin(lessons, eq(downloadLogs.lessonId, lessons.id))
    .leftJoin(puntosDigitales, eq(downloadLogs.puntoId, puntosDigitales.id))
    .leftJoin(courses, eq(downloadLogs.courseId, courses.id))
    .orderBy(desc(downloadLogs.createdAt))
    .limit(8);
}

async function getRecentChats() {
  return db
    .select({
      id: chatSessions.id,
      completed: chatSessions.completed,
      updatedAt: chatSessions.updatedAt,
      currentStepOrder: chatSessions.currentStepOrder,
      courseTitle: courses.title,
    })
    .from(chatSessions)
    .leftJoin(courses, eq(chatSessions.courseId, courses.id))
    .orderBy(desc(chatSessions.updatedAt))
    .limit(8);
}

function StatCard({
  label,
  value,
  icon: IconComponent,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-farmer p-6 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 font-display text-4xl font-black text-slate-900">{value}</p>
      </div>
      <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 shrink-0">
        <IconComponent className="w-6 h-6" />
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export default async function AdminDashboardPage() {
  const [stats, recentDownloads, recentChats] = await Promise.all([
    getStats(),
    getRecentDownloads(),
    getRecentChats(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
          Panel General de Control
        </h1>
        <p className="mt-1 text-base text-slate-600 font-medium">
          Resumen en tiempo real de los tres pilares de la Plataforma Educativa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard label="Cursos Creados" value={stats.courses} icon={BookIcon} />
        <StatCard label="Lecciones Totales" value={stats.lessons} icon={LessonIcon} />
        <StatCard label="Puntos Digitales" value={stats.puntos} icon={SignalIcon} />
        <StatCard label="Descargas Registradas" value={stats.downloads} icon={DownloadIcon} />
        <StatCard label="Sesiones WhatsApp" value={stats.chats} icon={ChatIcon} />
        <StatCard label="Cursos Completados" value={stats.chatsCompleted} icon={CheckIcon} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-farmer p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-1">
            <DownloadIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-xl font-bold text-slate-900">Descargas Recientes</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Actividad en Puntos Digitales offline</p>

          {recentDownloads.length === 0 ? (
            <p className="mt-6 text-base font-medium text-slate-400">Todavía no hay descargas registradas.</p>
          ) : (
            <ul className="mt-5 space-y-3.5">
              {recentDownloads.map((row) => (
                <li key={row.id} className="border-t border-slate-100 pt-3.5 text-sm font-medium">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{row.puntoName ?? "Punto no disponible"}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                      {row.fileType}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Descargó: <span className="font-semibold text-slate-800">{row.lessonTitle ?? "Lección"}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {row.courseTitle} · {formatDate(row.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-farmer p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-1">
            <ChatIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display text-xl font-bold text-slate-900">Sesiones de WhatsApp</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Progreso del asistente interactivo</p>

          {recentChats.length === 0 ? (
            <p className="mt-6 text-base font-medium text-slate-400">Todavía no hay sesiones de chat.</p>
          ) : (
            <ul className="mt-5 space-y-3.5">
              {recentChats.map((row) => (
                <li key={row.id} className="border-t border-slate-100 pt-3.5 text-sm font-medium">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900">{row.courseTitle}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        row.completed
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                    >
                      {row.completed ? "Completado" : `Paso ${row.currentStepOrder}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Última interacción: {formatDate(row.updatedAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
