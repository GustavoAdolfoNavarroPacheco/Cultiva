const columns = [
  {
    heading: "Producto",
    links: [
      { label: "Los 3 pilares", href: "#pilares" },
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Solicitar demo", href: "#contacto" },
    ],
  },
  {
    heading: "Contacto",
    links: [
      { label: "gabriela0836@gmail.com", href: "mailto:gabriela0836@gmail.com" },
      { label: "Solicitar un Punto Digital", href: "#contacto" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 border-b border-paper-line pb-12 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              Cultiva
            </span>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ink-soft">
              Capacitación agropecuaria que llega al campo — con panel
              administrativo, puntos digitales sin conexión y un agente
              guiado por WhatsApp.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-ink-soft transition-colors hover:text-clay"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
          © {new Date().getFullYear()} Cultiva. Demo de plataforma educativa.
        </p>
      </div>
    </footer>
  );
}
