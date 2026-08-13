"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloseIcon, CheckIcon, RocketIcon } from "./icons";

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiscoveryModal({ isOpen, onClose }: DiscoveryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ nombre: "", empresa: "", email: "", telefono: "", mensaje: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-6 sm:p-10 shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-sm">
                  <RocketIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-normal uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                    Campuslands Tech
                  </span>
                </div>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Agenda una Sesión de Descubrimiento
              </h3>
              <p className="mt-2 text-sm text-slate-600 font-normal leading-relaxed">
                Completa tus datos para analizar los retos tecnológicos de tu empresa y diseñar la hoja de ruta hacia una solución digital a medida.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Mendoza"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Empresa / Organización *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. AgroTech Solutions"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    ¿Qué desafío deseas resolver o qué proyecto buscas desarrollar? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe brevemente tus necesidades de software, IA, automatización o digitalización..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-farmer-primary text-sm shadow-md"
                  >
                    <span>Confirmar Solicitud</span>
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                <CheckIcon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                ¡Solicitud Registrada Exitosamente!
              </h3>
              <p className="text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                Gracias, <span className="font-bold text-slate-900">{formData.nombre}</span>. El equipo técnico de <span className="font-bold text-emerald-800">Campuslands</span> revisará tus requerimientos y te contactará en breve a <span className="font-bold text-slate-900">{formData.email}</span>.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-farmer-primary mx-auto text-sm"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
