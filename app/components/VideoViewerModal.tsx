"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VideoIcon, DownloadIcon, CloseIcon } from "./icons";

export function VideoViewerModal({
  isOpen,
  onClose,
  videoUrl,
  title = "Video de la Lección — MP4",
}: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
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

  return (
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
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl h-[82vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800 text-white"
          >
            {/* Top Bar Header */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl shrink-0 border border-emerald-800/80">
                  <VideoIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                  {title}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Direct Download Button */}
                <a
                  href={videoUrl}
                  download
                  className="btn-farmer-primary text-xs sm:text-sm py-2 px-4 min-h-[40px] cursor-pointer"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Descargar Video</span>
                </a>

                {/* Close Button X */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-rose-950 hover:text-rose-400 hover:border hover:border-rose-800 transition-colors cursor-pointer"
                  title="Cerrar Reproductor (X)"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Native HTML5 Video Player */}
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Tu navegador no soporta la reproducción de video HTML5.
              </video>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
