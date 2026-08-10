import Link from "next/link";
import { PublicHeader } from "@/app/components/PublicHeader";
import { PageTransition } from "@/app/components/PageTransition";
import {
  SproutIcon,
  DashboardIcon,
  SignalIcon,
  ChatIcon,
  VideoIcon,
  PdfIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/app/components/icons";

export const metadata = { title: "Acerca de Plataforma Educativa" };

export default function InfoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader />

      <PageTransition>
        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Hero Section */}
            <div className="rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-800/80">
                  <SproutIcon className="w-4 h-4 text-emerald-400" /> Plataforma Educativa
                </div>

                <h1 className="font-display text-3xl font-black tracking-tight sm:text-5xl leading-tight text-white">
                  Información General de la Plataforma <span className="text-emerald-500">Educativa</span>
                </h1>

                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  La Plataforma Educativa es una solución estructurada en tres pilares fundamentales, diseñada para brindar educación y capacitación accesible a estudiantes e integrantes del sector agropecuario, adaptándose tanto a zonas rurales sin conectividad como a entornos con acceso a internet.
                </p>
              </div>
            </div>

            {/* 3 Core Pillars Section */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-display text-3xl font-black text-slate-900">
                  Los 3 Pilares del Proyecto
                </h2>
                <p className="mt-2 text-base font-medium text-slate-600">
                  Estructura integral para la gestión, distribución offline y enseñanza interactiva.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Pilar 1 */}
                <div className="card-farmer flex flex-col justify-between p-8">
                  <div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-5 border border-emerald-200">
                      <DashboardIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg">
                      Pilar 1
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2">
                      Módulo Administrativo Web
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                      Panel de control centralizado donde los administradores estructuran y gestionan el contenido educativo.
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Carga de cursos y categorías</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Gestión de videos y documentos PDF</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Configuración del flujo de preguntas para WhatsApp</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100">
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                    >
                      <span>Ir al Módulo Admin</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="card-farmer flex flex-col justify-between p-8">
                  <div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-5 border border-emerald-200">
                      <SignalIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg">
                      Pilar 2
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2">
                      Sistema Offline (Puntos Digitales)
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                      Diseñado para estudiantes en zonas rurales con conectividad limitada o nula a internet.
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Ubicación en recintos y puntos físicos comunales</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Descarga directa de lecciones y videos al celular</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Estudio posterior sin necesidad de conexión</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100">
                    <Link
                      href="/puntos"
                      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                    >
                      <span>Explorar Puntos Digitales</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="card-farmer flex flex-col justify-between p-8">
                  <div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-5 border border-emerald-200">
                      <ChatIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg">
                      Pilar 3
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2">
                      Agente Interactivo de WhatsApp
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                      Para estudiantes con acceso a internet que prefieren aprendizaje guiado lección por lección.
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <VideoIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Videos cortos y livianos (1 a 1.5 min)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <PdfIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Guías breves en formato PDF</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Demo interactivo con preguntas y respuestas</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100">
                    <Link
                      href="/whatsapp"
                      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                    >
                      <span>Simular Agente de WhatsApp</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Formats Banner */}
            <div className="card-farmer p-8 sm:p-10 bg-gradient-to-br from-white to-emerald-50/50">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                Formatos de Contenido Adaptados al Campo
              </h2>
              <p className="text-slate-600 font-medium text-base leading-relaxed max-w-3xl">
                La plataforma fue pensada desde el primer día para campesinos y personas cuya relación con la tecnología requiere interfaces limpias, letras grandes, sin emojis confusos e íconos vectoriales claros.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="font-bold text-slate-900 text-sm">Videos Cortos y Livianos</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Duración máxima de 1 a 1.5 minutos para consumo óptimo de datos.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="font-bold text-slate-900 text-sm">Documentos PDF Breves</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Material de consulta rápida descargable directamente al teléfono.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="font-bold text-slate-900 text-sm">Evaluación Interactiva</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Preguntas sencillas de opción múltiple para medir el aprendizaje.</p>
                </div>
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900 text-white">
              <div>
                <p className="text-xl font-bold">¿Listo para comenzar?</p>
                <p className="text-sm text-slate-300 font-medium mt-0.5">Explora los contenidos de la Plataforma Educativa.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/puntos" className="btn-farmer-primary text-sm">
                  Puntos Digitales
                </Link>
                <Link href="/whatsapp" className="btn-farmer-secondary text-sm">
                  Agente WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
