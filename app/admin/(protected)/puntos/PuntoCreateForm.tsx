"use client";

import { useActionState } from "react";
import { createPunto, type PuntoFormState } from "@/lib/actions/puntos";
import { SignalIcon, ArrowRightIcon } from "@/app/components/icons";

const initialState: PuntoFormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 shadow-2xs";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-700";

export function PuntoCreateForm() {
  const [state, formAction, pending] = useActionState(createPunto, initialState);

  return (
    <form action={formAction} className="card-farmer grid gap-5 p-6 sm:p-8 sm:grid-cols-3">
      <div className="sm:col-span-3 flex items-center gap-2.5 mb-1 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
          <SignalIcon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900">Nuevo Punto Digital</h2>
      </div>

      <div>
        <label className={labelClass}>Nombre del Punto *</label>
        <input name="name" required className={fieldClass} placeholder="Ej. Punto Digital Central" />
      </div>

      <div>
        <label className={labelClass}>Zona / Ubicación *</label>
        <input name="zona" required className={fieldClass} placeholder="Ej. Cabecera municipal, Vereda Norte" />
      </div>

      <div>
        <label className={labelClass}>Responsable (opcional)</label>
        <input name="responsable" className={fieldClass} placeholder="Ej. Casa Comunal" />
      </div>

      {state.error && (
        <p className="sm:col-span-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-bold text-rose-800">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-farmer-primary rounded-xl text-base font-bold cursor-pointer disabled:opacity-60 min-h-[48px] px-6"
        >
          <span>{pending ? "Creando…" : "Crear Punto Digital"}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
