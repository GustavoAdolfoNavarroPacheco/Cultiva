"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { studentLoginAction, type StudentAuthState } from "@/lib/auth/student-actions";
import { AlertTriangleIcon, ArrowRightIcon } from "./icons";

const initialState: StudentAuthState = {};

export function StudentLoginForm() {
  const [state, formAction, pending] = useActionState(studentLoginAction, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-5">
        <div>
          <label htmlFor="student-phone" className="block text-sm font-bold text-slate-900 mb-2">
            Número de Teléfono
          </label>
          <input
            id="student-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            autoFocus
            inputMode="tel"
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="3001234567"
          />
        </div>

        <div>
          <label htmlFor="student-password" className="block text-sm font-bold text-slate-900 mb-2">
            Contraseña
          </label>
          <input
            id="student-password"
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

      <button type="submit" disabled={pending} className="btn-farmer-primary mt-8 w-full text-base">
        <span>{pending ? "Verificando datos…" : "Iniciar Sesión"}</span>
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </form>
  );
}
