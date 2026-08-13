import { NextResponse } from "next/server";
import { eq, desc, and, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages, students, courses } from "@/lib/db/schema";
import {
  verifyWebhook,
  verifyWebhookSignature,
  parseIncomingMessage,
  sendWhatsAppMessage,
  markMessageAsRead,
} from "@/lib/whatsapp";
import { enviarMensaje, getAgentConfig } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/ai-prompts";
import { logger } from "@/lib/log";


// ─── Webhook: GET (Verificación de Meta) ───

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const verifyToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const result = verifyWebhook({ mode, verifyToken, challenge });

  if (result.verified && result.challenge) {
    return new NextResponse(result.challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verificación fallida" }, { status: 403 });
}

// ─── Webhook: POST (Mensajes entrantes) ───

export async function POST(request: Request) {
  const rawBody = await request.text();

  const signature = request.headers.get("x-hub-signature-256");
  if (!verifyWebhookSignature(rawBody, signature)) {
    logger.warn("WHATSAPP", "Firma inválida o ausente en webhook");
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    try {
      await processMessage(body);
      return NextResponse.json({ status: "ok" });
    } catch (processError) {
      logger.error("WHATSAPP", "Error procesando mensaje entrante", processError);
      return NextResponse.json({ status: "ok" });
    }
  } catch (error) {
    logger.error("WHATSAPP", "Error en POST del webhook", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ─── Procesamiento del mensaje entrante ───

async function processMessage(body: unknown) {
  const incoming = parseIncomingMessage(body);
  if (!incoming) return;

  const { waId, profileName, text, messageId, messageType, archivoUrl, archivoNombre, archivoMimeType } = incoming;
  const telefono = waId.startsWith("+") ? waId : `+${waId}`;

  // ── Evitar procesar mensajes duplicados ──
  const [yaProcesado] = await db
    .select()
    .from(whatsappMessages)
    .where(and(eq(whatsappMessages.type, "WHATSAPP_ID"), eq(whatsappMessages.content, messageId)))
    .limit(1);

  if (yaProcesado) return;

  await markMessageAsRead(messageId).catch(() => {});

  // ── Buscar o crear conversación ──
  const conversation = await findOrCreateConversation(telefono, profileName);

  // ── Guardar referencia del messageId para deduplicación ──
  await db.insert(whatsappMessages).values({
    conversationId: conversation.id,
    author: "SISTEMA",
    type: "WHATSAPP_ID",
    content: messageId,
  });

  // ── Guardar mensaje del usuario (soporta archivos) ──
  const esArchivo = ["image", "document", "audio", "video", "sticker"].includes(messageType);
  await db.insert(whatsappMessages).values({
    conversationId: conversation.id,
    author: "STUDENT",
    type: esArchivo ? "ARCHIVO" : "TEXTO",
    content: text || `[${messageType}]`,
    fileName: archivoNombre ?? null,
    fileUrl: archivoUrl ?? null,
    fileMimeType: archivoMimeType ?? null,
  });

  // ── Actualizar timestamp y conteo no leídos ──
  await db
    .update(whatsappConversations)
    .set({
      lastMessageAt: new Date(),
      unreadCount: conversation.unreadCount + 1,
    })
    .where(eq(whatsappConversations.id, conversation.id));

  // ── Generar respuesta con IA ──
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
    const agentConfig = await getAgentConfig();

    // ── Consultar información del estudiante en el LMS de KHC ──
    const rawPhone = telefono.replace(/^\+/, "");
    const [matchingStudent] = await db
      .select()
      .from(students)
      .where(sql`replace(${students.phone}, '+', '') = ${rawPhone}`)
      .limit(1);

    const studentName = matchingStudent?.name || conversation.name || profileName;

    // ── Consultar catálogo de cursos publicados en KHC ──
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

    const coursesContext = publishedCourses.length > 0
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
      { rol: "user" as const, contenido: text },
    ];


    const respuesta = await enviarMensaje(mensajesAI);

    let contenidoLimpio = respuesta.contenido
      .replace(/\[ETAPA:\s*\w+\s*\]/gi, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!contenidoLimpio) {
      contenidoLimpio = "Gracias por tu mensaje. ¿En qué más puedo ayudarte en KHC?";
    }

    // ── Guardar respuesta del agente ──
    await db.insert(whatsappMessages).values({
      conversationId: conversation.id,
      author: "AGENTE_IA",
      type: "TEXTO",
      content: contenidoLimpio,
    });

    // ── Enviar respuesta por WhatsApp ──
    const sendResult = await sendWhatsAppMessage(telefono, contenidoLimpio);
    if (!sendResult.success) {
      logger.error("WHATSAPP", `Error al enviar respuesta por WhatsApp: ${sendResult.error}`);
    }
  } catch (error) {
    logger.error("WHATSAPP", "Error procesando respuesta de IA", error);
    await sendWhatsAppMessage(
      telefono,
      "Hola, en este momento tenemos problemas técnicos temporales. Intenta de nuevo más tarde."
    ).catch(() => {});
  }
}

// ─── Buscar o crear conversación ───

async function findOrCreateConversation(phone: string, profileName: string) {
  const [existing] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.phone, phone))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(whatsappConversations)
    .values({
      phone,
      name: profileName,
      mode: "AGENTE_IA",
      etapaActual: "INICIO",
    })
    .returning();

  return created;
}
