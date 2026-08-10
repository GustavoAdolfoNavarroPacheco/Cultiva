"use client";

import { useActionState } from "react";
import { createCourse, updateCourse, type CourseFormState } from "@/lib/actions/courses";

const initialState: CourseFormState = {};

const fieldClass =
  "mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink focus:border-clay";
const labelClass = "font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft";

export function CourseCreateForm() {
  const [state, formAction, pending] = useActionState(createCourse, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-xl border border-paper-line bg-paper p-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h2 className="font-display text-lg font-semibold text-ink">Nuevo curso</h2>
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
        <input type="checkbox" name="published" className="h-4 w-4 accent-clay" />
        Publicado
      </label>

      {state.error && (
        <p className="sm:col-span-2 rounded-lg bg-clay/10 px-3 py-2 text-[13px] text-clay-deep">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-clay px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-paper disabled:opacity-60"
        >
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
          className="h-4 w-4 accent-clay"
        />
        Publicado
      </label>

      {state.error && (
        <p className="sm:col-span-2 rounded-lg bg-clay/10 px-3 py-2 text-[13px] text-clay-deep">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-paper disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
