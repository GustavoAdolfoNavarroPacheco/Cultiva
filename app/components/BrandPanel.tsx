"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SproutIcon, SignalIcon, ChatIcon, DashboardIcon } from "./icons";

const pillars = [
  { icon: SignalIcon, title: "Modo Offline", href: "/puntos" },
  { icon: ChatIcon, title: "Agente WhatsApp", href: "/whatsapp" },
  { icon: DashboardIcon, title: "Gestión Administrativa", href: null },
];

export function BrandPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center px-2 lg:px-4"
    >
      <Link href="/" className="flex items-center gap-3.5 group cursor-pointer w-fit" title="Ver información de Plataforma Educativa">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-md transition-transform group-hover:scale-105">
          <SproutIcon className="w-7 h-7 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold leading-none tracking-tight text-slate-900 sm:text-3xl">
            Plataforma<span className="text-emerald-700"> Educativa Sector Agro</span>
          </span>
          <p className="mt-2 text-xs font-normal uppercase tracking-widest text-emerald-800">
            Capacitación Agropecuaria
          </p>
        </div>
      </Link>

      <h2 className="mt-6 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
        Conocimiento para el campo, accesible para todos.
      </h2>
      <p className="mt-2.5 text-base leading-relaxed text-slate-600 font-normal">
        Letras grandes, explicaciones sencillas y descargas sin internet.
      </p>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {pillars.map((pillar, index) => {
          const IconComponent = pillar.icon;
          const content = (
            <>
              <IconComponent className="w-4 h-4" />
              <span>{pillar.title}</span>
            </>
          );
          const className =
            "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-2xs";

          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
            >
              {pillar.href ? (
                <Link href={pillar.href} className={`${className} transition-colors hover:border-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer`}>
                  {content}
                </Link>
              ) : (
                <span className={className}>{content}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
