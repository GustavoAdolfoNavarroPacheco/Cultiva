"use client";

import { useActionState } from "react";
import { createUser, type UserFormState } from "@/lib/actions/users";
import { UsersIcon, ArrowRightIcon } from "@/app/components/icons";

const initialState: UserFormState = {};

const fieldClass =
  "mt-1.5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10 shadow-2xs";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-700";

export function UserCreateForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="card-farmer grid gap-5 p-6 sm:p-8 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center gap-2.5 mb-1 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
          <UsersIcon className="w-5 h-5" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-900">Nuevo Usuario Administrativo</h2>
      </div>

      <div>
        <label className={labelClass}>Nombre Completo *</label>
        <input name="name" required className={fieldClass} placeholder="Ej. Carlos Mendoza" />
      </div>

      <div>
        <label className={labelClass}>Correo Electrónico *</label>
        <input name="email" type="email" required className={fieldClass} placeholder="carlos@agro.ai" />
      </div>

      <div>
        <label className={labelClass}>Contraseña *</label>
        <input name="password" type="password" required minLength={8} className={fieldClass} placeholder="Mínimo 8 caracteres" />
      </div>

      <div>
        <label className={labelClass}>Rol de Usuario *</label>
        <select name="role" defaultValue="admin" className={fieldClass}>
          <option value="admin">Administrador (Acceso Total)</option>
          <option value="editor">Editor (Sólo Lectura/Edición)</option>
        </select>
      </div>

      {state.error && (
        <p className="sm:col-span-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-bold text-rose-800">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-farmer-primary rounded-xl text-base font-bold cursor-pointer disabled:opacity-60 min-h-[48px] px-6"
        >
          <span>{pending ? "Creando…" : "Crear Usuario"}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
