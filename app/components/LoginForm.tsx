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
      className="glass-strong w-full max-w-sm rounded-[var(--radius-lg)] p-8"
    >
      <h1 className="font-display text-2xl font-bold text-ink">Inicia sesión</h1>
      <p className="mt-1 text-[14px] text-ink-soft">Entra a Cultiva para continuar.</p>

      <div className="mt-7 space-y-4">
        <div>
          <label htmlFor="email" className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-soft">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-white/70 bg-white/60 px-4 py-3 text-ink placeholder:text-ink-faint outline-none transition-all focus:border-green-500 focus:bg-white/90 focus:ring-4 focus:ring-green-500/15"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-soft"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-white/70 bg-white/60 px-4 py-3 text-ink placeholder:text-ink-faint outline-none transition-all focus:border-green-500 focus:bg-white/90 focus:ring-4 focus:ring-green-500/15"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state.error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          role="alert"
          className="mt-4 overflow-hidden rounded-[var(--radius-sm)] bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700"
        >
          {state.error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={pending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="btn-glow mt-7 w-full rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-green-600/25 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </motion.button>
    </motion.form>
  );
}
