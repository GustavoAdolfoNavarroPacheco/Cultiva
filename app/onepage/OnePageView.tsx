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
          <div className="mx-auto max-w-5xl space-y-12 print:space-y-6">

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
                  title="Imprimir o Exportar en PDF"
                >
                  <PrinterIcon className="w-4 h-4 text-emerald-200" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
              </div>
            </div>

            {/* ─── 1. HERO EJECUTIVO / RESUMEN ESTRATÉGICO ─── */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl border border-slate-800 print:bg-white print:text-black print:p-4 print:border-none print:shadow-none">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-950/90 py-1 pl-2 pr-4 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-800/80 print:bg-emerald-100 print:text-emerald-900 print:border-emerald-300">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white overflow-hidden p-0.5">
                      <Image src="/logos/campuslands.png" alt="Campuslands" width={20} height={20} className="h-full w-full object-contain" />
                    </div>
                    Solución EdTech Agro • KHC & Campuslands
                  </div>

                  <span className="text-[11px] font-mono font-bold text-emerald-400/90 print:text-slate-600 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/80 print:border-slate-300">
                    Ecosistema Híbrido v2.4
                  </span>
                </div>

                <div className="max-w-3xl space-y-3">
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white print:text-slate-900 leading-[1.15]">
                    Plataforma Educativa <span className="text-emerald-400 print:text-emerald-800">Sector Agro</span>
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 print:text-slate-700 font-normal leading-relaxed">
                    Ecosistema tecnológico integral diseñado para cerrar la brecha formativa rural, combinando <strong className="text-white print:text-slate-900 font-semibold">gestión administrativa Cloud</strong>, <strong className="text-white print:text-slate-900 font-semibold">distribución offline en Puntos Digitales</strong> y <strong className="text-white print:text-slate-900 font-semibold">tutoría conversacional 24/7 con Inteligencia Artificial vía WhatsApp</strong> sin fricción de instalación.
                  </p>
                </div>

                {/* Métricas Clave de Impacto */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4 border-t border-slate-800/80 print:border-slate-200">
                  <div className="rounded-2xl bg-slate-800/60 p-3.5 border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">Acceso WhatsApp</span>
                    <p className="text-xl font-bold text-white print:text-slate-900 mt-0.5">0 Fricción</p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">Sin instalar apps</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 p-3.5 border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">Modo Offline</span>
                    <p className="text-xl font-bold text-white print:text-slate-900 mt-0.5">100% Local</p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">Zonas sin internet</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 p-3.5 border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">DeepSeek IA</span>
                    <p className="text-xl font-bold text-white print:text-slate-900 mt-0.5">&lt; 2s</p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">Tutor interactivo</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 p-3.5 border border-slate-700/60 print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">Multimedia</span>
                    <p className="text-xl font-bold text-white print:text-slate-900 mt-0.5">PDF + MP4</p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">En 1 solo mensaje</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none print:hidden" />
            </section>

            {/* ─── 2. LOS 3 PILARES DEL PROYECTO (DESGLOSE TÉCNICO) ─── */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl">
                    Arquitectura Funcional
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                    Los 3 Pilares Estratégicos
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

              {/* Grid de Pilares */}
              <div className="grid gap-6 lg:grid-cols-3 print:grid-cols-3">
                {/* PILAR 1 */}
                <div
                  className={`rounded-3xl bg-white p-6 shadow-sm border transition-all flex flex-col justify-between ${
                    activePilarTab === 1
                      ? "ring-2 ring-emerald-600 border-emerald-400 bg-emerald-50/20"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-xs">
                        <DashboardIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                        Pilar 1
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        Módulo Administrativo Web
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Centro de Control & Gestión Curricular
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Panel centralizado en la nube para crear, ordenar y publicar cursos, cargar video-lecciones, manuales técnicos en PDF y supervisar chats en vivo.
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Gestión de cursos, categorías y reactivos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Monitoreo en vivo de chats con conmutación a Modo Manual.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Control de Puntos Digitales y analítica de avance.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 print:hidden">
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
                  className={`rounded-3xl bg-white p-6 shadow-sm border transition-all flex flex-col justify-between ${
                    activePilarTab === 2
                      ? "ring-2 ring-emerald-600 border-emerald-400 bg-emerald-50/20"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-xs">
                        <SignalIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                        Pilar 2
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        Modo Offline en Puntos Digitales
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Inclusión Rural Sin Conexión
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Diseñado para operar en quioscos y sedes comunitarias del campo donde la conexión a internet es nula o inestable, permitiendo consultar materiales sin interrupciones.
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Visualización de videos MP4 y guías PDF en red local.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Bitácora de descarga local por estudiante/sede.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Sincronización diferida de métricas con el servidor central.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 print:hidden">
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
                  className={`rounded-3xl bg-white p-6 shadow-sm border transition-all flex flex-col justify-between ${
                    activePilarTab === 3
                      ? "ring-2 ring-emerald-600 border-emerald-400 bg-emerald-50/20"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-900 text-white shadow-xs">
                        <ChatIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                        Pilar 3
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        Agente WhatsApp + IA DeepSeek
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Tutoría Conversacional & Quizzes
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Interacción pedagógica nativa vía Meta WhatsApp Cloud API. Entrega de cursos, resolución de dudas, quizzes interactivos con botones rápidos y envío de PDFs/Videos en un solo mensaje.
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Mensajes interactivos con botones rápidos (Quick Reply).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Envío automático de guías PDF y videos MP4 con caption.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Evaluación interactiva pregunta por pregunta con score.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 print:hidden">
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
            <section className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200/90 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl">
                  Especificaciones Técnicas
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                  Arquitectura del Sistema & Stack Tecnológico
                </h2>
                <p className="text-sm text-slate-600 font-normal mt-1">
                  Componentes de software de grado empresarial implementados para garantizar alta disponibilidad y escalabilidad.
                </p>
              </div>

              {/* Grid de Especificaciones Técnicas */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <CpuIcon className="w-4 h-4" />
                    <span>Frontend & Servidor</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Next.js 15 & React 19</p>
                  <p className="text-xs text-slate-500">App Router, Server Actions y renderizado híbrido SSR/RSC.</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <LayersIcon className="w-4 h-4" />
                    <span>Base de Datos</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">PostgreSQL + Drizzle ORM</p>
                  <p className="text-xs text-slate-500">Esquema fuertemente tipado, migraciones versionadas y baja latencia.</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Motor de IA</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">DeepSeek Chat & Reasoner</p>
                  <p className="text-xs text-slate-500">Prompts contextualizados con catálogo LMS y lógica formativa.</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Meta Cloud API</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Graph API v22.0</p>
                  <p className="text-xs text-slate-500">Webhooks con firma HMAC SHA-256 y botones interactivos.</p>
                </div>
              </div>

              {/* Diagrama de Flujo de Datos */}
              <div className="rounded-2xl bg-slate-900 p-6 sm:p-8 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Flujo de Datos Omnicanal
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Webhook Bidireccional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700">
                    <p className="font-bold text-emerald-400">1. Usuario WhatsApp</p>
                    <p className="text-[11px] text-slate-400 mt-1">Escribe mensaje o presiona botón interactivo.</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700">
                    <p className="font-bold text-emerald-400">2. Meta Graph API</p>
                    <p className="text-[11px] text-slate-400 mt-1">Valida firma y envía webhook POST a Next.js.</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700">
                    <p className="font-bold text-emerald-400">3. DeepSeek IA + DB</p>
                    <p className="text-[11px] text-slate-400 mt-1">Consulta historial, cursos y genera respuesta pedagógica.</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700">
                    <p className="font-bold text-emerald-400">4. Despacho Nativo</p>
                    <p className="text-[11px] text-slate-400 mt-1">Entrega texto con botones, PDF o video en 1 mensaje.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── 4. MATRIZ DE COMPARACIÓN: LMS TRADICIONAL VS KHC AGRO ─── */}
            <section className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200/90 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl">
                  Propuesta de Valor
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                  Diferencial Competitivo & Retorno de Valor
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5 rounded-l-xl">Criterio</th>
                      <th className="px-4 py-3.5 text-slate-500">LMS Tradicional (Moodle / Web)</th>
                      <th className="px-4 py-3.5 text-emerald-950 font-bold bg-emerald-50/80 rounded-r-xl">Ecosistema KHC Agro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3.5 font-bold text-slate-900">Barrera de Entrada</td>
                      <td className="px-4 py-3.5 text-slate-500">Alta (Descargar apps, recordar usuario/clave)</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-900 bg-emerald-50/30">Cero (Acceso directo por WhatsApp)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-bold text-slate-900">Conectividad Rural</td>
                      <td className="px-4 py-3.5 text-slate-500">Inutilizable sin internet constante</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-900 bg-emerald-50/30">100% Funcional con Puntos Digitales Offline</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-bold text-slate-900">Acompañamiento y Tutoría</td>
                      <td className="px-4 py-3.5 text-slate-500">Respuestas diferidas por foros o emails</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-900 bg-emerald-50/30">Tutor con IA 24/7 en tiempo real</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-bold text-slate-900">Evaluación del Aprendizaje</td>
                      <td className="px-4 py-3.5 text-slate-500">Formularios extensos y aburridos</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-900 bg-emerald-50/30">Quizzes interactivos pregunta por pregunta</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-bold text-slate-900">Supervisión Humana</td>
                      <td className="px-4 py-3.5 text-slate-500">Difícil intervención en tiempo real</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-900 bg-emerald-50/30">Conmutación inmediata a atención manual</td>
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
            <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-200">
              <p>
                Plataforma Educativa Sector Agro • Desarrollado por <strong>Campuslands Tech Solutions</strong> en alianza con <strong>KHC</strong>.
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Documento estratégico confidencial para evaluación técnica e institucional.
              </p>
            </footer>

          </div>
        </main>
      </PageTransition>

      <DiscoveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
