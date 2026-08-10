"use client";

import { useActionState } from "react";
import { createCourse, updateCourse, type CourseFormState } from "@/lib/actions/courses";
import { BookIcon, ArrowRightIcon } from "@/app/components/icons";

const initialState: CourseFormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 shadow-2xs";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-700";
const errorClass = "rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-bold text-rose-800";
const primaryBtn =
  "btn-farmer-primary rounded-xl text-base font-bold cursor-pointer disabled:opacity-60 min-h-[48px] px-6";

export function CourseCreateForm() {
  const [state, formAction, pending] = useActionState(createCourse, initialState);

  return (
    <form action={formAction} className="card-farmer grid gap-5 p-6 sm:p-8 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center gap-2.5 mb-1 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
          <BookIcon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900">Nuevo curso</h2>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Nombre del Curso *
        </label>
        <input id="title" name="title" required className={fieldClass} placeholder="Ej. Buenas Prácticas en Agroindustria" />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Categoría
        </label>
        <input id="category" name="category" className={fieldClass} placeholder="Ej. Agroindustria, Ganadería, Riego" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={fieldClass}
          placeholder="Describe brevemente de qué trata este curso..."
        />
      </div>

      <div className="sm:col-span-2 flex items-center gap-3 pt-1">
        <input
          type="checkbox"
          id="published"
          name="published"
          className="h-5 w-5 rounded-md border-2 border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
        />
        <label htmlFor="published" className="text-sm font-bold text-slate-800 cursor-pointer">
          Publicar curso inmediatamente
        </label>
      </div>

      {state.error && <p className={`sm:col-span-2 ${errorClass}`}>{state.error}</p>}

      <div className="sm:col-span-2 pt-2">
        <button type="submit" disabled={pending} className={primaryBtn}>
          <span>{pending ? "Creando…" : "Crear Curso"}</span>
          <ArrowRightIcon className="w-5 h-5" />
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
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="edit-title" className={labelClass}>
          Nombre del Curso *
        </label>
        <input
          id="edit-title"
          name="title"
          required
          defaultValue={course.title}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="edit-category" className={labelClass}>
          Categoría
        </label>
        <input
          id="edit-category"
          name="category"
          defaultValue={course.category ?? ""}
          className={fieldClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="edit-description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="edit-description"
          name="description"
          rows={3}
          defaultValue={course.description ?? ""}
          className={fieldClass}
        />
      </div>

      <div className="sm:col-span-2 flex items-center gap-3 pt-1">
        <input
          type="checkbox"
          id="edit-published"
          name="published"
          defaultChecked={course.published}
          className="h-5 w-5 rounded-md border-2 border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
        />
        <label htmlFor="edit-published" className="text-sm font-bold text-slate-800 cursor-pointer">
          Publicado
        </label>
      </div>

      {state.error && <p className={`sm:col-span-2 ${errorClass}`}>{state.error}</p>}

      <div className="sm:col-span-2 pt-2">
        <button type="submit" disabled={pending} className={primaryBtn}>
          <span>{pending ? "Guardando…" : "Guardar Cambios"}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
