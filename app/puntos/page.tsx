import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";
import { PublicHeader } from "@/app/components/PublicHeader";
import { PageTransition } from "@/app/components/PageTransition";
import { getCurrentUser } from "@/lib/auth/current-user";
import { SignalIcon, MapPinIcon, BuildingIcon, UserIcon, ArrowRightIcon } from "@/app/components/icons";

export const metadata = { title: "Modo Offline — Plataforma Educativa" };
export const dynamic = "force-dynamic";

export default async function PuntosPublicPage() {
  const [puntos, user] = await Promise.all([
    db.select().from(puntosDigitales).orderBy(asc(puntosDigitales.name)),
    getCurrentUser(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <PublicHeader role={user?.role} />

      <PageTransition>
        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-6xl space-y-10">
            {/* Hero Banner for Farmers */}
            <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-800/80 mb-4">
                  <SignalIcon className="w-4 h-4 text-emerald-400" /> Modo Offline Sin Conexión
                </span>
                <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
                  ¿Dónde te encuentras hoy?
                </h1>
                <p className="mt-3 text-lg text-slate-300 font-medium leading-relaxed">
                  Selecciona tu comunidad o punto digital cercano para descargar las guías y videos de capacitación técnica adaptada al Sector Agropecuario directamente a tu teléfono.
                </p>
              </div>
            </div>

            {/* List of Puntos Digitales / Acceso Offline */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <MapPinIcon className="w-6 h-6 text-emerald-700" />
                  <h2 className="text-2xl font-black text-slate-900">
                    Puntos de Acceso Offline Disponibles ({puntos.length})
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {puntos.map((punto) => (
                  <div
                    key={punto.id}
                    className="card-farmer flex flex-col justify-between p-7"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                          {punto.zona}
                        </span>
                        <BuildingIcon className="w-5 h-5 text-slate-400" />
                      </div>

                      <h3 className="font-display text-2xl font-bold text-slate-900 leading-snug">
                        {punto.name}
                      </h3>

                      {punto.responsable && (
                        <p className="mt-2.5 text-sm text-slate-600 font-medium flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          Encargado: <span className="font-semibold text-slate-800">{punto.responsable}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100">
                      <Link
                        href={`/puntos/${punto.id}`}
                        className="btn-farmer-primary w-full text-center text-base"
                      >
                        <span>Ver Cursos Disponibles</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {puntos.length === 0 && (
                  <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                    <SignalIcon className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="mt-3 text-lg font-bold text-slate-900">Todavía no hay puntos de acceso registrados.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
