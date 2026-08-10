"use client";

import { useState, type FormEvent } from "react";

const interestOptions = [
  "Institución, cooperativa o financiador",
  "Quiero un Punto Digital en mi zona",
  "Piloto del agente de WhatsApp",
  "Otro",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-offline/30 bg-offline/10 px-7 py-10 text-center"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-offline-ink">
          Solicitud recibida
        </p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
          Gracias{name ? `, ${name}` : ""}. Te escribimos pronto.
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
          Un miembro del equipo de Cultiva revisará tu mensaje y te
          contactará por correo para coordinar la demo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink placeholder:text-ink-faint focus:border-clay"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label
            htmlFor="org"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
          >
            Organización (opcional)
          </label>
          <input
            id="org"
            name="org"
            type="text"
            className="mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink placeholder:text-ink-faint focus:border-clay"
            placeholder="Cooperativa, ONG, institución…"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
        >
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink placeholder:text-ink-faint focus:border-clay"
          placeholder="tucorreo@ejemplo.com"
        />
      </div>

      <div>
        <label
          htmlFor="interest"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
        >
          Cuéntanos qué te interesa
        </label>
        <select
          id="interest"
          name="interest"
          defaultValue=""
          required
          className="mt-2 w-full appearance-none rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink focus:border-clay"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-2 w-full rounded-lg border border-paper-line bg-paper px-4 py-3 text-ink placeholder:text-ink-faint focus:border-clay"
          placeholder="Cuéntanos sobre tu comunidad, tu equipo o el curso que quieres capacitar."
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-clay px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.12em] text-paper shadow-[3px_3px_0_0_var(--color-clay-deep)] transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        Solicitar demo
      </button>
    </form>
  );
}
