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
    const buttonsRegex = /\[(?:BOTONES|BUTTONS|QUIZ):\s*([\s\S]+?)\s*\|\s*([\s\S]+?)\s*\]/i;
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

    // 4. Auto-detección de botones en preguntas/quizzes (si la IA no usó la etiqueta [BOTONES:...])
    let autoButtons: { id: string; title: string }[] | null = null;
    let autoBodyText = cleanText;

    if (!buttonsMatch && pdfMatches.length === 0 && videoMatches.length === 0) {
      // Detectar si el texto contiene opciones tipo "A) ...", "B) ...", "C) ..."
      const optionLinesRegex = /(?:^|\n)\s*([A-C\d][\)\.\-]\s*[^\n]+)/g;
      const foundOptions = [...cleanText.matchAll(optionLinesRegex)].map((m) => m[1].trim());

      if (foundOptions.length >= 2 && foundOptions.length <= 3) {
        autoButtons = foundOptions.map((opt, idx) => ({
          id: `btn_${idx + 1}`,
          title: opt.slice(0, 20),
        }));

        const firstOptIndex = cleanText.indexOf(foundOptions[0]);
        if (firstOptIndex > 0) {
          autoBodyText = cleanText.substring(0, firstOptIndex).trim();
        }
      }
    }

    // ── DISPATCHING UNIFICADO (1 SOLO MENSAJE POR RESPUESTA) ──

    // ── CASO A: Envío de Video MP4 (Video + Texto en un solo mensaje con caption) ──
    if (videoMatches.length > 0) {
      const firstVideo = videoMatches[0];
      const videoUrl = firstVideo[1].trim();
      const videoTitle = firstVideo[2].trim();

      const captionText = cleanText
        ? cleanText.slice(0, 1024)
        : `🎬 ${videoTitle}`.slice(0, 1024);

      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "ARCHIVO",
        content: captionText,
        fileName: `${videoTitle}.mp4`,
        fileUrl: videoUrl,
        fileMimeType: "video/mp4",
      });

      const videoResult = await sendWhatsAppMediaFromLocalOrUrl(
        conversation.phone,
        "video",
        videoUrl,
        {
          caption: captionText,
        }
      );

      if (!videoResult.success) {
        logger.error("WHATSAPP", `Error enviando video (${videoTitle}): ${videoResult.error}`);
        await sendWhatsAppMessage(conversation.phone, captionText);
      }
      return { success: true };
    }

    // ── CASO B: Envío de Documento PDF (PDF + Texto en un solo mensaje con caption) ──
    if (pdfMatches.length > 0) {
      const firstPdf = pdfMatches[0];
      const pdfUrl = firstPdf[1].trim();
      const pdfTitle = firstPdf[2].trim();
      const filename = pdfTitle.endsWith(".pdf") ? pdfTitle : `${pdfTitle}.pdf`;

      const captionText = cleanText
        ? cleanText.slice(0, 1024)
        : `📄 ${pdfTitle}`.slice(0, 1024);

      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "ARCHIVO",
        content: captionText,
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
          caption: captionText,
        }
      );

      if (!mediaResult.success) {
        logger.error("WHATSAPP", `Error enviando PDF (${pdfTitle}): ${mediaResult.error}`);
        await sendWhatsAppMessage(conversation.phone, captionText);
      }
      return { success: true };
    }

    // ── CASO C: Envío de Botones Interactivos (Etiqueta explícita o Auto-detectado) ──
    if (buttonsMatch || autoButtons) {
      let buttonBody = "";
      let interactiveButtons: { id: string; title: string }[] = [];

      if (buttonsMatch) {
        buttonBody = buttonsMatch[1].trim() || cleanText || "¿Cómo deseas continuar?";
        const rawOptions = buttonsMatch[2]
          .split("|")
          .map((o) => o.trim())
          .filter(Boolean);

        interactiveButtons = rawOptions.slice(0, 3).map((opt, idx) => ({
          id: `btn_${idx + 1}`,
          title: opt.slice(0, 20),
        }));
      } else if (autoButtons) {
        buttonBody = autoBodyText || cleanText;
        interactiveButtons = autoButtons;
      }

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

      return { success: true };
    }

    // ── CASO D: Envío de Mensaje de Texto Normal (1 Solo Mensaje) ──
    if (!cleanText) {
      cleanText = "Gracias por tu mensaje. ¿En qué más puedo orientarte en KHC Agro?";
    }

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

    return { success: true };
  } catch (error) {
    logger.error("WHATSAPP", "Error generando respuesta de IA", error);
    return { success: false, error: String(error) };
  }
}
