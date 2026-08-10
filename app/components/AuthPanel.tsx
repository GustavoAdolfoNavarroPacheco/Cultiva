"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LockIcon, PhoneIcon, UserPlusIcon } from "./icons";
import { LoginForm } from "./LoginForm";
import { StudentLoginForm } from "./StudentLoginForm";
import { StudentRegisterForm } from "./StudentRegisterForm";

type Mode = "admin" | "student-login" | "student-register";

const headings: Record<Mode, { icon: typeof LockIcon; title: string; subtitle: string }> = {
  admin: {
    icon: LockIcon,
    title: "Acceso Administrativo",
    subtitle: "Entra a Agro.ai para gestionar contenidos.",
  },
  "student-login": {
    icon: PhoneIcon,
    title: "Acceso Estudiante",
    subtitle: "Entra con tu número de teléfono para continuar tus cursos.",
  },
  "student-register": {
    icon: UserPlusIcon,
    title: "Crear Cuenta de Estudiante",
    subtitle: "Regístrate con tu teléfono para guardar tu progreso.",
  },
};

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("admin");
  const heading = headings[mode];
  const HeadingIcon = heading.icon;

  const isAdminSelected = mode === "admin";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        layout: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-slate-200 overflow-hidden"
    >
      {/* Access type switcher with smooth sliding layoutId animation */}
      <div className="relative flex items-center rounded-2xl bg-slate-100 p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode("admin")}
          className={`relative z-10 flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer select-none ${
            isAdminSelected ? "text-emerald-950 font-black" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {isAdminSelected && (
            <motion.span
              layoutId="active-role-indicator"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
              className="absolute inset-0 rounded-xl bg-white shadow-md border border-slate-200/80"
            />
          )}
          <span className="relative z-10">Administrador</span>
        </button>

        <button
          type="button"
          onClick={() => setMode((current) => (current === "admin" ? "student-login" : current))}
          className={`relative z-10 flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer select-none ${
            !isAdminSelected ? "text-emerald-950 font-black" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {!isAdminSelected && (
            <motion.span
              layoutId="active-role-indicator"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
              className="absolute inset-0 rounded-xl bg-white shadow-md border border-slate-200/80"
            />
          )}
          <span className="relative z-10">Estudiante</span>
        </button>
      </div>

      {/* Smooth height expansion/shrinkage content container with AnimatePresence */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl shrink-0">
              <HeadingIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-slate-900 sm:text-2xl">{heading.title}</h1>
              <p className="mt-0.5 text-sm font-medium text-slate-500">{heading.subtitle}</p>
            </div>
          </div>

          <div>
            {mode === "admin" && <LoginForm />}
            {mode === "student-login" && <StudentLoginForm />}
            {mode === "student-register" && <StudentRegisterForm />}
          </div>

          {mode === "student-login" && (
            <p className="mt-6 text-center text-sm font-medium text-slate-500">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("student-register")}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Regístrate
              </button>
            </p>
          )}

          {mode === "student-register" && (
            <p className="mt-6 text-center text-sm font-medium text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("student-login")}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
