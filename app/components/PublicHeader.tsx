"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SproutIcon, SignalIcon, ChatIcon, LockIcon } from "./icons";

export function PublicHeader() {
  const pathname = usePathname();

  const isPuntos = pathname.startsWith("/puntos");
  const isWhatsapp = pathname.startsWith("/whatsapp");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/90 backdrop-blur-xl shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Brand logo & tagline */}
        <Link href="/puntos" className="flex items-center gap-3 group">
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

        {/* Access navigation for Farmers & Admin */}
        <nav className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            href="/puntos"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all min-h-[44px] ${
              isPuntos
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-slate-100/80 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80"
            }`}
          >
            <SignalIcon className="w-4 h-4" />
            <span>Puntos Digitales</span>
          </Link>

          <Link
            href="/whatsapp"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all min-h-[44px] ${
              isWhatsapp
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-slate-100/80 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80"
            }`}
          >
            <ChatIcon className="w-4 h-4" />
            <span>Agente WhatsApp</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors ml-1 min-h-[44px]"
            title="Panel de Administración"
          >
            <LockIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
