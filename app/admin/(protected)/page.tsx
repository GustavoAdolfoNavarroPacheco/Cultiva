import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  chatSessions,
  courses,
  downloadLogs,
  lessons,
  puntosDigitales,
} from "@/lib/db/schema";

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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-paper-line bg-paper px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink">{value}</p>
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
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Panel</h1>
      <p className="mt-1 text-ink-soft">Resumen de actividad en los tres pilares de Cultiva.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Cursos" value={stats.courses} />
        <StatCard label="Lecciones" value={stats.lessons} />
        <StatCard label="Puntos digitales" value={stats.puntos} />
        <StatCard label="Descargas" value={stats.downloads} />
        <StatCard label="Chats WhatsApp" value={stats.chats} />
        <StatCard label="Chats completados" value={stats.chatsCompleted} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-paper-line bg-paper p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Descargas recientes</h2>
          <p className="mt-1 text-[13px] text-ink-faint">Actividad en Puntos Digitales</p>

          {recentDownloads.length === 0 ? (
            <p className="mt-4 text-[14px] text-ink-faint">Todavía no hay descargas registradas.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentDownloads.map((row) => (
                <li key={row.id} className="border-t border-paper-line pt-3 text-[13px]">
                  <p className="text-ink">
                    <span className="font-medium">{row.puntoName ?? "Punto eliminado"}</span> descargó{" "}
                    <span className="uppercase text-ink-faint">{row.fileType}</span> de{" "}
                    {row.lessonTitle ?? "lección eliminada"}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                    {row.courseTitle} · {formatDate(row.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-paper-line bg-paper p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Sesiones de WhatsApp</h2>
          <p className="mt-1 text-[13px] text-ink-faint">Progreso del agente guiado</p>

          {recentChats.length === 0 ? (
            <p className="mt-4 text-[14px] text-ink-faint">Todavía no hay sesiones de chat.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentChats.map((row) => (
                <li key={row.id} className="border-t border-paper-line pt-3 text-[13px]">
                  <p className="text-ink">
                    {row.courseTitle} —{" "}
                    <span className={row.completed ? "text-offline-ink" : "text-ink-faint"}>
                      {row.completed ? "completado" : `paso ${row.currentStepOrder}`}
                    </span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                    {formatDate(row.updatedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
