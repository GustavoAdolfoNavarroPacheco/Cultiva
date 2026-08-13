"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { PdfIcon, DownloadIcon, CloseIcon } from "./icons";

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title = "Guía Educativa — PDF",
}: {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Portal target only exists client-side after mount (avoids SSR document access)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop with Blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl h-[88vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200"
          >
            {/* Top Bar Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl shrink-0">
                  <PdfIcon className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {title}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Download Direct Button */}
                <a
                  href={pdfUrl}
                  download
                  className="btn-farmer-primary text-xs sm:text-sm py-2 px-4 min-h-[40px] cursor-pointer"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Descargar PDF</span>
                </a>

                {/* Close Button X */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                  title="Cerrar Previsualización (X)"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer with HTML5 Object + Iframe Fallback */}
            <div className="flex-1 bg-slate-100 relative overflow-hidden">
              <object
                data={`${pdfUrl}#toolbar=1`}
                type="application/pdf"
                className="w-full h-full border-0"
              >
                <iframe
                  src={`${pdfUrl}#toolbar=1`}
                  className="w-full h-full border-0"
                  title={title}
                >
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                    <PdfIcon className="w-16 h-16 text-emerald-700 mb-4" />
                    <p className="text-xl font-bold text-slate-900 mb-2">{title}</p>
                    <p className="text-slate-600 font-normal mb-6 max-w-md">
                      Tu navegador no soporta la vista previa directa. Puedes descargar el archivo PDF con el botón a continuación.
                    </p>
                    <a href={pdfUrl} download className="btn-farmer-primary text-base">
                      <DownloadIcon className="w-5 h-5" />
                      <span>Descargar Guía PDF</span>
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
