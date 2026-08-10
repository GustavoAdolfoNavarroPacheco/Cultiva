"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicHeader() {
  const pathname = usePathname();

  const isPuntos = pathname.startsWith("/puntos");
  const isWhatsapp = pathname.startsWith("/whatsapp");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/85 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand logo & tagline */}
        <Link href="/puntos" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white font-display font-extrabold text-xl shadow-md shadow-green-700/25 transition-transform group-hover:scale-105">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold tracking-tight text-green-950">
                Agro<span className="text-green-600">.ai</span>
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-800 border border-green-300/60">
                Campo Conectado
              </span>
            </div>
            <p className="text-xs font-medium text-emerald-800/80 hidden sm:block">
              Capacitación Agropecuaria Accesible
            </p>
          </div>
        </Link>

        {/* Access navigation for Farmers & Admin */}
        <nav className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            href="/puntos"
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all min-h-[44px] ${
              isPuntos
                ? "bg-green-700 text-white shadow-md shadow-green-800/20"
                : "bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/60"
            }`}
          >
            <span>📡</span>
            <span>Puntos Digitales</span>
          </Link>

          <Link
            href="/whatsapp"
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all min-h-[44px] ${
              isWhatsapp
                ? "bg-green-700 text-white shadow-md shadow-green-800/20"
                : "bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/60"
            }`}
          >
            <span>💬</span>
            <span>Agente WhatsApp</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors ml-1 min-h-[44px]"
            title="Panel de Administración"
          >
            <span>🔒</span>
            <span className="hidden md:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
