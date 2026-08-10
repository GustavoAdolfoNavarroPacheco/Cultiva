"use client";

import { useActionState } from "react";
import { createPunto, type PuntoFormState } from "@/lib/actions/puntos";

const initialState: PuntoFormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-paper-line bg-paper px-3.5 py-2.5 text-[14px] text-ink focus:border-clay";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft";

export function PuntoCreateForm() {
  const [state, formAction, pending] = useActionState(createPunto, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-paper-line bg-paper p-6 sm:grid-cols-3"
    >
      <div className="sm:col-span-3">
        <h2 className="font-display text-lg font-semibold text-ink">Nuevo Punto Digital</h2>
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
        <p className="sm:col-span-3 rounded-lg bg-clay/10 px-3 py-2 text-[13px] text-clay-deep">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-clay px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-paper disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear punto digital"}
        </button>
      </div>
    </form>
  );
}
