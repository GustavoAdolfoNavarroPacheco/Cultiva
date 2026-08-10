import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";

export const metadata = { title: "Puntos Digitales — Cultiva" };
export const dynamic = "force-dynamic";

export default async function PuntosPublicPage() {
  const puntos = await db.select().from(puntosDigitales).orderBy(asc(puntosDigitales.name));

  return (
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint hover:text-clay">
          ← Cultiva
        </Link>

        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.22em] text-offline-ink">
          Punto Digital
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
          Elige tu punto digital
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Selecciona el punto donde te encuentras para ver los cursos disponibles y descargar el
          contenido a tu teléfono.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {puntos.map((punto) => (
            <li key={punto.id}>
              <Link
                href={`/puntos/${punto.id}`}
                className="block rounded-xl border border-paper-line bg-paper-deep/40 p-5 transition-colors hover:border-offline"
              >
                <p className="font-display text-lg font-semibold text-ink">{punto.name}</p>
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
