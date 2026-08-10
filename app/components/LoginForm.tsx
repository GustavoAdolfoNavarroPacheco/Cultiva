"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-white/80"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔒</span>
        <div>
          <h1 className="font-display text-2xl font-black text-emerald-950 sm:text-3xl">Acceso Administrativo</h1>
          <p className="mt-1 text-base font-medium text-emerald-800/80">Entra a Agro.ai para gestionar contenidos.</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-emerald-950 mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            className="w-full min-h-[52px] rounded-2xl border-2 border-emerald-950/20 bg-white px-4 text-lg font-medium text-emerald-950 placeholder:text-emerald-900/40 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-500/20 shadow-inner"
            placeholder="admin@agro.ai"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-emerald-950 mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full min-h-[52px] rounded-2xl border-2 border-emerald-950/20 bg-white px-4 text-lg font-medium text-emerald-950 placeholder:text-emerald-900/40 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-500/20 shadow-inner"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          role="alert"
          className="mt-5 overflow-hidden rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-bold text-rose-800 flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{state.error}</span>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-farmer-primary mt-8 w-full text-lg shadow-lg"
      >
        <span>{pending ? "Verificando datos…" : "Iniciar Sesión ➔"}</span>
      </button>
    </motion.form>
  );
}
