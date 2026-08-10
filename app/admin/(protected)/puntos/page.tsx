import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";
import { deletePunto } from "@/lib/actions/puntos";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { PuntoCreateForm } from "./PuntoCreateForm";

export default async function PuntosPage() {
  const puntos = await db.select().from(puntosDigitales).orderBy(desc(puntosDigitales.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">Puntos Digitales</h1>
      <p className="mt-1 text-ink-soft">
        Lugares físicos donde los estudiantes descargan contenido a su teléfono sin necesidad de internet.
      </p>

      <div className="mt-8 animate-sprout-in">
        <PuntoCreateForm />
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puntos.map((punto, index) => (
          <li
            key={punto.id}
            className="glass animate-sprout-in rounded-[var(--radius-lg)] p-5"
            style={{ animationDelay: `${100 + index * 60}ms` }}
          >
            <p className="font-display text-lg font-bold text-ink">{punto.name}</p>
            <p className="mt-1 text-[13px] text-ink-soft">{punto.zona}</p>
            {punto.responsable && (
              <p className="mt-0.5 text-[12px] text-ink-faint">{punto.responsable}</p>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-white/60 pt-3">
              <Link
                href={`/puntos/${punto.id}`}
                target="_blank"
                className="text-[11px] font-semibold uppercase tracking-[0.06em] text-green-700 hover:underline"
              >
                Ver vista pública →
              </Link>
              <ConfirmDeleteForm
                action={deletePunto.bind(null, punto.id)}
                confirmText={`¿Eliminar el punto "${punto.name}"?`}
              >
                <button
                  type="submit"
                  className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint hover:text-red-600"
                >
                  Eliminar
                </button>
              </ConfirmDeleteForm>
            </div>
          </li>
        ))}
        {puntos.length === 0 && (
          <p className="text-[14px] text-ink-faint">Todavía no hay puntos digitales registrados.</p>
        )}
      </ul>
    </div>
  );
}
