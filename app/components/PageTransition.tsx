"use client";

import { motion } from "motion/react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
