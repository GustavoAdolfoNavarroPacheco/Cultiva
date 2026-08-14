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
  VideoIcon,
  PdfIcon,
  CheckIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PrinterIcon,
  ShareIcon,
  CpuIcon,
  LayersIcon,
  RocketIcon,
  UserIcon,
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
  const [activePilarTab, setActivePilarTab] = useState<1 | 2 | 3>(1);

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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 text-slate-900 selection:bg-emerald-500 selection:text-white print:bg-white print:text-black">
      {/* Header público (oculto en impresión) */}
      <div className="print:hidden">
        <PublicHeader role={userRole} />
      </div>

      <PageTransition>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 sm:py-12 print:p-0">
          <div className="mx-auto max-w-5xl space-y-10 print:space-y-2 print:max-w-none">

            {/* ─── BARRA DE ACCIÓN EJECUTIVA (Oculta al imprimir) ─── */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/90 print:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
                  <SproutIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                    Ficha Técnica & Ejecutiva
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
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Copiar enlace de esta pieza"
                >
                  <ShareIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copied ? "¡Enlace Copiado!" : "Compartir"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                  title="Imprimir o Exportar en PDF A4"
                >
                  <PrinterIcon className="w-4 h-4 text-emerald-200" />
                  <span>Descargar / Imprimir en PDF A4</span>
                </button>
              </div>
            </div>

            {/* ─── HEADER EXCLUSIVO PARA IMPRESIÓN A4 (1 Sola Página) ─── */}
            <div className="hidden print:flex items-center justify-between pb-1 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-800 text-white p-0.5">
                  <Image src="/logos/campuslands.png" alt="Campuslands" width={16} height={16} className="h-full w-full object-contain" />
                </div>
                <span className="text-[8.5pt] font-bold text-slate-900">Campuslands Tech Solutions & KHC Agro</span>
              </div>
              <div>
                <span className="text-[7pt] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ficha Técnica Estratégica One Page • v2.4
                </span>
              </div>
            </div>

            {/* ─── 1. HERO EJECUTIVO / RESUMEN ESTRATÉGICO ─── */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-10 text-white shadow-xl border border-slate-800 print:bg-slate-900 print:text-white print:p-3 print:rounded-xl print:border-slate-800 print-avoid-break">
              <div className="relative z-10 space-y-5 print:space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-3 print:gap-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/90 py-1 pl-2 pr-3.5 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-800/80 print:text-[6.8pt] print:py-0.5 print:pl-1.5 print:pr-2">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white overflow-hidden p-0.5">
                      <Image src="/logos/campuslands.png" alt="Campuslands" width={14} height={14} className="h-full w-full object-contain" />
                    </div>
                    Solución EdTech Agro • KHC & Campuslands
                  </div>

                  <span className="text-[11px] font-mono font-bold text-emerald-400/90 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/80 print:text-[6.5pt] print:py-0.5 print:px-1.5">
                    Ecosistema Híbrido v2.4
                  </span>
                </div>

                <div className="max-w-3xl space-y-2 print:space-y-0.5">
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white print:text-[13pt] print:leading-tight">
                    Plataforma Educativa <span className="text-emerald-400">Sector Agro</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 print:text-[7pt] print:leading-snug font-normal">
                    Ecosistema integral diseñado para cerrar la brecha formativa rural, combinando <strong className="text-white font-semibold">gestión Cloud</strong>, <strong className="text-white font-semibold">distribución offline en Puntos Digitales</strong> y <strong className="text-white font-semibold">tutoría 24/7 con IA vía WhatsApp</strong> sin requerir instalación de aplicaciones.
                  </p>
                </div>

                {/* Métricas Clave de Impacto */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 print:pt-1.5 print:gap-1.5 print:border-slate-700">
                  <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-700/60 print:p-1.5 print:rounded-lg">
                    <span className="text-[10px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-400">Acceso WhatsApp</span>
                    <p className="text-lg print:text-[9pt] font-bold text-white leading-tight">0 Fricción</p>
                    <p className="text-[10px] print:text-[5.8pt] text-slate-400 leading-tight">Sin instalar apps</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-700/60 print:p-1.5 print:rounded-lg">
                    <span className="text-[10px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-400">Modo Offline</span>
                    <p className="text-lg print:text-[9pt] font-bold text-white leading-tight">100% Local</p>
                    <p className="text-[10px] print:text-[5.8pt] text-slate-400 leading-tight">Zonas sin internet</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-700/60 print:p-1.5 print:rounded-lg">
                    <span className="text-[10px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-400">DeepSeek IA</span>
                    <p className="text-lg print:text-[9pt] font-bold text-white leading-tight">&lt; 2s</p>
                    <p className="text-[10px] print:text-[5.8pt] text-slate-400 leading-tight">Tutor interactivo</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 p-3 border border-slate-700/60 print:p-1.5 print:rounded-lg">
                    <span className="text-[10px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-400">Multimedia</span>
                    <p className="text-lg print:text-[9pt] font-bold text-white leading-tight">PDF + MP4</p>
                    <p className="text-[10px] print:text-[5.8pt] text-slate-400 leading-tight">En 1 solo mensaje</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none print:hidden" />
            </section>

            {/* ─── 2. LOS 3 PILARES DEL PROYECTO (DESGLOSE TÉCNICO) ─── */}
            <section className="space-y-4 print:space-y-1.5 print-avoid-break">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 print:gap-1">
                <div>
                  <span className="text-xs print:text-[6.5pt] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                    Arquitectura Funcional
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl print:text-[10.5pt] font-bold text-slate-900 mt-1">
                    Los 3 Pilares Estratégicos del Proyecto
                  </h2>
                </div>

                {/* Tabs interactivas (ocultas al imprimir) */}
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-200/70 p-1 border border-slate-300/80 print:hidden">
                  <button
                    type="button"
                    onClick={() => setActivePilarTab(1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePilarTab === 1
                        ? "bg-white text-emerald-950 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pilar 1: Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePilarTab(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePilarTab === 2
                        ? "bg-white text-emerald-950 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pilar 2: Offline
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePilarTab(3)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePilarTab === 3
                        ? "bg-white text-emerald-950 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pilar 3: WhatsApp IA
                  </button>
                </div>
              </div>

              {/* Grid de Pilares en A4: 3 Columnas compactas y elegantes */}
              <div className="grid gap-4 lg:grid-cols-3 print:grid-cols-3 print:gap-2">
                {/* PILAR 1 */}
                <div
                  className={`rounded-2xl bg-white p-5 shadow-sm border transition-all flex flex-col justify-between print:rounded-xl print:p-2.5 print:border-slate-300 ${
                    activePilarTab === 1
                      ? "ring-2 ring-emerald-600 border-emerald-400 bg-emerald-50/20 print:ring-1 print:bg-emerald-50/30"
                      : "border-slate-200/90"
                  }`}
                >
                  <div className="space-y-2.5 print:space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 print:h-5 print:w-5 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-xs">
                        <DashboardIcon className="w-4 h-4 print:w-3 print:h-3" />
                      </div>
                      <span className="text-[11px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Pilar 1
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base print:text-[8pt] font-bold text-slate-900 leading-tight">
                        Módulo Administrativo Web
                      </h3>
                      <p className="text-xs print:text-[6pt] font-medium text-slate-500">
                        Control & Gestión Curricular
                      </p>
                    </div>

                    <p className="text-xs print:text-[6.5pt] print:leading-tight text-slate-600 font-normal">
                      Panel centralizado en la nube para gestionar cursos, lecciones, guías PDF, videos MP4 y supervisar chats en vivo.
                    </p>

                    <ul className="space-y-1 pt-1.5 border-t border-slate-100 text-xs print:text-[6.2pt] font-medium text-slate-700 print:pt-1 print:space-y-0.5">
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Cursos, módulos y banco de reactivos.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Monitoreo con conmutación a Modo Manual.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Gestión de Puntos Digitales y analítica.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 print:hidden">
                    <Link
                      href={userRole === "admin" ? "/admin" : "/login"}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                    >
                      <span>Acceder a Panel Admin</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* PILAR 2 */}
                <div
                  className={`rounded-2xl bg-white p-5 shadow-sm border transition-all flex flex-col justify-between print:rounded-xl print:p-2.5 print:border-slate-300 ${
                    activePilarTab === 2
                      ? "ring-2 ring-emerald-600 border-emerald-400 bg-emerald-50/20 print:ring-1 print:bg-emerald-50/30"
                      : "border-slate-200/90"
                  }`}
                >
                  <div className="space-y-2.5 print:space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 print:h-5 print:w-5 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-xs">
                        <SignalIcon className="w-4 h-4 print:w-3 print:h-3" />
                      </div>
                      <span className="text-[11px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Pilar 2
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base print:text-[8pt] font-bold text-slate-900 leading-tight">
                        Modo Offline en Puntos Digitales
                      </h3>
                      <p className="text-xs print:text-[6pt] font-medium text-slate-500">
                        Inclusión Rural Sin Conexión
                      </p>
                    </div>

                    <p className="text-xs print:text-[6.5pt] print:leading-tight text-slate-600 font-normal">
                      Operación local en sedes rurales sin internet, permitiendo reproducir lecciones y descargar PDFs en red local.
                    </p>

                    <ul className="space-y-1 pt-1.5 border-t border-slate-100 text-xs print:text-[6.2pt] font-medium text-slate-700 print:pt-1 print:space-y-0.5">
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Videos MP4 y guías PDF en red local.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Bitácora de descargas por estudiante.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Sincronización diferida de métricas.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 print:hidden">
                    <Link
                      href={userRole ? "/puntos" : "/login"}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                    >
                      <span>Ver Puntos Digitales</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* PILAR 3 */}
                <div
                  className={`rounded-2xl bg-white p-5 shadow-sm border transition-all flex flex-col justify-between print:rounded-xl print:p-2.5 print:border-slate-300 ${
                    activePilarTab === 3
                      ? "ring-2 ring-emerald-600 border-emerald-400 bg-emerald-50/20 print:ring-1 print:bg-emerald-50/30"
                      : "border-slate-200/90"
                  }`}
                >
                  <div className="space-y-2.5 print:space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 print:h-5 print:w-5 items-center justify-center rounded-lg bg-emerald-900 text-white shadow-xs">
                        <ChatIcon className="w-4 h-4 print:w-3 print:h-3" />
                      </div>
                      <span className="text-[11px] print:text-[6pt] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Pilar 3
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base print:text-[8pt] font-bold text-slate-900 leading-tight">
                        Agente WhatsApp + IA DeepSeek
                      </h3>
                      <p className="text-xs print:text-[6pt] font-medium text-slate-500">
                        Tutoría Conversacional & Quizzes
                      </p>
                    </div>

                    <p className="text-xs print:text-[6.5pt] print:leading-tight text-slate-600 font-normal">
                      Interacción pedagógica nativa vía WhatsApp Cloud API con botones de respuesta rápida, evaluación y entrega de archivos.
                    </p>

                    <ul className="space-y-1 pt-1.5 border-t border-slate-100 text-xs print:text-[6.2pt] font-medium text-slate-700 print:pt-1 print:space-y-0.5">
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Botones interactivos nativos (Quick Reply).</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Envío de PDF y video en un solo mensaje.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <CheckIcon className="w-3 h-3 print:w-2.5 print:h-2.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Quizzes interactivos pregunta por pregunta.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 print:hidden">
                    <Link
                      href={userRole ? "/whatsapp" : "/login"}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                    >
                      <span>Simular Agente de WhatsApp</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── 3. FICHA TÉCNICA Y BLUEPRINT DE ARQUITECTURA ─── */}
            <section className="rounded-3xl bg-white p-7 sm:p-9 shadow-sm border border-slate-200/90 space-y-4 print:rounded-xl print:p-2.5 print:space-y-1.5 print:border-slate-300 print-avoid-break">
              <div>
                <span className="text-xs print:text-[6pt] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  Especificaciones Técnicas
                </span>
                <h2 className="font-display text-xl sm:text-2xl print:text-[10pt] font-bold text-slate-900 mt-1">
                  Arquitectura del Sistema & Stack Tecnológico
                </h2>
              </div>

              {/* Grid de Especificaciones Técnicas */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-1.5">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-0.5 print:p-1.5 print:rounded-lg">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs print:text-[6pt] uppercase tracking-wider">
                    <CpuIcon className="w-3 h-3 shrink-0" />
                    <span>Frontend / Server</span>
                  </div>
                  <p className="text-xs print:text-[7pt] font-bold text-slate-900">Next.js 15 & React 19</p>
                  <p className="text-[11px] print:text-[5.5pt] text-slate-500 leading-tight">App Router & RSC híbrido.</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-0.5 print:p-1.5 print:rounded-lg">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs print:text-[6pt] uppercase tracking-wider">
                    <LayersIcon className="w-3 h-3 shrink-0" />
                    <span>Base de Datos</span>
                  </div>
                  <p className="text-xs print:text-[7pt] font-bold text-slate-900">PostgreSQL + Drizzle</p>
                  <p className="text-[11px] print:text-[5.5pt] text-slate-500 leading-tight">Esquema tipado end-to-end.</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-0.5 print:p-1.5 print:rounded-lg">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs print:text-[6pt] uppercase tracking-wider">
                    <SparklesIcon className="w-3 h-3 shrink-0" />
                    <span>Motor de IA</span>
                  </div>
                  <p className="text-xs print:text-[7pt] font-bold text-slate-900">DeepSeek Reasoning</p>
                  <p className="text-[11px] print:text-[5.5pt] text-slate-500 leading-tight">Prompts contextualizados.</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-0.5 print:p-1.5 print:rounded-lg">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs print:text-[6pt] uppercase tracking-wider">
                    <ShieldCheckIcon className="w-3 h-3 shrink-0" />
                    <span>Meta Cloud API</span>
                  </div>
                  <p className="text-xs print:text-[7pt] font-bold text-slate-900">Graph API v22.0</p>
                  <p className="text-[11px] print:text-[5.5pt] text-slate-500 leading-tight">Webhooks con firma HMAC.</p>
                </div>
              </div>

              {/* Diagrama de Flujo de Datos */}
              <div className="rounded-2xl bg-slate-900 p-4 sm:p-5 text-white space-y-2 print:p-2 print:rounded-lg print:space-y-1 print:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] print:text-[6pt] font-bold uppercase tracking-widest text-emerald-400">
                    Flujo de Datos Omnicanal
                  </span>
                  <span className="text-[10px] print:text-[5.5pt] font-mono text-slate-400">Webhook Bidireccional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 print:grid-cols-4 print:gap-1 text-center text-xs">
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700 print:p-1">
                    <p className="font-bold text-emerald-400 print:text-[6.5pt]">1. Usuario</p>
                    <p className="text-[10px] print:text-[5.5pt] text-slate-300 leading-tight">Mensaje o botón en WhatsApp.</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700 print:p-1">
                    <p className="font-bold text-emerald-400 print:text-[6.5pt]">2. Meta Graph</p>
                    <p className="text-[10px] print:text-[5.5pt] text-slate-300 leading-tight">Valida HMAC y envía webhook.</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700 print:p-1">
                    <p className="font-bold text-emerald-400 print:text-[6.5pt]">3. DeepSeek IA</p>
                    <p className="text-[10px] print:text-[5.5pt] text-slate-300 leading-tight">Consulta DB y genera respuesta.</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700 print:p-1">
                    <p className="font-bold text-emerald-400 print:text-[6.5pt]">4. Despacho</p>
                    <p className="text-[10px] print:text-[5.5pt] text-slate-300 leading-tight">Entrega texto, PDF o video.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── 4. MATRIZ DE COMPARACIÓN: LMS TRADICIONAL VS KHC AGRO ─── */}
            <section className="rounded-3xl bg-white p-7 sm:p-9 shadow-sm border border-slate-200/90 space-y-3 print:rounded-xl print:p-2.5 print:space-y-1.5 print:border-slate-300 print-avoid-break">
              <div>
                <span className="text-xs print:text-[6pt] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  Propuesta de Valor
                </span>
                <h2 className="font-display text-xl sm:text-2xl print:text-[10pt] font-bold text-slate-900 mt-1">
                  Diferencial Competitivo & Retorno de Valor
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm print:text-[6.5pt] text-slate-700">
                  <thead className="bg-slate-100 text-xs print:text-[6pt] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 print:py-1 print:px-1.5 rounded-l-lg">Criterio de Evaluación</th>
                      <th className="px-3 py-2 print:py-1 print:px-1.5 text-slate-500">LMS Tradicional (Moodle / Web)</th>
                      <th className="px-3 py-2 print:py-1 print:px-1.5 text-emerald-950 font-bold bg-emerald-50/80 rounded-r-lg">Ecosistema KHC Agro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                    <tr>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-bold text-slate-900">Barrera de Entrada</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 text-slate-500">Alta (Descargar apps, recordar contraseñas)</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-semibold text-emerald-900 bg-emerald-50/30">Cero (Acceso nativo y directo por WhatsApp)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-bold text-slate-900">Conectividad Rural</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 text-slate-500">Inutilizable sin conexión continua</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-semibold text-emerald-900 bg-emerald-50/30">100% Operativo con Puntos Digitales Offline</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-bold text-slate-900">Tutoría & Acompañamiento</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 text-slate-500">Respuestas diferidas por foros o correos</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-semibold text-emerald-900 bg-emerald-50/30">Tutor con IA pedagógica 24/7 en tiempo real</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-bold text-slate-900">Evaluación del Aprendizaje</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 text-slate-500">Formularios extensos con alta deserción</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-semibold text-emerald-900 bg-emerald-50/30">Quizzes interactivos pregunta a pregunta</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-bold text-slate-900">Supervisión en Vivo</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 text-slate-500">Compleja intervención durante la sesión</td>
                      <td className="px-3 py-2 print:py-0.5 print:px-1.5 font-semibold text-emerald-900 bg-emerald-50/30">Conmutación inmediata a atención humana</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ─── 5. LLAMADO A LA ACCIÓN & CONTACTO EJECUTIVO (Oculto al imprimir) ─── */}
            <section className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 print:hidden">
              <div className="space-y-3 text-center sm:text-left max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3.5 py-1 rounded-xl border border-emerald-700/60">
                  Despliegue & Escalabilidad
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold">
                  ¿Listo para implementar esta solución en tu organización?
                </h3>
                <p className="text-sm text-emerald-100 font-medium">
                  Agenda una sesión ejecutiva de descubrimiento técnico con el equipo de Campuslands y explora una demostración guiada de los 3 pilares.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-emerald-950 hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
                >
                  <RocketIcon className="w-4 h-4 text-emerald-800" />
                  <span>Agendar Sesión Técnica</span>
                </button>

                <Link
                  href="/whatsapp"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/80 bg-emerald-900/60 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  <ChatIcon className="w-4 h-4 text-emerald-300" />
                  <span>Probar Simulador</span>
                </Link>
              </div>
            </section>

            {/* Footer de Ficha Técnica */}
            <footer className="text-center text-xs print:text-[6.5pt] text-slate-500 pt-2 border-t border-slate-200 print:pt-1">
              <p>
                Plataforma Educativa Sector Agro • Desarrollado por <strong>Campuslands Tech Solutions</strong> en alianza con <strong>KHC</strong>.
              </p>
              <p className="mt-0.5 text-[11px] print:text-[5.8pt] text-slate-400">
                Documento estratégico oficial confidencial para evaluación técnica e institucional.
              </p>
            </footer>

          </div>
        </main>
      </PageTransition>

      <DiscoveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
