import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section id="contacto" className="border-y border-paper-line bg-paper-deep/60 py-24">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-clay">
            Hablemos
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Llevemos tu curso al campo
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Ya seas una institución evaluando la plataforma o una comunidad
            que necesita un Punto Digital cercano, cuéntanos tu caso y te
            mostramos cómo encaja Cultiva.
          </p>

          <dl className="mt-10 space-y-5 border-t border-paper-line pt-8">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Para instituciones
              </dt>
              <dd className="mt-1 text-[15px] text-ink-soft">
                Coordinamos una demo del panel administrativo y el modelo de
                despliegue por regiones.
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Para comunidades y estudiantes
              </dt>
              <dd className="mt-1 text-[15px] text-ink-soft">
                Te contamos cómo activar un Punto Digital o probar el agente
                de WhatsApp en fase demo.
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-paper-line bg-paper p-7 shadow-[5px_5px_0_0_rgba(36,29,18,0.06)] sm:p-9">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
