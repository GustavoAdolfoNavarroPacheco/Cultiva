"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicHeader } from "@/app/components/PublicHeader";
import { PageTransition } from "@/app/components/PageTransition";
import { DiscoveryModal } from "@/app/components/DiscoveryModal";
import {
  SproutIcon,
  DashboardIcon,
  SignalIcon,
  ChatIcon,
  CheckIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PrinterIcon,
  ShareIcon,
  CpuIcon,
  LayersIcon,
  RocketIcon,
  DownloadIcon,
} from "@/app/components/icons";

export interface PlatformMetrics {
  coursesCount: number;
  lessonsCount: number;
  puntosCount: number;
  studentsCount: number;
  messagesCount: number;
}

interface OnePageViewProps {
  userRole?: string;
  metrics: PlatformMetrics;
}

export function OnePageView({ userRole, metrics }: OnePageViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDirectDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("onepage-a4-sheet");
      if (!element) {
        window.print();
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save("Plataforma-Educativa-Sector-Agro-Ficha-Tecnica.pdf");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100/70 text-slate-900 selection:bg-emerald-500 selection:text-white print:bg-white print:text-black">
      {/* Header público (oculto en impresión) */}
      <div className="print:hidden">
        <PublicHeader role={userRole} />
      </div>

      <PageTransition>
        <main className="flex-1 px-3 py-6 sm:px-6 lg:px-8 sm:py-8 print:p-0">
          <div className="mx-auto max-w-4xl space-y-6 print:space-y-0 print:max-w-none">

            {/* ─── BARRA DE ACCIÓN EJECUTIVA (Oculta al imprimir) ─── */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200/90 print:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
                  <SproutIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                    Ficha Técnica & Ejecutiva (1 Página A4)
                  </span>
                  <p className="text-xs text-slate-500 font-medium">
                    Proyecto Oficial: Plataforma Educativa Sector Agro
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Copiar enlace de esta pieza"
                >
                  <ShareIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copied ? "¡Copiado!" : "Compartir"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Imprimir con el navegador"
                >
                  <PrinterIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Imprimir</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectDownloadPdf}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-all shadow-sm cursor-pointer disabled:opacity-75"
                  title="Descarga directa del PDF en tamaño A4 (1 Sola Página)"
                >
                  <DownloadIcon className="w-4 h-4 text-emerald-200" />
                  <span>{isDownloading ? "Generando PDF..." : "Descargar PDF (1 Pág. A4)"}</span>
                </button>
              </div>
            </div>

            {/* =========================================================================
                CANVAS OFICIAL A4: FICHA TÉCNICA ESTRATÉGICA (1 SOLA PÁGINA)
                ========================================================================= */}
            <div
              id="onepage-a4-sheet"
              className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-3.5 text-slate-900 print:p-0 print:border-none print:shadow-none print:space-y-2.5 print:rounded-none"
            >
              {/* 1. Header Oficial de Ficha Técnica */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 print:pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white p-0.5 shadow-xs">
                    <Image src="/logos/campuslands.png" alt="Campuslands" width={22} height={22} className="h-full w-full object-contain" priority />
                  </div>
                  <div>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-tight block">
                      Campuslands Tech Solutions & KHC Agro
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium block">
                      Alianza Estratégica EdTech Sector Rural
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-300">
                    Ficha Técnica Ejecutiva A4 • v2.4
                  </span>
                </div>
              </div>

              {/* 2. Hero Card Ejecutivo & Métricas de Impacto */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-4 sm:p-5 text-white border border-slate-800 space-y-3 print:p-3 print:space-y-2 print:rounded-xl">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Ecosistema Híbrido de Formación Rural
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Cloud + Offline + WhatsApp IA
                    </span>
                  </div>
                  <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                    Plataforma Educativa <span className="text-emerald-400">Sector Agro</span>
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-snug font-normal">
                    Solución integral para cerrar la brecha formativa rural mediante <strong className="text-white font-semibold">gestión administrativa Cloud</strong>, <strong className="text-white font-semibold">distribución offline en Puntos Digitales</strong> y <strong className="text-white font-semibold">tutoría 24/7 con IA DeepSeek en WhatsApp</strong> sin fricción de instalación.
                  </p>
                </div>

                {/* 4 Indicadores Clave de Impacto */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  <div className="rounded-xl bg-slate-800/80 p-2 border border-slate-700/80 text-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">Acceso WhatsApp</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">0 Fricción</p>
                    <p className="text-[8.5px] text-slate-400 leading-tight">Sin instalar apps</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-2 border border-slate-700/80 text-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">Modo Offline</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">100% Local</p>
                    <p className="text-[8.5px] text-slate-400 leading-tight">Zonas sin internet</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-2 border border-slate-700/80 text-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">DeepSeek IA</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">&lt; 2s</p>
                    <p className="text-[8.5px] text-slate-400 leading-tight">Tutor interactivo</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-2 border border-slate-700/80 text-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">Multimedia</span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">PDF + MP4</p>
                    <p className="text-[8.5px] text-slate-400 leading-tight">En 1 solo mensaje</p>
                  </div>
                </div>
              </div>

              {/* 3. Los 3 Pilares Estratégicos del Proyecto */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Los 3 Pilares del Proyecto
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-medium">Estructura Tecnológica Integral</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Pilar 1 */}
                  <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col justify-between space-y-1.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-2xs">
                          <DashboardIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8.5px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Pilar 1</span>
                      </div>
                      <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Módulo Admin Web</h3>
                      <p className="text-[9px] text-slate-600 leading-tight">
                        Panel Cloud para gestionar cursos, video-lecciones, guías PDF y supervisión en vivo con modo manual.
                      </p>
                    </div>
                    <ul className="space-y-0.5 text-[8.5px] text-slate-700 pt-1 border-t border-slate-200">
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Gestión curricular y reactivos</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Chats en vivo con takeover</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Analítica y Puntos Digitales</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pilar 2 */}
                  <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col justify-between space-y-1.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-2xs">
                          <SignalIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8.5px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Pilar 2</span>
                      </div>
                      <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Modo Offline Rural</h3>
                      <p className="text-[9px] text-slate-600 leading-tight">
                        Distribución local en sedes rurales sin internet para consultar lecciones y guías con cero latencia.
                      </p>
                    </div>
                    <ul className="space-y-0.5 text-[8.5px] text-slate-700 pt-1 border-t border-slate-200">
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Videos y PDFs en red local</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Bitácora de descargas local</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Sincronización diferida</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pilar 3 */}
                  <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col justify-between space-y-1.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-900 text-white shadow-2xs">
                          <ChatIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8.5px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Pilar 3</span>
                      </div>
                      <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">WhatsApp IA Tutor</h3>
                      <p className="text-[9px] text-slate-600 leading-tight">
                        Tutoría pedagógica nativa vía Meta WhatsApp API con botones interactivos y entrega unificada de archivos.
                      </p>
                    </div>
                    <ul className="space-y-0.5 text-[8.5px] text-slate-700 pt-1 border-t border-slate-200">
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Botones Quick Reply nativos</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>PDF + MP4 en 1 solo mensaje</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckIcon className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                        <span>Quizzes interactivos 1 a 1</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Especificaciones Técnicas & Flujo Omnicanal */}
              <div className="rounded-2xl bg-white p-3.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    Arquitectura & Stack Tecnológico
                  </span>
                  <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Next.js 15 • PostgreSQL • DeepSeek • Meta API
                  </span>
                </div>

                {/* 4 Tech Chips */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[9px] uppercase">
                      <CpuIcon className="w-3 h-3" />
                      <span>Frontend & Server</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 leading-tight">Next.js 15 & React 19</p>
                    <p className="text-[8px] text-slate-500">App Router & RSC Híbrido</p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[9px] uppercase">
                      <LayersIcon className="w-3 h-3" />
                      <span>Base de Datos</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 leading-tight">PostgreSQL + Drizzle</p>
                    <p className="text-[8px] text-slate-500">Type-Safe & Migraciones</p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[9px] uppercase">
                      <SparklesIcon className="w-3 h-3" />
                      <span>Motor IA</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 leading-tight">DeepSeek Reasoning</p>
                    <p className="text-[8px] text-slate-500">Prompts & Quizzes Parser</p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[9px] uppercase">
                      <ShieldCheckIcon className="w-3 h-3" />
                      <span>Meta Cloud API</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 leading-tight">Graph API v22.0</p>
                    <p className="text-[8px] text-slate-500">Webhooks HMAC SHA-256</p>
                  </div>
                </div>

                {/* Flujo Omnicanal en 4 Pasos */}
                <div className="rounded-xl bg-slate-900 p-2.5 text-white">
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div className="rounded-lg bg-slate-800/90 p-1.5 border border-slate-700">
                      <p className="font-bold text-emerald-400 text-[9px] leading-tight">1. Usuario WhatsApp</p>
                      <p className="text-[8px] text-slate-300 leading-tight">Mensaje o botón Quick Reply</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/90 p-1.5 border border-slate-700">
                      <p className="font-bold text-emerald-400 text-[9px] leading-tight">2. Meta Webhook</p>
                      <p className="text-[8px] text-slate-300 leading-tight">Valida HMAC y envía a Next.js</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/90 p-1.5 border border-slate-700">
                      <p className="font-bold text-emerald-400 text-[9px] leading-tight">3. DeepSeek IA + DB</p>
                      <p className="text-[8px] text-slate-300 leading-tight">Razona y formula respuesta</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/90 p-1.5 border border-slate-700">
                      <p className="font-bold text-emerald-400 text-[9px] leading-tight">4. Despacho Nativo</p>
                      <p className="text-[8px] text-slate-300 leading-tight">Entrega botones, PDF o video</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Matriz Comparativa de Retorno de Valor */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    Diferencial Competitivo vs LMS Tradicional
                  </span>
                  <span className="text-[9px] text-emerald-800 font-semibold">Alto Impacto & Cero Fricción</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[9px] text-slate-700">
                    <thead className="bg-slate-100 text-[8.5px] font-bold uppercase text-slate-800 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-1.5">Criterio de Evaluación</th>
                        <th className="px-3 py-1.5 text-slate-500">LMS Tradicional (Moodle / Web)</th>
                        <th className="px-3 py-1.5 text-emerald-950 font-bold bg-emerald-50">Ecosistema KHC Agro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3 py-1 font-bold text-slate-900">Barrera de Entrada</td>
                        <td className="px-3 py-1 text-slate-500">Alta (descargar apps, recordar claves)</td>
                        <td className="px-3 py-1 font-semibold text-emerald-900 bg-emerald-50/40">Cero (acceso directo en WhatsApp)</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1 font-bold text-slate-900">Conectividad Rural</td>
                        <td className="px-3 py-1 text-slate-500">Inutilizable sin conexión continua</td>
                        <td className="px-3 py-1 font-semibold text-emerald-900 bg-emerald-50/40">100% Operativo con Puntos Digitales Offline</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1 font-bold text-slate-900">Tutoría y Soporte</td>
                        <td className="px-3 py-1 text-slate-500">Respuestas diferidas por foros o emails</td>
                        <td className="px-3 py-1 font-semibold text-emerald-900 bg-emerald-50/40">Tutor con IA pedagógica 24/7 en tiempo real</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1 font-bold text-slate-900">Evaluación</td>
                        <td className="px-3 py-1 text-slate-500">Formularios extensos con alta deserción</td>
                        <td className="px-3 py-1 font-semibold text-emerald-900 bg-emerald-50/40">Quizzes interactivos pregunta por pregunta</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1 font-bold text-slate-900">Supervisión Humana</td>
                        <td className="px-3 py-1 text-slate-500">Difícil intervención durante la sesión</td>
                        <td className="px-3 py-1 font-semibold text-emerald-900 bg-emerald-50/40">Conmutación inmediata a atención manual</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Footer Oficial de Ficha Técnica */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[8.5px] text-slate-500">
                <p>
                  Plataforma Educativa Sector Agro • <strong>Campuslands Tech Solutions</strong> & <strong>KHC</strong>
                </p>
                <p className="text-slate-400">
                  Documento Estratégico Oficial • Confidencial
                </p>
              </div>
            </div>

            {/* ─── LLAMADO A LA ACCIÓN & CONTACTO (Oculto al imprimir) ─── */}
            <section className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
              <div className="space-y-1.5 text-center sm:text-left max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700/60">
                  Despliegue & Escalabilidad
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold">
                  ¿Listo para implementar esta solución en tu organización?
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Agenda una sesión ejecutiva de descubrimiento técnico con el equipo de Campuslands y explora una demostración guiada.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-emerald-950 hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
                >
                  <RocketIcon className="w-4 h-4 text-emerald-800" />
                  <span>Agendar Sesión Técnica</span>
                </button>

                <Link
                  href="/whatsapp"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/80 bg-emerald-900/60 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  <ChatIcon className="w-4 h-4 text-emerald-300" />
                  <span>Probar Simulador</span>
                </Link>
              </div>
            </section>

          </div>
        </main>
      </PageTransition>

      <DiscoveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

