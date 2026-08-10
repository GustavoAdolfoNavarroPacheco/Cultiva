"use client";

import { useState } from "react";
import { createLesson, deleteLesson, updateLesson } from "@/lib/actions/lessons";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";

type Lesson = {
  id: number;
  order: number;
  title: string;
  summary: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
};

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-white/70 bg-white/60 px-3.5 py-2.5 text-[14px] text-ink outline-none transition-all focus:border-green-500 focus:bg-white/90 focus:ring-4 focus:ring-green-500/15";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft";
const primaryBtnSm =
  "btn-glow rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-white shadow-md shadow-green-600/20";

function LessonEditForm({ lesson, courseId, onDone }: { lesson: Lesson; courseId: number; onDone: () => void }) {
  return (
    <form
      action={async (formData) => {
        await updateLesson(lesson.id, courseId, formData);
        onDone();
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label className={labelClass}>Título</label>
        <input name="title" defaultValue={lesson.title} required className={fieldClass} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Resumen</label>
        <input name="summary" defaultValue={lesson.summary ?? ""} className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>URL de video</label>
        <input
          name="videoUrl"
          type="url"
          defaultValue={lesson.videoUrl ?? ""}
          className={fieldClass}
          placeholder="https://…"
        />
      </div>
      <div>
        <label className={labelClass}>URL de PDF</label>
        <input
          name="pdfUrl"
          type="url"
          defaultValue={lesson.pdfUrl ?? ""}
          className={fieldClass}
          placeholder="https://…"
        />
      </div>
      <div className="sm:col-span-2 flex items-center gap-4">
        <button type="submit" className={primaryBtnSm}>
          Guardar
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint hover:text-ink"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function LessonRow({ lesson, courseId }: { lesson: Lesson; courseId: number }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="rounded-[var(--radius-md)] border border-white/60 bg-white/40 p-4">
        <LessonEditForm lesson={lesson} courseId={courseId} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--radius-md)] border border-white/60 bg-white/40 p-4 transition-colors hover:bg-white/60">
      <div>
        <p className="text-[11px] font-medium text-ink-faint">Lección {lesson.order}</p>
        <p className="font-medium text-ink">{lesson.title}</p>
        {lesson.summary && <p className="text-[13px] text-ink-soft">{lesson.summary}</p>}
        <div className="mt-1 flex gap-3 text-[12px] text-green-700">
          {lesson.videoUrl && <span>Video ✓</span>}
          {lesson.pdfUrl && <span>PDF ✓</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[11px] font-semibold uppercase tracking-[0.06em] text-green-700 hover:text-green-800"
        >
          Editar
        </button>
        <ConfirmDeleteForm
          action={deleteLesson.bind(null, lesson.id, courseId)}
          confirmText={`¿Eliminar la lección "${lesson.title}"?`}
        >
          <button
            type="submit"
            className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint hover:text-red-600"
          >
            Eliminar
          </button>
        </ConfirmDeleteForm>
      </div>
    </li>
  );
}

export function LessonsManager({ courseId, lessons }: { courseId: number; lessons: Lesson[] }) {
  return (
    <div className="glass animate-sprout-in rounded-[var(--radius-lg)] p-6">
      <h2 className="font-display text-lg font-bold text-ink">Lecciones</h2>
      <p className="mt-1 text-[13px] text-ink-faint">
        Contenido descargable en los Puntos Digitales y usado por el agente de WhatsApp.
      </p>

      <ul className="mt-5 space-y-3">
        {lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} courseId={courseId} />
        ))}
        {lessons.length === 0 && (
          <p className="text-[14px] text-ink-faint">Todavía no hay lecciones en este curso.</p>
        )}
      </ul>

      <form
        action={createLesson.bind(null, courseId)}
        className="mt-6 grid gap-3 border-t border-white/60 pt-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className={labelClass}>Título de la nueva lección</label>
          <input name="title" required className={fieldClass} placeholder="Ej. Preparación del terreno" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Resumen</label>
          <input name="summary" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>URL de video</label>
          <input name="videoUrl" type="url" className={fieldClass} placeholder="https://…" />
        </div>
        <div>
          <label className={labelClass}>URL de PDF</label>
          <input name="pdfUrl" type="url" className={fieldClass} placeholder="https://…" />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className={primaryBtnSm}>
            Añadir lección
          </button>
        </div>
      </form>
    </div>
  );
}
