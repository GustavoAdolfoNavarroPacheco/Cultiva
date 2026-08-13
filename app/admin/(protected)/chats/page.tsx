import { ChatsView } from "./ChatsView";

export const metadata = { title: "Chats en Vivo — Panel Administrativo KHC" };
export const dynamic = "force-dynamic";

export default function AdminChatsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Gestión de Chats en Vivo
        </h1>
        <p className="text-xs text-slate-500">
          Monitoreo e interacción en tiempo real con estudiantes vía WhatsApp y Agente IA.
        </p>
      </div>

      <ChatsView />
    </div>
  );
}
