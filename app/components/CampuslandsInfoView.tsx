"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "./PublicHeader";
import { PageTransition } from "./PageTransition";
import { DiscoveryModal } from "./DiscoveryModal";
import {
  CodeIcon,
  CpuIcon,
  SmartphoneIcon,
  LayersIcon,
  ZapIcon,
  ShieldCheckIcon,
  RocketIcon,
  HeadphonesIcon,
  TargetIcon,
  ArrowRightIcon,
  CheckIcon,
  AlertTriangleIcon,
  UserIcon,
} from "./icons";

interface CampuslandsInfoViewProps {
  userRole?: string;
}

const clientLogos = [
  { name: "Conexalab", src: "/logos/conexalab.png" },
  { name: "Fundación Cardiovascular", src: "/logos/fundacion-cardiovascular.png" },
  { name: "Mantis", src: "/logos/mantis.png" },
  { name: "Solvo", src: "/logos/solvo.png" },
  { name: "Disfarma", src: "/logos/disfarma.png" },
  { name: "Globant", src: "/logos/globant.png" },
];

export function CampuslandsInfoView({ userRole }: CampuslandsInfoViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60">
      <PublicHeader role={userRole} />

      <PageTransition>
        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-6xl space-y-16">
            {/* 5.1 Hero / Encabezado Principal */}
            <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-2xl border border-slate-800">
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-950 py-1.5 pl-2 pr-4 text-sm font-bold uppercase tracking-wider text-emerald-300 border border-emerald-800/80">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white overflow-hidden p-0.5">
                    <Image src="/logos/campuslands.png" alt="Campuslands" width={24} height={24} className="h-full w-full object-contain" />
                  </div>
                  Campuslands Tech Solutions
                </div>

                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15] text-white">
                  Transformación Digital e <span className="text-emerald-400">Inteligencia Artificial</span> para Empresas
                </h1>

                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  Diseñamos y construimos plataformas de software a la medida, aplicaciones web y móviles, e integraciones de IA avanzada para impulsar la eficiencia, competitividad y escalabilidad operativa de las organizaciones.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="btn-farmer-primary text-base shadow-lg cursor-pointer"
                  >
                    <span>Agenda una sesión de descubrimiento</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>

                  <a
                    href="#servicios"
                    className="btn-farmer-secondary text-base cursor-pointer"
                  >
                    Explorar Servicios
                  </a>
                </div>
              </div>

              {/* Decorative Background Accent */}
              <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none" />
            </section>

            {/* 5.2 Quiénes somos */}
            <section className="card-farmer p-8 sm:p-12">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-xl">
                  Nuestra Identidad
                </span>
                <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 mb-4 sm:text-4xl">
                  Quiénes Somos
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                  Campuslands es un equipo especializado en ingeniería de software, desarrollo de plataformas digitales e integración práctica de Inteligencia Artificial. Nos enfocamos en transformar necesidades complejas de negocio en soluciones tecnológicas robustas, escalables y orientadas a resultados.
                </p>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <div className="p-2.5 bg-emerald-100/80 text-emerald-800 rounded-xl w-fit mb-3">
                    <CodeIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Enfoque Enterprise</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Desarrollo bajo rigurosos estándares de calidad, seguridad de datos y arquitectura limpia.
                  </p>
                </div>

                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <div className="p-2.5 bg-emerald-100/80 text-emerald-800 rounded-xl w-fit mb-3">
                    <CpuIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Inteligencia Artificial</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Integración de agentes conversacionales y automatizaciones inteligentes en la operación.
                  </p>
                </div>

                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <div className="p-2.5 bg-emerald-100/80 text-emerald-800 rounded-xl w-fit mb-3">
                    <TargetIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Capacidad de Ejecución</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Acompañamiento completo desde la arquitectura inicial hasta la implementación en producción.
                  </p>
                </div>
              </div>
            </section>

            {/* 5.3 Qué ofrecemos */}
            <section id="servicios" className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-xl">
                  Servicios y Capacidades
                </span>
                <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 sm:text-4xl">
                  Qué Ofrecemos
                </h2>
                <p className="mt-2 text-base font-medium text-slate-600">
                  Soluciones integrales adaptadas a la madurez digital y objetivos de tu organización.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Servicio 1 */}
                <div className="card-farmer p-7 flex flex-col justify-between hover:border-emerald-600 transition-all">
                  <div>
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-4 border border-emerald-200">
                      <CodeIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      Desarrollo de Software a la Medida
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Sistemas construidos específicamente para atender la lógica de negocio y requerimientos propios de tu empresa.
                    </p>
                  </div>
                  <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Arquitectura escalable y personalizada</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Código mantenible e integrable</span>
                    </li>
                  </ul>
                </div>

                {/* Servicio 2 */}
                <div className="card-farmer p-7 flex flex-col justify-between hover:border-emerald-600 transition-all">
                  <div>
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-4 border border-emerald-200">
                      <CpuIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      Inteligencia Artificial Aplicada
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Implementación de modelos de lenguaje, asistentes inteligentes y automatizaciones basadas en IA para potenciar tu operación.
                    </p>
                  </div>
                  <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Agentes de respuesta conversacional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Procesamiento inteligente de datos</span>
                    </li>
                  </ul>
                </div>

                {/* Servicio 3 */}
                <div className="card-farmer p-7 flex flex-col justify-between hover:border-emerald-600 transition-all">
                  <div>
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-4 border border-emerald-200">
                      <SmartphoneIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      Aplicaciones Web y Móviles
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Portales web interactivos y soluciones móviles multiplataforma diseñadas para brindar una experiencia de usuario fluida.
                    </p>
                  </div>
                  <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Interfaces modernas y responsivas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Sincronización online y soporte offline</span>
                    </li>
                  </ul>
                </div>

                {/* Servicio 4 */}
                <div className="card-farmer p-7 flex flex-col justify-between hover:border-emerald-600 transition-all">
                  <div>
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-4 border border-emerald-200">
                      <LayersIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      Integración de Sistemas
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Conexión de plataformas existentes, servicios cloud, bases de datos y APIs heterogéneas en un flujo unificado.
                    </p>
                  </div>
                  <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Interconexión mediante APIs REST/GraphQL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Sincronización fluida de información</span>
                    </li>
                  </ul>
                </div>

                {/* Servicio 5 */}
                <div className="card-farmer p-7 flex flex-col justify-between hover:border-emerald-600 transition-all">
                  <div>
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-4 border border-emerald-200">
                      <ZapIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      Automatización de Procesos
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Reducción de trabajo manual y eliminación de cuellos de botella operativos mediante flujos de trabajo automatizados.
                    </p>
                  </div>
                  <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Optimización del tiempo del equipo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Disminución drástica del margen de error</span>
                    </li>
                  </ul>
                </div>

                {/* Servicio 6 */}
                <div className="card-farmer p-7 flex flex-col justify-between hover:border-emerald-600 transition-all">
                  <div>
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit mb-4 border border-emerald-200">
                      <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      Soluciones Tecnológicas Personalizadas
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Consultoría técnica y desarrollo a medida para proyectos estratégicos de alta complejidad y exigencia operativa.
                    </p>
                  </div>
                  <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Definición de arquitectura de datos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Garantía de rendimiento y seguridad</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5.4 Problema que resolvemos */}
            <section className="card-farmer p-8 sm:p-12">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-xl">
                  Desafíos Empresariales
                </span>
                <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 sm:text-4xl">
                  Problemas que Resolvemos
                </h2>
                <p className="mt-2 text-base text-slate-600 font-medium leading-relaxed">
                  Ayudamos a las empresas a superar las barreras tecnológicas que frenan su crecimiento operativo e innovación.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-slate-50/90 rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all flex items-start gap-4 shadow-2xs">
                  <div className="p-3 bg-rose-100 text-rose-700 rounded-xl shrink-0 border border-rose-200">
                    <AlertTriangleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Procesos Manuales e Ineficiencias</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed font-normal">
                      Reemplazamos planillas dispersas y tareas repetitivas por plataformas automatizadas que liberan tiempo valioso de tu equipo.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/90 rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all flex items-start gap-4 shadow-2xs">
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0 border border-amber-200">
                    <LayersIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Sistemas que no se Comunican</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed font-normal">
                      Conectamos herramientas aisladas para garantizar un flujo de datos centralizado, coherente y disponible en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/90 rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all flex items-start gap-4 shadow-2xs">
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 border border-emerald-200">
                    <CpuIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Adopción Compleja de Inteligencia Artificial</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed font-normal">
                      Facilitamos la incorporación práctica de la IA en la operación diaria, evitando proyectos teóricos o de poco valor real.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/90 rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all flex items-start gap-4 shadow-2xs">
                  <div className="p-3 bg-sky-100 text-sky-700 rounded-xl shrink-0 border border-sky-200">
                    <SmartphoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Brechas de Conectividad y Accesibilidad</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed font-normal">
                      Diseñamos soluciones optimizadas con soporte offline e interfaces intuitivas para entornos rurales o de conectividad limitada.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5.5 Nuestra propuesta de valor */}
            <section className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-xl">
                  Diferenciación Estratégica
                </span>
                <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 sm:text-4xl">
                  Nuestra Propuesta de Valor
                </h2>
                <p className="mt-2 text-base font-medium text-slate-600">
                  ¿Por qué las organizaciones eligen trabajar con Campuslands?
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Especialización Técnica</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Dominio de stacks tecnológicos modernos y patrones de arquitectura limpia adaptados a cada proyecto.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Acompañamiento Integral</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Participación activa y asesoría cercana desde la definición inicial de requisitos hasta el soporte post-despliegue.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Desarrollo 100% Personalizado</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Construimos soluciones ajustadas a tu modelo de trabajo sin forzar procesos rígidos prefabricados.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Integración Nativa de IA</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Capacidad demostrada para integrar Inteligencia Artificial en flujos operativos y de atención al usuario.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Eficiencia y Escalabilidad</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Sistemas optimizados para operar con altos volúmenes de usuarios y datos manteniendo bajos costos de soporte.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    6
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Adaptabilidad a Industrias</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Experiencia construyendo soluciones para sectores exigentes como el agropecuario, educativo y empresarial.
                  </p>
                </div>
              </div>
            </section>

            {/* 5.6 Cómo trabajamos */}
            <section className="card-farmer p-8 sm:p-12 space-y-8">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-xl">
                  Metodología Ágil
                </span>
                <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 sm:text-4xl">
                  Cómo Trabajamos
                </h2>
                <p className="mt-2 text-base text-slate-600 font-medium">
                  Un flujo estructurado en 6 etapas para garantizar la máxima calidad y cumplimiento de objetivos.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Etapa 1
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">Descubrimiento</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Analizamos tus necesidades, definimos los objetivos de negocio y estructuramos la arquitectura del proyecto.
                  </p>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Etapa 2
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">Diseño & UX/UI</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Creamos prototipos interactivos e interfaces limpias enfocadas en la usabilidad y la experiencia del usuario.
                  </p>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Etapa 3
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">Desarrollo Iterativo</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Construimos el software en entregas periódicas para permitir retroalimentación constante y ajustes a tiempo.
                  </p>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Etapa 4
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">QA & Pruebas</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Ejecutamos validaciones funcionales, pruebas de carga y de seguridad para asegurar la estabilidad del sistema.
                  </p>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Etapa 5
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">Despliegue</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Puesta en producción guiada en servidores o entornos cloud con monitorización de rendimiento inicial.
                  </p>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 relative">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                    Etapa 6
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mt-3 mb-1">Soporte & Evolución</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Mantenimiento continuo y escalado de funcionalidades según las necesidades cambiantes del negocio.
                  </p>
                </div>
              </div>
            </section>

            {/* 5.7 Diferenciales */}
            <section className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-xl">
                  Factores Clave
                </span>
                <h2 className="font-display text-3xl font-bold text-slate-900 mt-3 sm:text-4xl">
                  Nuestros Diferenciales
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <TargetIcon className="w-6 h-6 text-emerald-700 mb-2" />
                  <h3 className="font-bold text-slate-900 text-base">Talento Especializado</h3>
                  <p className="text-xs text-slate-500 font-normal mt-1">Ingenieros capacitados en desarrollo ágil y arquitectura sólida.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <RocketIcon className="w-6 h-6 text-emerald-700 mb-2" />
                  <h3 className="font-bold text-slate-900 text-base">Modelo Transparente</h3>
                  <p className="text-xs text-slate-500 font-normal mt-1">Comunicación abierta y visibilidad completa del avance del proyecto.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <CpuIcon className="w-6 h-6 text-emerald-700 mb-2" />
                  <h3 className="font-bold text-slate-900 text-base">IA Nativa</h3>
                  <p className="text-xs text-slate-500 font-normal mt-1">Capacidad para integrar componentes de IA desde la fase inicial de diseño.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <HeadphonesIcon className="w-6 h-6 text-emerald-700 mb-2" />
                  <h3 className="font-bold text-slate-900 text-base">Foco en Resultados</h3>
                  <p className="text-xs text-slate-500 font-normal mt-1">Soluciones diseñadas para impactar directamente los indicadores de la empresa.</p>
                </div>
              </div>
            </section>

            {/* 5.8 Clientes */}
            <section className="card-farmer p-8 sm:p-10 bg-gradient-to-br from-white to-emerald-50/40 overflow-hidden">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-xl">
                  Alianzas Estratégicas
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                  Clientes
                </h2>
                <p className="text-slate-600 font-normal text-sm sm:text-base leading-relaxed">
                  Empresas y organizaciones que confían en Campuslands para su transformación digital.
                </p>
              </div>

              <div
                className="relative -mx-8 sm:-mx-10 overflow-hidden"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
              >
                <div className="flex w-max items-center gap-6 animate-marquee motion-reduce:animate-none">
                  {[...clientLogos, ...clientLogos].map((client, index) => (
                    <div
                      key={`${client.name}-${index}`}
                      className="flex h-24 w-48 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                    >
                      <Image
                        src={client.src}
                        alt={client.name}
                        width={160}
                        height={64}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5.9 Call To Action Final */}
            <section className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-display">
                  ¿Listo para impulsar la tecnología de tu empresa?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  Conversa con nuestros especialistas y agenda una sesión de descubrimiento personalizada.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn-farmer-primary text-base whitespace-nowrap shadow-lg cursor-pointer"
                >
                  <span>Agenda una sesión de descubrimiento</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </section>
          </div>
        </main>
      </PageTransition>

      {/* Discovery Session Modal */}
      <DiscoveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
