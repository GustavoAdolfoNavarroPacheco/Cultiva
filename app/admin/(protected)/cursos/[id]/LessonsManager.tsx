"use client";

import { useState } from "react";
import { createLesson, deleteLesson, updateLesson } from "@/lib/actions/lessons";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { BookIcon, VideoIcon, PdfIcon, ArrowRightIcon } from "@/app/components/icons";

type Lesson = {
  id: number;
  order: number;
  title: string;
  summary: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 shadow-2xs";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-700";
const primaryBtnSm =
  "btn-farmer-primary rounded-xl text-sm font-bold cursor-pointer disabled:opacity-60 min-h-[42px] px-5";

function LessonEditForm({ lesson, courseId, onDone }: { lesson: Lesson; courseId: number; onDone: () => void }) {
  return (
    <form
      action={async (formData) => {
        await updateLesson(lesson.id, courseId, formData);
        onDone();
      }}
      className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-4 rounded-xl border border-slate-300"
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
        <label className={labelClass}>URL de Video</label>
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
      <div className="sm:col-span-2 flex items-center gap-3 pt-2">
        <button type="submit" className={primaryBtnSm}>
          Guardar Lección
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 cursor-pointer"
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
    return <LessonEditForm lesson={lesson} courseId={courseId} onDone={() => setEditing(false)} />;
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:bg-slate-50/80 shadow-2xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-800 font-bold text-white text-xs">
            {lesson.order}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lección {lesson.order}</span>
        </div>
        <p className="font-bold text-slate-900 text-base">{lesson.title}</p>
        {lesson.summary && <p className="text-sm text-slate-600 font-medium mt-0.5">{lesson.summary}</p>}
        <div className="mt-2.5 flex items-center gap-3 text-xs font-bold text-emerald-800">
          {lesson.videoUrl && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-0.5">
              <VideoIcon className="w-3.5 h-3.5 text-emerald-700" /> Video
            </span>
          )}
          {lesson.pdfUrl && (
            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-0.5">
              <PdfIcon className="w-3.5 h-3.5 text-slate-600" /> Guía PDF
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 cursor-pointer"
        >
          Editar
        </button>
        <ConfirmDeleteForm
          action={deleteLesson.bind(null, lesson.id, courseId)}
          confirmText={`¿Eliminar la lección "${lesson.title}"?`}
        >
          <button
            type="submit"
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
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
    <div className="card-farmer p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-1 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
          <BookIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Lecciones del Curso ({lessons.length})</h2>
          <p className="text-xs font-medium text-slate-500">Contenido descargable en Puntos Digitales y usado por el agente.</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} courseId={courseId} />
        ))}
        {lessons.length === 0 && (
          <p className="text-sm font-medium text-slate-400 text-center py-6">Todavía no hay lecciones creadas en este curso.</p>
        )}
      </ul>

      <form
        action={createLesson.bind(null, courseId)}
        className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className={labelClass}>Título de la nueva lección *</label>
          <input name="title" required className={fieldClass} placeholder="Ej. Preparación del terreno" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Resumen o descripción breve</label>
          <input name="summary" className={fieldClass} placeholder="Ej. Cómo preparar el suelo antes de la siembra." />
        </div>
        <div>
          <label className={labelClass}>URL de Video</label>
          <input name="videoUrl" type="url" className={fieldClass} placeholder="https://…" />
        </div>
        <div>
          <label className={labelClass}>URL de PDF</label>
          <input name="pdfUrl" type="url" className={fieldClass} placeholder="https://…" />
        </div>
        <div className="sm:col-span-2 pt-2">
          <button type="submit" className={primaryBtnSm}>
            <span>Añadir Lección</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
