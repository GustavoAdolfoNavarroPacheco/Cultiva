function ForkConnector({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 240 64"
      className={`mx-auto h-14 w-48 text-ink-faint/60 ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M120 0 V20 M120 20 C120 40 40 32 40 64 M120 20 C120 40 200 32 200 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="1 8"
        strokeLinecap="round"
      />
      <circle cx="120" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

function FlowCard({
  eyebrow,
  title,
  description,
  ink,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ink?: string;
}) {
  return (
    <div
      className="rounded-xl border border-paper-line bg-paper px-6 py-5 text-center shadow-[3px_3px_0_0_rgba(36,29,18,0.05)]"
      style={ink ? { borderColor: `color-mix(in srgb, ${ink} 35%, var(--paper-line))` } : undefined}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-[0.16em]"
        style={{ color: ink ?? "var(--clay)" }}
      >
        {eyebrow}
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-clay">
            El camino del contenido
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Un currículo, dos caminos hasta el estudiante
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            El contenido se prepara una sola vez y se bifurca según la
            conectividad de cada estudiante — no según el esfuerzo del equipo
            administrativo.
          </p>
        </div>

        <div className="mt-16">
          <FlowCard
            eyebrow="01 · Se crea"
            title="El administrador carga el contenido"
            description="Cursos de agroindustria en video y PDF, organizados por lección, listos para publicarse."
            ink="var(--sello-admin-ink)"
          />

          <ForkConnector />

          <div className="grid gap-6 sm:grid-cols-2">
            <FlowCard
              eyebrow="02a · Sin señal"
              title="Punto Digital"
              description="El estudiante descarga el contenido a su teléfono y lo estudia después, sin conexión."
              ink="var(--sello-offline-ink)"
            />
            <FlowCard
              eyebrow="02b · Con señal"
              title="Agente de WhatsApp"
              description="El estudiante avanza lección por lección, guiado por chat, con videos cortos y guías breves."
              ink="var(--sello-whatsapp-ink)"
            />
          </div>

          <ForkConnector flip />

          <FlowCard
            eyebrow="03 · Se aprende"
            title="El estudiante avanza a su ritmo"
            description="Con o sin señal, el mismo currículo — el mismo estándar de contenido — llega a cada persona."
          />
        </div>
      </div>
    </section>
  );
}
