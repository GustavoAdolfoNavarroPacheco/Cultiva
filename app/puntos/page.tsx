import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";

export const metadata = { title: "Puntos Digitales — Agro.ai" };
export const dynamic = "force-dynamic";

export default async function PuntosPublicPage() {
  const puntos = await db.select().from(puntosDigitales).orderBy(asc(puntosDigitales.name));

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50/40">
      <PublicHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Banner for Farmers */}
          <div className="rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-green-900 p-6 sm:p-10 text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-8 -mr-8 text-8xl opacity-10 pointer-events-none select-none">
              📡
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-green-100 backdrop-blur-md border border-white/20">
                <span>📶</span> Descargas sin Internet
              </span>
              <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                ¿Dónde te encuentras hoy?
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-emerald-100 font-medium leading-relaxed">
                Selecciona tu comunidad o punto digital cercano para descargar las guías y videos de capacitación directamente a tu teléfono celular.
              </p>
            </div>
          </div>

          {/* List of Puntos Digitales */}
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                <span>📍</span> Puntos Digitales Disponibles ({puntos.length})
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {puntos.map((punto, index) => (
                <div
                  key={punto.id}
                  className="card-farmer animate-sprout-in flex flex-col justify-between p-6"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-800 border border-green-200">
                        {punto.zona}
                      </span>
                      <span className="text-2xl">🏛️</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-emerald-950 leading-snug">
                      {punto.name}
                    </h3>

                    {punto.responsable && (
                      <p className="mt-2 text-sm text-emerald-800/80 font-medium flex items-center gap-1.5">
                        <span>👤</span> Encargado: {punto.responsable}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-900/10">
                    <Link
                      href={`/puntos/${punto.id}`}
                      className="btn-farmer-primary w-full text-center text-base"
                    >
                      <span>Ver Cursos Disponibles ➔</span>
                    </Link>
                  </div>
                </div>
              ))}

              {puntos.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-emerald-900/10 p-8">
                  <span className="text-4xl">📭</span>
                  <p className="mt-3 text-lg font-bold text-emerald-950">Todavía no hay puntos digitales registrados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
