"use client";

import Link from "next/link";
import { motion } from "motion/react";

const pillars = [
  { icon: "📡", title: "Puntos Digitales", desc: "Descarga videos y guías a tu teléfono en zonas con o sin señal." },
  { icon: "💬", title: "Agente WhatsApp", desc: "Aprende paso a paso respondiendo preguntas cortas en tu celular." },
  { icon: "📊", title: "Gestión Administrativa", desc: "Control total de cursos, lecciones y estadísticas de aprendizaje." },
];

export function BrandPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center px-2 py-6 lg:px-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-green-700 text-3xl text-white shadow-lg shadow-green-700/30">
          🌾
        </div>
        <div>
          <span className="font-display text-4xl font-black tracking-tight text-green-950 sm:text-5xl">
            Agro<span className="text-green-600">.ai</span>
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">
            Plataforma de Capacitación Agropecuaria
          </p>
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-bold leading-tight text-emerald-950 sm:text-3xl">
        Conocimiento para el campo, accesible para todos.
      </h2>
      <p className="mt-3 text-lg leading-relaxed text-emerald-900/80 font-medium">
        Formación agropecuaria diseñada especialmente con letras grandes, explicaciones sencillas y descargas sin internet.
      </p>

      {/* Feature cards */}
      <div className="mt-8 space-y-3">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="flex items-start gap-3.5 rounded-2xl border border-emerald-900/10 bg-white/70 p-4 shadow-sm backdrop-blur-md"
          >
            <span className="text-2xl p-2 bg-emerald-100/80 rounded-xl">{pillar.icon}</span>
            <div>
              <h3 className="font-bold text-base text-emerald-950">{pillar.title}</h3>
              <p className="text-sm text-emerald-900/80 mt-0.5">{pillar.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Direct public shortcuts */}
      <div className="mt-8 pt-6 border-t border-emerald-900/10 flex flex-wrap gap-3">
        <Link href="/puntos" className="btn-farmer-secondary text-sm">
          <span>📡 Ir a Puntos Digitales</span>
        </Link>
        <Link href="/whatsapp" className="btn-farmer-secondary text-sm">
          <span>💬 Probar Agente WhatsApp</span>
        </Link>
      </div>
    </motion.div>
  );
}
