import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logoutAction } from "@/lib/auth/actions";

const navLinks = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/puntos", label: "Puntos digitales" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper-deep/40">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-paper-line bg-paper px-6 py-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <Link href="/" className="font-display text-xl font-semibold text-ink">
            Cultiva
          </Link>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Panel administrativo
          </p>

          <nav className="mt-8 flex flex-row flex-wrap gap-2 md:flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 border-t border-paper-line pt-5">
            <p className="text-[13px] font-medium text-ink">{user.name}</p>
            <p className="text-[12px] text-ink-faint">{user.email}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-clay">
              {user.role}
            </p>
            <form action={logoutAction} className="mt-4">
              <button
                type="submit"
                className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-clay"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
