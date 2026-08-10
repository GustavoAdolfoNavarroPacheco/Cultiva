const links = [
  { href: "#pilares", label: "Los 3 pilares" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-line/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Cultiva
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint sm:inline">
            Educación agropecuaria
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[13px] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-clay"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="rounded-full bg-clay px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-paper shadow-[2px_2px_0_0_var(--color-clay-deep)] transition-transform hover:-translate-y-0.5"
        >
          Solicitar demo
        </a>
      </div>
    </header>
  );
}
