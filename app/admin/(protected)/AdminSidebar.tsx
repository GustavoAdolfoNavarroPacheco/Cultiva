"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
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
  { href: "/admin/puntos", label: "Modo Offline", icon: SignalIcon },
  { href: "/admin/usuarios", label: "Usuarios Admin", icon: UsersIcon },
];

const demoLinks = [
  { href: "/plataforma", label: "Plataforma Agro", icon: BookIcon },
  { href: "/puntos", label: "Modo Offline", icon: SignalIcon },
  { href: "/whatsapp", label: "Simular WhatsApp", icon: ChatIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-40 hidden md:flex w-64 h-screen flex-col bg-slate-900 text-slate-100 border-r border-slate-800 p-5 overflow-y-auto">
      {/* Brand Header - Redirects to / */}
      <Link href="/" className="flex items-center gap-3 px-2 py-3 border-b border-slate-800/80 mb-6 group cursor-pointer" title="Ver información de Plataforma Educativa">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0 overflow-hidden p-1.5 transition-transform group-hover:scale-105">
          <Image src="/logos/campuslands.png" alt="Campuslands" width={40} height={40} className="h-full w-full object-contain" />
        </div>
        <div>
          <span className="font-display text-base font-bold tracking-tight text-white block leading-tight">
            Plataforma<span className="text-emerald-500"> Educativa</span>
          </span>
          <p className="text-[10px] font-normal uppercase tracking-widest text-emerald-400 mt-0.5">
            Panel Administrativo
          </p>
        </div>
      </Link>

      {/* Primary Navigation with smooth sliding layoutId animation */}
      <nav className="space-y-1.5 flex-1">
        <p className="px-3 text-[10px] font-normal uppercase tracking-widest text-slate-400 mb-2">
          Navegación
        </p>
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-colors min-h-[46px] select-none cursor-pointer ${active ? "text-white font-bold" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
            >
              {active && (
                <motion.span
                  layoutId="active-sidebar-nav-indicator"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-emerald-700 shadow-md border border-emerald-600/50"
                />
              )}
              <IconComponent className="relative z-10 w-5 h-5 shrink-0" />
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Demo Links */}
      <div className="pt-5 border-t border-slate-800 mt-auto">
        <p className="px-3 text-[10px] font-normal uppercase tracking-widest text-slate-400 mb-2">
          Vistas Públicas
        </p>
        <div className="space-y-1.5">
          {demoLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-800/60 border border-slate-700/50 px-3.5 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white cursor-pointer"
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
