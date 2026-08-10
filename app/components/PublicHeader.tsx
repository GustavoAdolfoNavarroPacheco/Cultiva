"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SproutIcon, SignalIcon, ChatIcon, LockIcon, LogoutIcon } from "./icons";
import { logoutAction } from "@/lib/auth/actions";

export function PublicHeader({ role }: { role?: string }) {
  const pathname = usePathname();
  const isStaff = role === "admin" || role === "editor";

  const isPuntos = pathname.startsWith("/puntos");
  const isWhatsapp = pathname.startsWith("/whatsapp");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/90 backdrop-blur-xl shadow-2xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Brand logo & tagline - Redirects to /info */}
        <Link href="/info" className="flex items-center gap-3 group cursor-pointer" title="Ver información del proyecto Agro.ai">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-sm transition-transform group-hover:scale-105">
            <SproutIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-slate-900">
                Agro<span className="text-emerald-700">.ai</span>
              </span>
              <span className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-900 border border-emerald-300/60">
                Plataforma Agropecuaria
              </span>
            </div>
          </div>
        </Link>

        {/* Access navigation for Farmers with smooth sliding layoutId animation */}
        <div className="flex items-center gap-3 flex-wrap">
          <nav className="relative flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80">
            <Link
              href="/puntos"
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                isPuntos ? "text-white font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isPuntos && (
                <motion.span
                  layoutId="active-public-nav-indicator"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                />
              )}
              <SignalIcon className="relative z-10 w-4 h-4" />
              <span className="relative z-10">Puntos Digitales</span>
            </Link>

            <Link
              href="/whatsapp"
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                isWhatsapp ? "text-white font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isWhatsapp && (
                <motion.span
                  layoutId="active-public-nav-indicator"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                />
              )}
              <ChatIcon className="relative z-10 w-4 h-4" />
              <span className="relative z-10">Agente WhatsApp</span>
            </Link>
          </nav>

          {isStaff && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors min-h-[42px] cursor-pointer shadow-2xs"
              title="Panel de Administración"
            >
              <LockIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}

          <form action={logoutAction}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              title="Cerrar sesión"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition-all min-h-[42px] min-w-[42px] cursor-pointer shadow-2xs"
            >
              <LogoutIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </motion.button>
          </form>
        </div>
      </div>
    </header>
  );
}
