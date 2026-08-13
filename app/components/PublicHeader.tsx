"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "motion/react";
import { SproutIcon, SignalIcon, ChatIcon, LockIcon, LogoutIcon, UserIcon, BookIcon, DashboardIcon } from "./icons";
import { logoutAction } from "@/lib/auth/actions";

export function PublicHeader({ role }: { role?: string }) {
  const pathname = usePathname();
  const isLoggedIn = Boolean(role);
  const isStaff = role === "admin" || role === "editor";

  const isInfo = pathname === "/" || pathname === "/info";
  const isPlataforma = pathname.startsWith("/plataforma");
  const isPuntos = pathname.startsWith("/puntos");
  const isWhatsapp = pathname.startsWith("/whatsapp");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/90 backdrop-blur-xl shadow-2xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Brand logo & tagline */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer" title="Ir al Inicio — Plataforma Educativa">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 shadow-sm transition-transform group-hover:scale-105 shrink-0 overflow-hidden p-1">
            <Image src="/logos/campuslands.png" alt="Campuslands" width={40} height={40} className="h-full w-full object-contain" priority />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Plataforma<span className="text-emerald-700"> Educativa</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Access navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          <LayoutGroup id="public-header-nav">
            <nav className="relative flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80">
              {/* If NOT logged in: Show Informative Tabs */}
              {!isLoggedIn && (
                <>
                  {/* Info Access Link */}
                  <Link
                    href="/"
                    title="Info"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isInfo ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isInfo && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <SproutIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Info</span>
                  </Link>

                  {/* Plataforma Educativa Sector Agro */}
                  <Link
                    href="/plataforma"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isPlataforma ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Plataforma Educativa Sector Agro"
                  >
                    {isPlataforma && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <BookIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Plataforma Agro</span>
                  </Link>
                </>
              )}

              {/* If logged in as STUDENT: Show ONLY Functional Tabs (Modo Offline & Agente WhatsApp) */}
              {role === "student" && (
                <>
                  <Link
                    href="/puntos"
                    title="Modo Offline"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isPuntos ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isPuntos && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <SignalIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Modo Offline</span>
                  </Link>

                  <Link
                    href="/whatsapp"
                    title="Agente WhatsApp"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isWhatsapp ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isWhatsapp && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <ChatIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Agente WhatsApp</span>
                  </Link>
                </>
              )}

              {/* If logged in as ADMIN / STAFF: Full navigation access */}
              {isStaff && (
                <>
                  <Link
                    href="/"
                    title="Info"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isInfo ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isInfo && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <SproutIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Info</span>
                  </Link>

                  <Link
                    href="/puntos"
                    title="Modo Offline"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isPuntos ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isPuntos && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <SignalIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Modo Offline</span>
                  </Link>

                  <Link
                    href="/whatsapp"
                    title="Agente WhatsApp"
                    className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-sm font-bold transition-colors min-h-[42px] select-none cursor-pointer ${
                      isWhatsapp ? "text-white font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isWhatsapp && (
                      <motion.span
                        layoutId="active-public-nav-indicator"
                        layout="x"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-emerald-800 shadow-md border border-emerald-700"
                      />
                    )}
                    <ChatIcon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10 hidden sm:inline">Agente WhatsApp</span>
                  </Link>
                </>
              )}
            </nav>
          </LayoutGroup>

          {role === "student" && (
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 text-xs font-bold text-emerald-900">
              <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Estudiante</span>
            </div>
          )}

          {isStaff && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-colors min-h-[42px] cursor-pointer shadow-xs"
              title="Panel de Administración"
            >
              <DashboardIcon className="w-4 h-4 text-emerald-300" />
              <span className="hidden md:inline">Panel Admin</span>
            </Link>
          )}

          {isLoggedIn ? (
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
          ) : (
            <Link href="/login">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                title="Iniciar Sesión"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-800 border border-emerald-700 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-900 transition-all min-h-[42px] cursor-pointer shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
