import { desc, eq, and, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages, students, courses } from "@/lib/db/schema";
import { enviarMensaje, getAgentConfig } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/ai-prompts";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { logger } from "@/lib/log";

// ─── Genera una respuesta de IA para una conversación y la envía por WhatsApp ───

export async function generateAndSendAiReply(
  conversationId: number
): Promise<{ success: boolean; error?: string }> {
  const [conversation] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.id, conversationId))
    .limit(1);

  if (!conversation) {
    return { success: false, error: "Conversación no encontrada" };
  }

  try {
    const historialDesc = await db
      .select()
      .from(whatsappMessages)
      .where(
        and(
          eq(whatsappMessages.conversationId, conversation.id),
          ne(whatsappMessages.type, "WHATSAPP_ID")
        )
      )
      .orderBy(desc(whatsappMessages.createdAt))
      .limit(30);

    const historial = historialDesc.reverse();
    if (historial.length === 0) {
      return { success: false, error: "Sin historial de mensajes" };
    }

    const agentConfig = await getAgentConfig();

    const rawPhone = conversation.phone.replace(/^\+/, "");
    const [matchingStudent] = await db
      .select()
      .from(students)
      .where(sql`replace(${students.phone}, '+', '') = ${rawPhone}`)
      .limit(1);

    const studentName = matchingStudent?.name || conversation.name || "Estudiante";

    const publishedCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        category: courses.category,
        description: courses.description,
      })
      .from(courses)
      .where(eq(courses.published, true))
      .limit(10);

    const coursesContext =
      publishedCourses.length > 0
        ? publishedCourses
            .map((c) => `- ${c.title} (${c.category || "Agro"})${c.description ? `: ${c.description}` : ""}`)
            .join("\n")
        : "- Cursos de Agroindustria, Innovación Agropecuaria, Manejo de Suelos y Tecnología Agrícola.";

    const systemPrompt = buildSystemPrompt({
      nombre: agentConfig.nombre || "KHC Bot Agro",
      tono: agentConfig.tono || "EMPRENDEDOR",
      instrucciones: agentConfig.systemPrompt,
      studentName,
      coursesContext,
    });

    const mensajesAI = [
      { rol: "system" as const, contenido: systemPrompt },
      ...historial.map((m) => ({
        rol: (m.author === "STUDENT" ? "user" : "assistant") as "user" | "assistant",
        contenido: m.content,
      })),
    ];

    const respuesta = await enviarMensaje(mensajesAI);

    let contenidoLimpio = respuesta.contenido
      .replace(/\[ETAPA:\s*\w+\s*\]/gi, "")
      .replace(/\*\*(.*?)\*\*/g, "*$1*")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!contenidoLimpio) {
      contenidoLimpio = "Gracias por tu mensaje. ¿En qué más puedo ayudarte en KHC?";
    }

    await db.insert(whatsappMessages).values({
      conversationId: conversation.id,
      author: "AGENTE_IA",
      type: "TEXTO",
      content: contenidoLimpio,
    });

    const sendResult = await sendWhatsAppMessage(conversation.phone, contenidoLimpio);
    if (!sendResult.success) {
      logger.error("WHATSAPP", `Error al enviar respuesta de IA: ${sendResult.error}`);
      return { success: false, error: sendResult.error };
    }

    return { success: true };
  } catch (error) {
    logger.error("WHATSAPP", "Error generando respuesta de IA", error);
    return { success: false, error: String(error) };
  }
}
