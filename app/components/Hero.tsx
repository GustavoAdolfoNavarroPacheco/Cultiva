import StampBadge from "./StampBadge";

const traits = [
  "Diseñado para extensión agropecuaria",
  "Funciona sin conexión constante",
  "Video, PDF y chat guiado",
];

export default function Hero() {
  return (
    <section id="top" className="paper-texture relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:pb-28 md:pt-24">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-clay">
            Capacitación agropecuaria · con o sin señal
          </p>

          <h1 className="mt-5 max-w-xl font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            El conocimiento del campo, sembrado donde vive tu gente.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Un administrador carga los cursos una sola vez. Cada estudiante los
            recibe a su manera: descargándolos en un Punto Digital, o
            avanzando lección por lección con un agente de WhatsApp —
            sin depender de datos móviles.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contacto"
              className="rounded-full bg-clay px-6 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-paper shadow-[3px_3px_0_0_var(--color-clay-deep)] transition-transform hover:-translate-y-0.5"
            >
              Solicitar una demo
            </a>
            <a
              href="#pilares"
              className="rounded-full border border-ink/25 px-6 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-clay hover:text-clay"
            >
              Ver los 3 pilares
            </a>
          </div>

          <ul className="mt-11 flex flex-wrap gap-x-8 gap-y-3">
            {traits.map((trait) => (
              <li
                key={trait}
                className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-faint"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                {trait}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xs md:max-w-sm">
          <StampBadge
            ink="var(--sello-admin-ink)"
            labelTop="CONTENIDO CERTIFICADO"
            labelBottom="CULTIVA · REGISTRO"
            center="20 lecc."
            rotate={-8}
            className="w-full drop-shadow-[3px_4px_0_rgba(36,29,18,0.12)]"
          />
        </div>
      </div>
    </section>
  );
}
