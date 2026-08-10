"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Menu, Settings, X, Users, MapPin } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

const navLinks = [
  { href: "/admin", label: "Módulo Administrativo", match: (p: string) => p === "/admin" || p.startsWith("/admin/cursos") },
  { href: "/puntos", label: "Puntos Digitales", match: (p: string) => p.startsWith("/puntos") },
  { href: "/whatsapp", label: "Agente de WhatsApp", match: (p: string) => p.startsWith("/whatsapp") },
];

const configLinks = [
  { href: "/admin/configuracion/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/configuracion/puntos", label: "Gestión de Puntos Digitales", icon: MapPin },
];

export function TopBar({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const [configOpen, setConfigOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/40">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/informacion" className="group flex items-center gap-2 justify-self-start">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 font-display text-sm font-extrabold text-white shadow-sm shadow-green-600/30 transition-transform group-hover:scale-105">
            C
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">Cultiva</span>
        </Link>

        <nav className="relative hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = link.match(pathname);
            return (
              <Link key={link.href} href={link.href} className="relative rounded-full px-4 py-2">
                {active && (
                  <motion.span
                    layoutId="topbar-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-green-600 shadow-md shadow-green-600/25"
                  />
                )}
                <span
                  className={`relative z-10 text-[13.5px] font-medium ${
                    active ? "text-white" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 justify-self-end">
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setConfigOpen((open) => !open)}
              aria-expanded={configOpen}
              aria-label="Configuración"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/60 hover:text-green-700"
            >
              <Settings size={18} />
            </button>

            <AnimatePresence>
              {configOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Cerrar menú"
                    onClick={() => setConfigOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-strong absolute right-0 z-50 mt-2 w-64 rounded-[var(--radius-md)] p-2"
                  >
                    <div className="border-b border-white/50 px-3 py-2.5">
                      <p className="truncate text-[13px] font-semibold text-ink">{user.name}</p>
                      <p className="truncate text-[11px] text-ink-faint">{user.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-green-700">
                        {user.role}
                      </span>
                    </div>
                    <div className="p-1">
                      {configLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setConfigOpen(false)}
                          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-white/60 hover:text-green-700"
                        >
                          <link.icon size={16} />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <form action={logoutAction} className="hidden md:block">
            <button
              type="submit"
              aria-label="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Abrir menú"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-white/60 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/40 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => {
                const active = link.match(pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-[var(--radius-sm)] px-3 py-2.5 text-[14px] font-medium ${
                      active ? "bg-green-600 text-white" : "text-ink-soft"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-1 border-t border-white/50" />
              {configLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-[14px] font-medium text-ink-soft"
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-[14px] font-medium text-red-600"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
