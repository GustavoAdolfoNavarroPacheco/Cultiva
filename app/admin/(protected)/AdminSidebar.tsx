"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { logoutAction } from "@/lib/auth/actions";

const navLinks = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/puntos", label: "Puntos digitales" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

const demoLinks = [
  { href: "/puntos", label: "Ver Puntos Digitales" },
  { href: "/whatsapp", label: "Simular WhatsApp" },
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
      className="glass-strong m-4 flex flex-col rounded-[var(--radius-lg)] p-5 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-64 md:shrink-0"
    >
      <Link href="/admin" className="font-display text-xl font-extrabold text-green-900">
        Cultiva
      </Link>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Panel administrativo
      </p>

      <nav className="relative mt-7 flex flex-row flex-wrap gap-1 md:flex-col">
        {navLinks.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className="relative rounded-full px-4 py-2.5">
              {active && (
                <motion.span
                  layoutId="admin-nav-active"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-green-600 shadow-lg shadow-green-600/25"
                />
              )}
              <span
                className={`relative z-10 text-[13px] font-medium ${
                  active ? "text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/50 pt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
          Probar la demo
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {demoLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:bg-white/50 hover:text-green-700"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-white/50 pt-5">
        <p className="text-[13px] font-semibold text-ink">{user.name}</p>
        <p className="truncate text-[12px] text-ink-faint">{user.email}</p>
        <span className="mt-1.5 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-green-700">
          {user.role}
        </span>
        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="text-[12px] font-medium text-ink-soft underline decoration-dotted underline-offset-4 transition-colors hover:text-green-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
