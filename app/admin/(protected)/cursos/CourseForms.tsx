"use client";

import { useActionState } from "react";
import { createCourse, updateCourse, type CourseFormState } from "@/lib/actions/courses";

const initialState: CourseFormState = {};

const fieldClass =
  "mt-2 w-full rounded-[var(--radius-sm)] border border-white/70 bg-white/60 px-4 py-3 text-ink placeholder:text-ink-faint outline-none transition-all focus:border-green-500 focus:bg-white/90 focus:ring-4 focus:ring-green-500/15";
const labelClass = "text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft";
const errorClass = "rounded-[var(--radius-sm)] bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700";
const primaryBtn =
  "btn-glow rounded-full bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-green-600/25 disabled:opacity-60";

export function CourseCreateForm() {
  const [state, formAction, pending] = useActionState(createCourse, initialState);

  return (
    <form action={formAction} className="glass grid gap-4 rounded-[var(--radius-lg)] p-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-lg font-bold text-ink">Nuevo curso</h2>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Título
        </label>
        <input id="title" name="title" required className={fieldClass} placeholder="Nombre del curso" />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Categoría
        </label>
        <input id="category" name="category" className={fieldClass} placeholder="Agroindustria" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className={fieldClass}
          placeholder="De qué trata el curso"
        />
      </div>

      <label className="flex items-center gap-2 text-[13px] text-ink-soft">
        <input type="checkbox" name="published" className="h-4 w-4 accent-green-600" />
        Publicado
      </label>

      {state.error && <p className={`sm:col-span-2 ${errorClass}`}>{state.error}</p>}

      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Creando…" : "Crear curso"}
        </button>
      </div>
    </form>
  );
}

export function CourseEditForm({
  course,
}: {
  course: {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    published: boolean;
  };
}) {
  const boundUpdate = updateCourse.bind(null, course.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="title" className={labelClass}>
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={course.title}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Categoría
        </label>
        <input
          id="category"
          name="category"
          defaultValue={course.category ?? ""}
          className={fieldClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={course.description ?? ""}
          className={fieldClass}
        />
      </div>

      <label className="flex items-center gap-2 text-[13px] text-ink-soft">
        <input
          type="checkbox"
          name="published"
          defaultChecked={course.published}
          className="h-4 w-4 accent-green-600"
        />
        Publicado
      </label>

      {state.error && <p className={`sm:col-span-2 ${errorClass}`}>{state.error}</p>}

      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
