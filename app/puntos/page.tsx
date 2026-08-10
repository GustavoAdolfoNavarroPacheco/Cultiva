import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";

export const metadata = { title: "Puntos Digitales — Agro.ai" };
export const dynamic = "force-dynamic";

export default async function PuntosPublicPage() {
  const puntos = await db.select().from(puntosDigitales).orderBy(asc(puntosDigitales.name));

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint hover:text-green-700"
        >
          ← Panel
        </Link>

        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-green-600">
          Punto Digital
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          Elige tu punto digital
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Selecciona el punto donde te encuentras para ver los cursos disponibles y descargar el
          contenido a tu teléfono.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {puntos.map((punto, index) => (
            <li
              key={punto.id}
              className="animate-sprout-in"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Link
                href={`/puntos/${punto.id}`}
                className="glass btn-glow block rounded-[var(--radius-lg)] p-5"
              >
                <p className="font-display text-lg font-bold text-ink">{punto.name}</p>
                <p className="mt-1 text-[13px] text-ink-soft">{punto.zona}</p>
              </Link>
            </li>
          ))}
          {puntos.length === 0 && (
            <p className="text-ink-faint">Todavía no hay puntos digitales registrados.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
