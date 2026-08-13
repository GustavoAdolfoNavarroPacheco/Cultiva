import { desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages, agentIaConfig } from "@/lib/db/schema";
import { ChatIcon, CheckCircleIcon, SparklesIcon, ShieldCheckIcon } from "@/app/components/icons";

export const metadata = { title: "Bot WhatsApp + IA — Panel Administrativo KHC" };
export const dynamic = "force-dynamic";

export default async function AdminWhatsappPage() {
  const [[conversationsCount], [messagesCount], [agentConfig]] = await Promise.all([
    db.select({ value: count() }).from(whatsappConversations),
    db.select({ value: count() }).from(whatsappMessages),
    db.select().from(agentIaConfig).limit(1),
  ]);

  const recentConversations = await db
    .select()
    .from(whatsappConversations)
    .orderBy(desc(whatsappConversations.lastMessageAt))
    .limit(10);

  const hasWhatsappConfig = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
  const hasAiConfig = Boolean(process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY);

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <ChatIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Bot de WhatsApp con IA
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Estado de la integración de Meta WhatsApp Cloud API y servicio DeepSeek IA.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Meta Webhook Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Webhook Meta API
            </span>
            {hasWhatsappConfig ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircleIcon className="w-3.5 h-3.5" /> Configurado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                Pendiente de Token
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">URL de Callback Webhook:</p>
            <code className="mt-1 block overflow-x-auto rounded-lg bg-slate-900 p-2.5 text-xs text-emerald-400 font-mono">
              /api/whatsapp/webhook
            </code>
          </div>
        </div>

        {/* DeepSeek AI Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Motor de IA (DeepSeek)
            </span>
            {hasAiConfig ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <SparklesIcon className="w-3.5 h-3.5" /> Activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                Sin API Key
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Modelo Configurado:</p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {agentConfig?.modelo || process.env.DEEPSEEK_MODEL || "deepseek-v4-pro"}
            </p>
          </div>
        </div>

        {/* Metrics Summary Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interacciones Registradas
            </span>
            <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-slate-900">{conversationsCount.value}</p>
              <p className="text-xs text-slate-500">Conversaciones</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{messagesCount.value}</p>
              <p className="text-xs text-slate-500">Mensajes Totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Conversaciones Recientes ({recentConversations.length})
        </h2>

        {recentConversations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Modo</th>
                  <th className="px-4 py-3">Etapa</th>
                  <th className="px-4 py-3">Último Mensaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentConversations.map((conv) => (
                  <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{conv.phone}</td>
                    <td className="px-4 py-3">{conv.name || "Usuario"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {conv.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3">{conv.etapaActual}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(conv.lastMessageAt).toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80">
            <ChatIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-900">
              No hay conversaciones activas registradas por el Bot.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Cuando el webhook reciba mensajes desde la API de Meta WhatsApp Cloud, las interacciones se registrarán en esta tabla automáticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
