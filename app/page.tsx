import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
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

export const metadata = {
  title: "Plataforma Educativa — Capacitación Agropecuaria",
  description:
    "Solución integral de educación agropecuaria: Módulo Administrativo, Sistema Offline y Agente de WhatsApp.",
};

export default async function HomePage() {
  const user = await getCurrentUser();

  const pilar1Href = user ? (user.role === "admin" ? "/admin" : "/puntos") : "/login";
  const pilar2Href = user ? "/puntos" : "/login";
  const pilar3Href = user ? "/whatsapp" : "/login";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader role={user?.role} />

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
                  Estructura integral para la gestión administrativa, distribución offline y enseñanza interactiva.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Pilar 1 */}
                <Link
                  href={pilar1Href}
                  className="card-farmer flex flex-col justify-between p-8 group cursor-pointer transition-all hover:border-emerald-600 hover:shadow-lg"
                >
                  <div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-5 border border-emerald-200 transition-transform group-hover:scale-105">
                      <DashboardIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg">
                      Pilar 1
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2 group-hover:text-emerald-900 transition-colors">
                      Módulo Administrativo Web
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                      Panel central donde los administradores cargan y gestionan los cursos, videos, documentos en PDF y material de estudio.
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Carga y gestión de cursos y categorías</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Administración de videos y documentos PDF</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Configuración del flujo de preguntas para WhatsApp</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-800 group-hover:text-emerald-950 group-hover:underline">
                      {user ? (user.role === "admin" ? "Ir al Módulo Admin" : "Ver Cursos Offline") : "Iniciar Sesión como Admin"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-700 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Pilar 2 */}
                <Link
                  href={pilar2Href}
                  className="card-farmer flex flex-col justify-between p-8 group cursor-pointer transition-all hover:border-emerald-600 hover:shadow-lg"
                >
                  <div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-5 border border-emerald-200 transition-transform group-hover:scale-105">
                      <SignalIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg">
                      Pilar 2
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2 group-hover:text-emerald-900 transition-colors">
                      Sistema Offline
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                      Portal de educación con contenido habilitado para consulta y estudio sin conexión a internet, enfocado en brindar formación a la medida del Sector Agropecuario. Se busca que el material esté disponible para que al acceder a un punto digital se puedan descargar las lecciones y estudiar en cualquier lugar.
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Contenido habilitado para usar sin conexión</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Formación a la medida del Sector Agropecuario</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Descarga rápida de material al acceder a un punto</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-800 group-hover:text-emerald-950 group-hover:underline">
                      {user ? "Explorar Sistema Offline" : "Iniciar Sesión para Acceder"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-700 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Pilar 3 */}
                <Link
                  href={pilar3Href}
                  className="card-farmer flex flex-col justify-between p-8 group cursor-pointer transition-all hover:border-emerald-600 hover:shadow-lg"
                >
                  <div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-5 border border-emerald-200 transition-transform group-hover:scale-105">
                      <ChatIcon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-lg">
                      Pilar 3
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-3 mb-2 group-hover:text-emerald-900 transition-colors">
                      Agente Interactivo de WhatsApp
                    </h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                      Para estudiantes con acceso a internet que prefieren aprendizaje guiado lección por lección mediante un chatbot conversacional.
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <VideoIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Videos cortos y livianos (1 a 1.5 min)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <PdfIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Guías breves en formato PDF con previsualización</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Flujo pedagógico con preguntas y respuestas</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-800 group-hover:text-emerald-950 group-hover:underline">
                      {user ? "Simular Agente de WhatsApp" : "Iniciar Sesión para Acceder"}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-700 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
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

            {/* Quick Navigation Footer - ¿Listo para comenzar? */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900 text-white">
              <div>
                <p className="text-xl font-bold">¿Listo para comenzar?</p>
                <p className="text-sm text-slate-300 font-medium mt-0.5">Explora los contenidos de la Plataforma Educativa.</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={pilar2Href}
                  className="btn-farmer-primary text-sm"
                >
                  Sistema Offline
                </Link>
                <Link
                  href={pilar3Href}
                  className="btn-farmer-secondary text-sm"
                >
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
