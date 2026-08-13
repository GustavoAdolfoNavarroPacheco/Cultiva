"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { logoutAction } from "@/lib/auth/actions";
import { LogoutIcon, UserIcon } from "@/app/components/icons";

export function AdminTopBar({
  user,
}: {
  user: { name: string; email?: string; role: string };
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
      {/* Left side: Mobile brand title & breadcrumb info */}
      <div className="flex items-center gap-3">
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
  );
}
