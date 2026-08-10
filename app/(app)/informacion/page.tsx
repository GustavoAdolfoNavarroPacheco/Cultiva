import Link from "next/link";
import { LayoutDashboard, Wifi, MessageCircle, ArrowRight } from "lucide-react";

export const metadata = { title: "Acerca de Cultiva" };

const pillars = [
  {
    icon: LayoutDashboard,
    title: "Módulo Administrativo",
    href: "/admin",
    cta: "Ir al panel",
    description:
      "El equipo de capacitación carga cursos, videos y documentos en PDF desde un panel central, organiza el contenido por lección y controla qué se publica.",
    points: [
      "Gestión completa de cursos y lecciones",
      "Métricas de uso en tiempo real",
      "Control de publicación por curso",
    ],
  },
  {
    icon: Wifi,
    title: "Puntos Digitales",
    href: "/puntos",
    cta: "Ver puntos digitales",
    description:
      "Pensado para zonas con conectividad limitada: el estudiante visita un Punto Digital físico y descarga el contenido a su teléfono para estudiarlo sin conexión.",
    points: [
      "Catálogo de cursos por punto",
      "Descarga directa de video y PDF",
      "Cero dependencia de internet una vez descargado",
    ],
  },
  {
    icon: MessageCircle,
    title: "Agente de WhatsApp",
    href: "/whatsapp",
    cta: "Probar el chat",
    description:
      "Para estudiantes con acceso a internet: un asistente conversacional guía lección por lección, con videos cortos, guías breves y preguntas de refuerzo.",
    points: [
      "Flujo guiado paso a paso",
      "Preguntas con retroalimentación inmediata",
      "Progreso guardado por sesión",
    ],
  },
];

export default function InformacionPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-green-600">
        Acerca de Cultiva
      </p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Un mismo currículo, tres formas de llegar al estudiante
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
        Cultiva reúne la administración de contenido, la distribución sin conexión y el
        acompañamiento por chat en una sola plataforma de capacitación agropecuaria.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pillars.map((pillar, index) => (
          <div
            key={pillar.title}
            className="glass animate-sprout-in flex flex-col rounded-[var(--radius-lg)] p-7"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-600/25">
              <pillar.icon size={20} />
            </span>
            <h2 className="mt-5 font-display text-lg font-bold text-ink">{pillar.title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{pillar.description}</p>

            <ul className="mt-5 space-y-2 border-t border-white/60 pt-5">
              {pillar.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13px] text-ink-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href={pillar.href}
              className="btn-glow mt-6 inline-flex items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-[13px] font-semibold text-white shadow-md shadow-green-600/25"
            >
              {pillar.cta}
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
