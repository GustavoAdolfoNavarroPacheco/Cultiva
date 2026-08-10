"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SproutIcon,
  DashboardIcon,
  BookIcon,
  SignalIcon,
  UsersIcon,
  ChatIcon,
  ArrowRightIcon,
} from "@/app/components/icons";

const navLinks = [
  { href: "/admin", label: "Panel Principal", icon: DashboardIcon, exact: true },
  { href: "/admin/cursos", label: "Gestión Cursos", icon: BookIcon },
  { href: "/admin/puntos", label: "Puntos Digitales", icon: SignalIcon },
  { href: "/admin/usuarios", label: "Usuarios Admin", icon: UsersIcon },
];

const demoLinks = [
  { href: "/puntos", label: "Puntos Digitales", icon: SignalIcon },
  { href: "/whatsapp", label: "Simular WhatsApp", icon: ChatIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-40 hidden md:flex w-64 h-screen flex-col bg-slate-900 text-slate-100 border-r border-slate-800 p-5 overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800/80 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm shrink-0">
          <SproutIcon className="w-6 h-6" />
        </div>
        <div>
          <Link href="/admin" className="font-display text-2xl font-black tracking-tight text-white block">
            Agro<span className="text-emerald-500">.ai</span>
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Panel Administrativo
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="space-y-1.5 flex-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Navegación
        </p>
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all min-h-[46px] ${
                active
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Demo Links */}
      <div className="pt-5 border-t border-slate-800 mt-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Vistas Públicas
        </p>
        <div className="space-y-1.5">
          {demoLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-800/60 border border-slate-700/50 px-3.5 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </div>
                <ArrowRightIcon className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
