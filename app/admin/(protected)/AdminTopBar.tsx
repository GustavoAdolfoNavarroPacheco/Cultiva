"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { logoutAction } from "@/lib/auth/actions";
import {
  LogoutIcon,
  UserIcon,
  MenuIcon,
  CloseIcon,
  DashboardIcon,
  BookIcon,
  SignalIcon,
  UsersIcon,
  ShieldCheckIcon,
  ChatIcon,
} from "@/app/components/icons";

const mobileNavLinks = [
  { href: "/admin", label: "Panel Principal", icon: DashboardIcon, exact: true },
  { href: "/admin/estudiantes", label: "Estudiantes", icon: UsersIcon },
  { href: "/admin/cursos", label: "Gestión Cursos", icon: BookIcon },
  { href: "/admin/chats", label: "Chats en Vivo", icon: ChatIcon },
  { href: "/admin/puntos", label: "Modo Offline", icon: SignalIcon },
  { href: "/admin/usuarios", label: "Usuarios Admin", icon: ShieldCheckIcon },
  { href: "/admin/whatsapp", label: "Bot WhatsApp IA", icon: ChatIcon },
];

export function AdminTopBar({
  user,
}: {
  user: { name: string; email?: string; role: string };
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Portal target only exists client-side after mount (avoids SSR document access)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <>
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
      {/* Left side: Mobile menu trigger, brand title & breadcrumb info */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          title="Abrir menú de navegación"
          aria-label="Abrir menú de navegación"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <Link href="/info" className="flex md:hidden items-center gap-2 cursor-pointer" title="Ver información de Plataforma Educativa">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 overflow-hidden p-1">
            <Image src="/logos/campuslands.png" alt="Campuslands" width={32} height={32} className="h-full w-full object-contain" />
          </div>
          <span className="font-display text-base font-bold text-slate-900">
            Plataforma<span className="text-emerald-700"> Educativa</span>
          </span>
        </Link>
        <div className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Panel de Administración
        </div>
      </div>

      {/* Right side: Profile & Logout button with hover animations */}
      <div className="flex items-center gap-3">
        {/* User Profile Chip with hover animation */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xs cursor-pointer select-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white font-bold text-xs shadow-xs">
            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
            <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
              {user.role}
            </p>
          </div>
        </motion.div>

        {/* Logout Action Button with hover animation */}
        <form action={logoutAction}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
            title="Cerrar Sesión"
          >
            <LogoutIcon className="w-4 h-4 text-slate-500 group-hover:text-rose-600 transition-colors" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </motion.button>
        </form>
      </div>
    </header>

      {/* Mobile Navigation Drawer — portaled to <body> so the header's backdrop-blur */}
      {/* (which creates a containing block for fixed descendants) can't clip it */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileNavOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMobileNavOpen(false)}
                  className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs md:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 p-5 overflow-y-auto md:hidden"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 mb-6 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0 overflow-hidden p-1.5">
                        <Image src="/logos/campuslands.png" alt="Campuslands" width={40} height={40} className="h-full w-full object-contain" />
                      </div>
                      <span className="font-display text-sm font-bold tracking-tight text-white leading-tight">
                        Panel Administrativo
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                      title="Cerrar menú"
                      aria-label="Cerrar menú"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <nav className="space-y-1.5 flex-1">
                    {mobileNavLinks.map((link) => {
                      const IconComponent = link.icon;
                      const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-colors min-h-[46px] select-none cursor-pointer ${
                            active
                              ? "bg-emerald-700 text-white shadow-md border border-emerald-600/50"
                              : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                          }`}
                        >
                          <IconComponent className="w-5 h-5 shrink-0" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
