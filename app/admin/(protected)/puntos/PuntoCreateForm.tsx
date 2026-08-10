"use client";

import { useActionState } from "react";
import { createPunto, type PuntoFormState } from "@/lib/actions/puntos";

const initialState: PuntoFormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-white/70 bg-white/60 px-3.5 py-2.5 text-[14px] text-ink outline-none transition-all focus:border-green-500 focus:bg-white/90 focus:ring-4 focus:ring-green-500/15";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft";

export function PuntoCreateForm() {
  const [state, formAction, pending] = useActionState(createPunto, initialState);

  return (
    <form action={formAction} className="glass grid gap-3 rounded-[var(--radius-lg)] p-6 sm:grid-cols-3">
      <div className="sm:col-span-3">
        <h2 className="font-display text-lg font-bold text-ink">Nuevo Punto Digital</h2>
      </div>
      <div>
        <label className={labelClass}>Nombre</label>
        <input name="name" required className={fieldClass} placeholder="Punto Digital Central" />
      </div>
      <div>
        <label className={labelClass}>Zona</label>
        <input name="zona" required className={fieldClass} placeholder="Vereda / municipio" />
      </div>
      <div>
        <label className={labelClass}>Responsable (opcional)</label>
        <input name="responsable" className={fieldClass} />
      </div>

      {state.error && (
        <p className="sm:col-span-3 rounded-[var(--radius-sm)] bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-glow rounded-full bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-green-600/25 disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear punto digital"}
        </button>
      </div>
    </form>
  );
}
