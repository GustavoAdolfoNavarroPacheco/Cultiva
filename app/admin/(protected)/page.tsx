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

function StatCard({ label, value, icon, delay }: { label: string; value: number; icon: string; delay: number }) {
  return (
    <div
      className="card-farmer animate-sprout-in p-6 flex items-center justify-between"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/70">{label}</p>
        <p className="mt-1 font-display text-4xl font-black text-emerald-950">{value}</p>
      </div>
      <span className="text-3xl p-3 bg-emerald-100/80 rounded-2xl">{icon}</span>
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
        <h1 className="font-display text-3xl sm:text-4xl font-black text-emerald-950">
          Panel General de Control
        </h1>
        <p className="mt-1 text-base text-emerald-800/80 font-medium">
          Resumen en tiempo real de los tres pilares de capacitación de Agro.ai.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard label="Cursos Creados" value={stats.courses} icon="📚" delay={0} />
        <StatCard label="Lecciones Totales" value={stats.lessons} icon="📖" delay={60} />
        <StatCard label="Puntos Digitales" value={stats.puntos} icon="📡" delay={120} />
        <StatCard label="Descargas Registradas" value={stats.downloads} icon="📥" delay={180} />
        <StatCard label="Sesiones WhatsApp" value={stats.chats} icon="💬" delay={240} />
        <StatCard label="Cursos Completados" value={stats.chatsCompleted} icon="✅" delay={300} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-farmer p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📥</span>
            <h2 className="font-display text-xl font-bold text-emerald-950">Descargas Recientes</h2>
          </div>
          <p className="text-sm text-emerald-800/70 font-medium">Actividad en Puntos Digitales offline</p>

          {recentDownloads.length === 0 ? (
            <p className="mt-6 text-base font-medium text-emerald-900/60">Todavía no hay descargas registradas.</p>
          ) : (
            <ul className="mt-5 space-y-3.5">
              {recentDownloads.map((row) => (
                <li key={row.id} className="border-t border-emerald-900/10 pt-3.5 text-sm font-medium">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-950">{row.puntoName ?? "Punto no disponible"}</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                      {row.fileType}
                    </span>
                  </div>
                  <p className="text-emerald-800/90 mt-0.5">
                    Descargó: <span className="font-semibold">{row.lessonTitle ?? "Lección"}</span>
                  </p>
                  <p className="text-xs text-emerald-700/60 mt-0.5">
                    {row.courseTitle} · {formatDate(row.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-farmer p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💬</span>
            <h2 className="font-display text-xl font-bold text-emerald-950">Sesiones de WhatsApp</h2>
          </div>
          <p className="text-sm text-emerald-800/70 font-medium">Progreso del asistente interactivo</p>

          {recentChats.length === 0 ? (
            <p className="mt-6 text-base font-medium text-emerald-900/60">Todavía no hay sesiones de chat.</p>
          ) : (
            <ul className="mt-5 space-y-3.5">
              {recentChats.map((row) => (
                <li key={row.id} className="border-t border-emerald-900/10 pt-3.5 text-sm font-medium">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-950">{row.courseTitle}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        row.completed
                          ? "bg-green-100 text-green-900 border border-green-300"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      {row.completed ? "Completado ✓" : `Paso ${row.currentStepOrder}`}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700/60 mt-1">Última interacción: {formatDate(row.updatedAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
