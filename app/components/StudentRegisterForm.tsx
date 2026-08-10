"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { studentRegisterAction, type StudentAuthState } from "@/lib/auth/student-actions";
import { AlertTriangleIcon, ArrowRightIcon } from "./icons";

const initialState: StudentAuthState = {};

export function StudentRegisterForm() {
  const [state, formAction, pending] = useActionState(studentRegisterAction, initialState);

  return (
    <form action={formAction}>
      <div className="space-y-5">
        <div>
          <label htmlFor="register-name" className="block text-sm font-bold text-slate-900 mb-2">
            Nombre Completo
          </label>
          <input
            id="register-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            autoFocus
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="Tu nombre y apellido"
          />
        </div>

        <div>
          <label htmlFor="register-phone" className="block text-sm font-bold text-slate-900 mb-2">
            Número de Teléfono
          </label>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="3001234567"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-bold text-slate-900 mb-2">
            Contraseña
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="register-confirm" className="block text-sm font-bold text-slate-900 mb-2">
            Confirmar Contraseña
          </label>
          <input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full min-h-[52px] rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            placeholder="Repite tu contraseña"
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
        <span>{pending ? "Creando cuenta…" : "Crear Cuenta"}</span>
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </form>
  );
}
