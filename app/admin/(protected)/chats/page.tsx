import { ChatsView } from "./ChatsView";

export const metadata = { title: "Chats en Vivo — Panel Administrativo KHC" };
export const dynamic = "force-dynamic";

export default function AdminChatsPage() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="shrink-0">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Gestión de Chats en Vivo
        </h1>
        <p className="text-xs text-slate-500">
          Monitoreo e interacción en tiempo real con estudiantes vía WhatsApp y Agente IA.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatsView />
      </div>
    </div>
  );
}
