import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";
import { deletePunto } from "@/lib/actions/puntos";
import { ConfirmDeleteForm } from "@/app/components/admin/ConfirmDeleteForm";
import { PuntoCreateForm } from "./PuntoCreateForm";
import { SignalIcon, MapPinIcon, UserIcon, ArrowRightIcon } from "@/app/components/icons";

export default async function PuntosPage() {
  const puntos = await db.select().from(puntosDigitales).orderBy(desc(puntosDigitales.createdAt));

  return (
    <div className="space-y-8">
      {/* Header matched strictly to Panel Principal font hierarchy */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
          Modo Offline
        </h1>
        <p className="mt-1 text-base text-slate-600 font-medium">
          Gestión de puntos físicos de acceso donde los estudiantes descargan contenido técnico sin necesidad de internet.
        </p>
      </div>

      {/* Creation Form */}
      <div className="animate-sprout-in">
        <PuntoCreateForm />
      </div>

      {/* Grid of Puntos */}
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <SignalIcon className="w-5 h-5 text-emerald-700" />
          <h2 className="font-display text-xl font-bold text-slate-900">Puntos Registrados ({puntos.length})</h2>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {puntos.map((punto, index) => (
            <li
              key={punto.id}
              className="card-farmer animate-sprout-in flex flex-col justify-between p-6"
              style={{ animationDelay: `${100 + index * 60}ms` }}
            >
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200 mb-3">
                  <MapPinIcon className="w-3.5 h-3.5" /> {punto.zona}
                </span>

                <h3 className="font-display text-2xl font-bold text-slate-900 leading-snug">
                  {punto.name}
                </h3>

                {punto.responsable && (
                  <p className="mt-2 text-sm text-slate-600 font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    Encargado: <span className="font-semibold text-slate-800">{punto.responsable}</span>
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/puntos/${punto.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                >
                  <span>Ver vista pública</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>

                <ConfirmDeleteForm
                  action={deletePunto.bind(null, punto.id)}
                  confirmText={`¿Eliminar el punto "${punto.name}"?`}
                >
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                  >
                    Eliminar
                  </button>
                </ConfirmDeleteForm>
              </div>
            </li>
          ))}

          {puntos.length === 0 && (
            <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <SignalIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="mt-3 text-lg font-bold text-slate-900">Todavía no hay puntos registrados en el Modo Offline.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
