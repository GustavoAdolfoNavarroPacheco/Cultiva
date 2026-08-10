import StampBadge from "./StampBadge";

type Pillar = {
  sello: { top: string; bottom: string; center: string };
  ink: string;
  tint: string;
  title: string;
  audience: string;
  description: string;
  details: string[];
  rotate: number;
};

const pillars: Pillar[] = [
  {
    sello: { top: "MÓDULO ADMINISTRATIVO", bottom: "CULTIVA · CENTRAL", center: "01" },
    ink: "var(--sello-admin-ink)",
    tint: "bg-admin/10",
    title: "Un panel para cargar y ordenar todo el contenido",
    audience: "Para administradores y equipos de capacitación",
    description:
      "Los administradores suben cursos, videos y documentos en PDF, los organizan por lección y deciden qué llega a cada Punto Digital o canal de WhatsApp.",
    details: [
      "Carga de video y PDF",
      "Organización por curso y lección",
      "Control de qué se publica y cuándo",
    ],
    rotate: -5,
  },
  {
    sello: { top: "PUNTO DIGITAL", bottom: "DESCARGA OFFLINE", center: "02" },
    ink: "var(--sello-offline-ink)",
    tint: "bg-offline/10",
    title: "Contenido que se descarga una vez y se estudia sin internet",
    audience: "Para estudiantes en zonas rurales o de campo",
    description:
      "El estudiante se acerca a un Punto Digital, descarga los videos y archivos directamente a su teléfono, y los estudia después — sin necesidad de conexión.",
    details: [
      "Descarga directa al teléfono",
      "Pensado para conectividad limitada",
      "Ideal para grupos y comunidades",
    ],
    rotate: 4,
  },
  {
    sello: { top: "AGENTE WHATSAPP", bottom: "APRENDIZAJE GUIADO", center: "03" },
    ink: "var(--sello-whatsapp-ink)",
    tint: "bg-whatsapp/10",
    title: "Un agente que guía lección por lección, por chat",
    audience: "Para estudiantes con acceso a internet",
    description:
      "Quienes prefieren aprendizaje guiado reciben un curso por WhatsApp: videos cortos, guías breves en PDF y preguntas que avanzan la lección.",
    details: [
      "Videos de 1 a 1.5 minutos",
      "Guías breves en PDF",
      "Fase demo: preguntas y respuestas fijas",
    ],
    rotate: -3,
  },
];

export default function Pillars() {
  return (
    <section id="pilares" className="border-y border-paper-line bg-paper-deep/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-clay">
            Tres sellos, un mismo currículo
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Tres maneras de llegar, un solo contenido
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Cada pilar certifica una etapa del recorrido: se crea una vez en
            el módulo administrativo, y llega al estudiante por la vía que
            tenga sentido para su conectividad.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="tear-edge flex flex-col rounded-2xl border border-paper-line bg-paper px-7 pb-8 pt-10 shadow-[4px_4px_0_0_rgba(36,29,18,0.06)]"
            >
              <StampBadge
                ink={pillar.ink}
                labelTop={pillar.sello.top}
                labelBottom={pillar.sello.bottom}
                center={pillar.sello.center}
                rotate={pillar.rotate}
                className="mx-auto h-28 w-28"
              />

              <p
                className={`mx-auto mt-6 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft ${pillar.tint}`}
              >
                {pillar.audience}
              </p>

              <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-ink">
                {pillar.title}
              </h3>

              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                {pillar.description}
              </p>

              <ul className="mt-6 space-y-2 border-t border-paper-line pt-5">
                {pillar.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-2 text-[13px] text-ink-soft"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: pillar.ink }}
                      aria-hidden="true"
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
