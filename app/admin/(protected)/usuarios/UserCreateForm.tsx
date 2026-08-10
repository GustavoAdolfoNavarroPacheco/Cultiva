"use client";

import { useActionState } from "react";
import { createUser, type UserFormState } from "@/lib/actions/users";

const initialState: UserFormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-white/70 bg-white/60 px-3.5 py-2.5 text-[14px] text-ink outline-none transition-all focus:border-green-500 focus:bg-white/90 focus:ring-4 focus:ring-green-500/15";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft";

export function UserCreateForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="glass grid gap-3 rounded-[var(--radius-lg)] p-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-lg font-bold text-ink">Nuevo usuario</h2>
      </div>
      <div>
        <label className={labelClass}>Nombre</label>
        <input name="name" required className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>Correo</label>
        <input name="email" type="email" required className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>Contraseña</label>
        <input name="password" type="password" required minLength={8} className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>Rol</label>
        <select name="role" defaultValue="admin" className={fieldClass}>
          <option value="admin">Administrador</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      {state.error && (
        <p className="sm:col-span-2 rounded-[var(--radius-sm)] bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-glow rounded-full bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-green-600/25 disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
