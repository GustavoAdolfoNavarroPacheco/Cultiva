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
      <h1 className="font-display text-3xl font-semibold text-ink">Puntos Digitales</h1>
      <p className="mt-1 text-ink-soft">
        Lugares físicos donde los estudiantes descargan contenido a su teléfono sin necesidad de internet.
      </p>

      <div className="mt-8">
        <PuntoCreateForm />
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puntos.map((punto) => (
          <li key={punto.id} className="rounded-xl border border-paper-line bg-paper p-5">
            <p className="font-display text-lg font-semibold text-ink">{punto.name}</p>
            <p className="mt-1 text-[13px] text-ink-soft">{punto.zona}</p>
            {punto.responsable && (
              <p className="mt-0.5 text-[12px] text-ink-faint">{punto.responsable}</p>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-paper-line pt-3">
              <Link
                href={`/puntos/${punto.id}`}
                target="_blank"
                className="font-mono text-[11px] uppercase tracking-[0.1em] text-clay hover:underline"
              >
                Ver vista pública →
              </Link>
              <ConfirmDeleteForm
                action={deletePunto.bind(null, punto.id)}
                confirmText={`¿Eliminar el punto "${punto.name}"?`}
              >
                <button
                  type="submit"
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint"
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
