"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SproutIcon, SignalIcon, ChatIcon, DashboardIcon, ArrowRightIcon } from "./icons";

const pillars = [
  { icon: SignalIcon, title: "Puntos Digitales", desc: "Descarga videos y guías a tu teléfono en zonas con o sin señal." },
  { icon: ChatIcon, title: "Agente WhatsApp", desc: "Aprende paso a paso respondiendo preguntas cortas en tu celular." },
  { icon: DashboardIcon, title: "Gestión Administrativa", desc: "Control total de cursos, lecciones y estadísticas de aprendizaje." },
];

export function BrandPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center px-2 py-6 lg:px-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-md">
          <SproutIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Agro<span className="text-emerald-700">.ai</span>
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Plataforma de Capacitación Agropecuaria
          </p>
        </div>
      </div>

      <h2 className="mt-7 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
        Conocimiento para el campo, accesible para todos.
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-slate-600 font-medium">
        Formación agropecuaria diseñada especialmente con letras grandes, explicaciones sencillas y descargas sin internet.
      </p>

      {/* Feature cards */}
      <div className="mt-8 space-y-3.5">
        {pillars.map((pillar, index) => {
          const IconComponent = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs"
            >
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 shrink-0">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{pillar.title}</h3>
                <p className="text-sm text-slate-600 mt-0.5">{pillar.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Direct public shortcuts */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
        <Link href="/puntos" className="btn-farmer-secondary text-sm">
          <SignalIcon className="w-4 h-4" />
          <span>Ir a Puntos Digitales</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
        <Link href="/whatsapp" className="btn-farmer-secondary text-sm">
          <ChatIcon className="w-4 h-4" />
          <span>Probar Agente WhatsApp</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
