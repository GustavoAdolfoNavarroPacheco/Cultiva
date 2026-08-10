"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { logoutAction } from "@/lib/auth/actions";

const navLinks = [
  { href: "/admin", label: "📊 Panel Principal", exact: true },
  { href: "/admin/cursos", label: "📚 Gestión Cursos" },
  { href: "/admin/puntos", label: "📡 Puntos Digitales" },
  { href: "/admin/usuarios", label: "👥 Usuarios Admin" },
];

const demoLinks = [
  { href: "/puntos", label: "📡 Portal Puntos Digitales" },
  { href: "/whatsapp", label: "💬 Simular WhatsApp" },
];

export function AdminSidebar({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="m-4 flex flex-col rounded-3xl bg-gradient-to-b from-emerald-950 to-green-900 text-white p-6 shadow-2xl md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-72 md:shrink-0 border border-green-800/40"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-md text-emerald-900 font-bold">
          🌾
        </div>
        <div>
          <Link href="/admin" className="font-display text-2xl font-black tracking-tight text-white">
            Agro<span className="text-green-400">.ai</span>
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-widest text-green-300">
            Panel de Control
          </p>
        </div>
      </div>

      <nav className="relative mt-8 flex flex-row flex-wrap gap-1.5 md:flex-col">
        {navLinks.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className="relative rounded-2xl px-4 py-3 min-h-[48px] flex items-center">
              {active && (
                <motion.span
                  layoutId="admin-nav-active"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-2xl bg-green-500 shadow-lg shadow-green-500/30"
                />
              )}
              <span
                className={`relative z-10 text-base font-bold transition-colors ${
                  active ? "text-emerald-950" : "text-emerald-100 hover:text-white"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-emerald-800/60 pt-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-green-300 mb-2">
          Vista Pública
        </p>
        <div className="flex flex-col gap-2">
          {demoLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl bg-emerald-900/60 border border-emerald-700/50 px-4 py-2.5 text-sm font-bold text-emerald-100 transition-colors hover:bg-emerald-800 hover:text-white"
            >
              {link.label} ➔
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-emerald-800/60 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-emerald-950 text-base">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-emerald-200 truncate">{user.email}</p>
          </div>
        </div>

        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="w-full text-center rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-200 transition-colors hover:bg-rose-500/20 hover:text-white"
          >
            🚪 Cerrar Sesión
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
