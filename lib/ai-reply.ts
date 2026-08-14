import { desc, eq, and, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages, students, courses } from "@/lib/db/schema";
import { enviarMensaje, getAgentConfig } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/ai-prompts";
import {
  sendWhatsAppMessage,
  sendButtonMessage,
  sendWhatsAppMediaFromLocalOrUrl,
} from "@/lib/whatsapp";
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
    const rawContent = respuesta.contenido;

    // 1. Extraer archivos PDF solicitados/adjuntos: [PDF: <url> | <titulo>] o [DOCUMENTO: ...]
    const pdfRegex = /\[(?:PDF|DOCUMENTO):\s*(.+?)\s*\|\s*(.+?)\s*\]/gi;
    const pdfMatches = [...rawContent.matchAll(pdfRegex)];

    // 2. Extraer videos MP4 solicitados/adjuntos: [VIDEO: <url> | <titulo>]
    const videoRegex = /\[VIDEO:\s*(.+?)\s*\|\s*(.+?)\s*\]/gi;
    const videoMatches = [...rawContent.matchAll(videoRegex)];

    // 3. Extraer botones interactivos: [BOTONES: <texto> | <opt1> | <opt2> | <opt3>] o [BUTTONS: ...] o [QUIZ: ...]
    const buttonsRegex = /\[(?:BOTONES|BUTTONS|QUIZ):\s*(.+?)\s*\|\s*(.+?)\s*\]/gi;
    const buttonsMatch = buttonsRegex.exec(rawContent);

    let cleanText = rawContent
      .replace(pdfRegex, "")
      .replace(videoRegex, "")
      .replace(buttonsRegex, "")
      .replace(/\[ETAPA:\s*\w+\s*\]/gi, "")
      .replace(/\[CURSO_COMPLETADO\]/gi, "")
      .replace(/\*\*(.*?)\*\*/g, "*$1*")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!cleanText && pdfMatches.length === 0 && videoMatches.length === 0 && !buttonsMatch) {
      cleanText = "Gracias por tu mensaje. ¿En qué más puedo orientarte en KHC Agro?";
    }

    // ── Enviar Botones Interactivos si existen ──
    if (buttonsMatch) {
      const buttonBody = buttonsMatch[1].trim() || cleanText || "¿Cómo deseas continuar?";
      const rawOptions = buttonsMatch[2]
        .split("|")
        .map((o) => o.trim())
        .filter(Boolean);

      const interactiveButtons = rawOptions.slice(0, 3).map((opt, idx) => ({
        id: `btn_${idx + 1}`,
        title: opt.slice(0, 20),
      }));

      // Guardar en BD para visualización en panel
      const dbText = `${buttonBody}\n\n${interactiveButtons.map((b) => `🔘 ${b.title}`).join("\n")}`;
      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "TEXTO",
        content: dbText,
      });

      const sendBtnResult = await sendButtonMessage(
        conversation.phone,
        buttonBody,
        interactiveButtons
      );
      if (!sendBtnResult.success) {
        logger.warn("WHATSAPP", `Fallo envío de botones interactivos: ${sendBtnResult.error}`);
        await sendWhatsAppMessage(conversation.phone, dbText);
      }
    } else if (cleanText) {
      // ── Enviar Mensaje de Texto Regular ──
      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "TEXTO",
        content: cleanText,
      });

      const sendResult = await sendWhatsAppMessage(conversation.phone, cleanText);
      if (!sendResult.success) {
        logger.error("WHATSAPP", `Error al enviar respuesta de IA: ${sendResult.error}`);
      }
    }

    // ── Enviar Documentos PDF por WhatsApp si fueron solicitados ──
    for (const match of pdfMatches) {
      const pdfUrl = match[1].trim();
      const pdfTitle = match[2].trim();
      const filename = pdfTitle.endsWith(".pdf") ? pdfTitle : `${pdfTitle}.pdf`;

      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "ARCHIVO",
        content: `📄 ${pdfTitle}`,
        fileName: filename,
        fileUrl: pdfUrl,
        fileMimeType: "application/pdf",
      });

      const mediaResult = await sendWhatsAppMediaFromLocalOrUrl(
        conversation.phone,
        "document",
        pdfUrl,
        {
          filename,
          caption: pdfTitle,
        }
      );

      if (!mediaResult.success) {
        logger.error("WHATSAPP", `Error enviando PDF (${pdfTitle}): ${mediaResult.error}`);
      }
    }

    // ── Enviar Videos MP4 por WhatsApp si fueron solicitados ──
    for (const match of videoMatches) {
      const videoUrl = match[1].trim();
      const videoTitle = match[2].trim();

      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "ARCHIVO",
        content: `🎬 ${videoTitle}`,
        fileName: `${videoTitle}.mp4`,
        fileUrl: videoUrl,
        fileMimeType: "video/mp4",
      });

      const videoResult = await sendWhatsAppMediaFromLocalOrUrl(
        conversation.phone,
        "video",
        videoUrl,
        {
          caption: videoTitle,
        }
      );

      if (!videoResult.success) {
        logger.error("WHATSAPP", `Error enviando video (${videoTitle}): ${videoResult.error}`);
      }
    }

    return { success: true };
  } catch (error) {
    logger.error("WHATSAPP", "Error generando respuesta de IA", error);
    return { success: false, error: String(error) };
  }
}
