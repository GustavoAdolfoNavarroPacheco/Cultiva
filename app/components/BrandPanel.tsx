"use client";

import { motion } from "motion/react";

const pillars = ["Panel administrativo", "Puntos digitales", "Agente de WhatsApp"];

export function BrandPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center px-2 py-10 lg:px-4"
    >
      <span className="font-display text-3xl font-extrabold tracking-tight text-green-900 sm:text-4xl">
        Agro.ai
      </span>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
        Capacitación agropecuaria que llega al campo — con o sin señal.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2.5">
        {pillars.map((pillar, index) => (
          <motion.li
            key={pillar}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-full px-4 py-1.5 text-[13px] font-medium text-green-700"
          >
            {pillar}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
