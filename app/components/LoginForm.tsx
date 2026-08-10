"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { loginAction, type LoginState } from "@/lib/auth/actions";
import { LockIcon, AlertTriangleIcon, ArrowRightIcon } from "./icons";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-200"
    >
      <div className="flex items-center gap-3.5 mb-2">
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl">
          <LockIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">Acceso Administrativo</h1>
          <p className="mt-0.5 text-sm font-medium text-slate-500">Entra a Agro.ai para gestionar contenidos.</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="admin@agro.ai"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-slate-900 mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          role="alert"
          className="mt-5 overflow-hidden rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-bold text-rose-800 flex items-center gap-2.5"
        >
          <AlertTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{state.error}</span>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-farmer-primary mt-8 w-full text-base"
      >
        <span>{pending ? "Verificando datos…" : "Iniciar Sesión"}</span>
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </motion.form>
  );
}
