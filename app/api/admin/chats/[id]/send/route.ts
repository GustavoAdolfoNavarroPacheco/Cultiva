import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages } from "@/lib/db/schema";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const conversationId = Number(idParam);
  if (isNaN(conversationId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const [conversation] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.id, conversationId))
    .limit(1);

  if (!conversation) {
    return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 });
  }

  const body = await request.json();
  const { text } = body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "El mensaje no puede estar vacío" }, { status: 400 });
  }

  const textTrimmed = text.trim();

  // 1. Intentar enviar mensaje por Meta WhatsApp API si está configurado
  if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    const sendResult = await sendWhatsAppMessage(conversation.phone, textTrimmed);
    if (!sendResult.success) {
      console.warn("WhatsApp Cloud API aviso:", sendResult.error);
    }
  }

  // 2. Guardar mensaje enviado por el Admin en la BD
  const [createdMessage] = await db
    .insert(whatsappMessages)
    .values({
      conversationId,
      author: "ADMIN",
      type: "TEXTO",
      content: textTrimmed,
    })
    .returning();

  // 3. Actualizar timestamp de la conversación
  await db
    .update(whatsappConversations)
    .set({
      lastMessageAt: new Date(),
    })
    .where(eq(whatsappConversations.id, conversationId));

  return NextResponse.json({ success: true, message: createdMessage });
}
