/**
 * Utilidades para la integración con WhatsApp Cloud API (Meta).
 */

import { createHmac, timingSafeEqual } from "crypto";
import { logger } from "@/lib/log";

const GRAPH_API_VERSION = "v22.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// ─── Obtener credenciales ───

function getCredentials() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error(
      "WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID deben estar configurados en .env"
    );
  }

  return { token, phoneNumberId };
}

// ─── Descargar un media de WhatsApp (proxy) ───

export async function downloadWhatsAppMedia(
  mediaId: string
): Promise<{ buffer: ArrayBuffer; mimeType: string } | null> {
  try {
    const { token } = getCredentials();

    const mediaResponse = await fetch(`${GRAPH_API_BASE}/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!mediaResponse.ok) {
      logger.error("WHATSAPP", "Error obteniendo info del media", await mediaResponse.text());
      return null;
    }

    const mediaData: { url?: string; mime_type?: string } = await mediaResponse.json();
    const downloadUrl = mediaData.url;
    const mimeType = mediaData.mime_type ?? "application/octet-stream";

    if (!downloadUrl) {
      logger.error("WHATSAPP", "No se encontró URL de descarga");
      return null;
    }

    const fileResponse = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!fileResponse.ok) {
      logger.error("WHATSAPP", "Error descargando media", await fileResponse.text());
      return null;
    }

    const buffer = await fileResponse.arrayBuffer();
    return { buffer, mimeType };
  } catch (error) {
    logger.error("WHATSAPP", "Error en downloadWhatsAppMedia", error);
    return null;
  }
}

// ─── Enviar mensaje de texto ───

export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { token, phoneNumberId } = getCredentials();

    const response = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message ?? `Error HTTP ${response.status}`,
      };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ─── Enviar mensaje interactivo (lista de opciones) ───

export async function sendInteractiveListMessage(
  to: string,
  headerText: string,
  bodyText: string,
  buttonText: string,
  sections: {
    title: string;
    rows: { id: string; title: string; description?: string }[];
  }[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { token, phoneNumberId } = getCredentials();

    const response = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: headerText },
          body: { text: bodyText },
          action: {
            button: buttonText,
            sections,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message ?? `Error HTTP ${response.status}`,
      };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ─── Enviar mensaje con botones ───

export async function sendButtonMessage(
  to: string,
  bodyText: string,
  buttons: { id: string; title: string }[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { token, phoneNumberId } = getCredentials();

    const response = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: bodyText },
          action: {
            buttons: buttons.map((b) => ({
              type: "reply",
              reply: { id: b.id, title: b.title },
            })),
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message ?? `Error HTTP ${response.status}`,
      };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ─── Verificación del webhook (GET) ───

export function verifyWebhook(params: {
  mode: string | null;
  verifyToken: string | null;
  challenge: string | null;
}): { verified: boolean; challenge?: string } {
  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (
    params.mode === "subscribe" &&
    params.verifyToken &&
    expectedToken &&
    params.verifyToken === expectedToken
  ) {
    return { verified: true, challenge: params.challenge ?? undefined };
  }

  return { verified: false };
}

// ─── Verificación de firma del webhook (POST) ───

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !signatureHeader) return false;

  const expected = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;

  const hmac = createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const hmacBuf = Buffer.from(hmac, "hex");
  if (expectedBuf.length !== hmacBuf.length) return false;

  return timingSafeEqual(expectedBuf, hmacBuf);
}

// ─── Tipos de mensajes entrantes ───

export type WhatsAppIncomingMessage = {
  waId: string;
  profileName: string;
  messageId: string;
  messageType: string;
  text: string;
  timestamp: string;
  archivoUrl?: string;
  archivoNombre?: string;
  archivoMimeType?: string;
};

function extractFileData(
  msg: Record<string, unknown>
): { text: string; archivoUrl?: string; archivoNombre?: string; archivoMimeType?: string } {
  const msgType = (msg.type as string) ?? "text";

  if (msgType === "image") {
    const img = msg.image as Record<string, unknown> | undefined;
    return {
      text: (img?.caption as string) || "📷 Imagen",
      archivoUrl: img?.id as string | undefined,
      archivoNombre: "imagen",
      archivoMimeType: (img?.mime_type as string) || "image/jpeg",
    };
  }

  if (msgType === "document") {
    const doc = msg.document as Record<string, unknown> | undefined;
    return {
      text: (doc?.caption as string) || `📄 ${(doc?.filename as string) || "Documento"}`,
      archivoUrl: doc?.id as string | undefined,
      archivoNombre: doc?.filename as string | undefined,
      archivoMimeType: (doc?.mime_type as string) || "application/octet-stream",
    };
  }

  if (msgType === "audio") {
    const audio = msg.audio as Record<string, unknown> | undefined;
    return {
      text: "🎵 Audio",
      archivoUrl: audio?.id as string | undefined,
      archivoNombre: "audio",
      archivoMimeType: (audio?.mime_type as string) || "audio/ogg",
    };
  }

  if (msgType === "video") {
    const vid = msg.video as Record<string, unknown> | undefined;
    return {
      text: (vid?.caption as string) || "🎬 Video",
      archivoUrl: vid?.id as string | undefined,
      archivoNombre: "video",
      archivoMimeType: (vid?.mime_type as string) || "video/mp4",
    };
  }

  if (msgType === "sticker") {
    const sticker = msg.sticker as Record<string, unknown> | undefined;
    return {
      text: "😎 Sticker",
      archivoUrl: sticker?.id as string | undefined,
      archivoNombre: "sticker",
      archivoMimeType: (sticker?.mime_type as string) || "image/webp",
    };
  }

  if (msgType === "location") {
    const loc = msg.location as Record<string, unknown> | undefined;
    const lat = loc?.latitude ?? "";
    const lng = loc?.longitude ?? "";
    return { text: `📍 Ubicación: ${lat}, ${lng}` };
  }

  return { text: `[${msgType}]` };
}

// ─── Parsear mensaje entrante ───

export function parseIncomingMessage(
  body: unknown
): WhatsAppIncomingMessage | null {
  try {
    const payload = body as Record<string, unknown>;
    const entry = (payload?.entry as Record<string, unknown>[])?.[0];
    const change = (entry?.changes as Record<string, unknown>[])?.[0];
    const value = change?.value as Record<string, unknown> | undefined;

    if (!value) return null;

    const messages = value.messages as Record<string, unknown>[] | undefined;
    if (!messages || messages.length === 0) return null;

    const msg = messages[0];

    if (msg.type === "message_delivery" || msg.type === "message_read" || msg.status) {
      return null;
    }

    const contacts = value.contacts as Record<string, unknown>[] | undefined;
    const profile = contacts?.[0]?.profile as Record<string, unknown> | undefined;

    let text = "";
    let archivoUrl: string | undefined;
    let archivoNombre: string | undefined;
    let archivoMimeType: string | undefined;

    const msgType = (msg.type as string) ?? "text";
    if (msgType === "text") {
      text = ((msg.text as Record<string, unknown>)?.body as string) ?? "";
    } else if (msgType === "interactive") {
      const interactive = msg.interactive as Record<string, unknown> | undefined;
      if (interactive?.type === "button_reply") {
        text = ((interactive.button_reply as Record<string, unknown>)
          ?.title as string) ?? "";
      } else if (interactive?.type === "list_reply") {
        text = ((interactive.list_reply as Record<string, unknown>)
          ?.title as string) ?? "";
      }
    } else {
      const fileData = extractFileData(msg);
      text = fileData.text;
      archivoUrl = fileData.archivoUrl;
      archivoNombre = fileData.archivoNombre;
      archivoMimeType = fileData.archivoMimeType;
    }

    return {
      waId: (msg.from as string) ?? "",
      profileName: (profile?.name as string) ?? "Usuario",
      messageId: (msg.id as string) ?? "",
      messageType: msgType,
      text,
      timestamp: (msg.timestamp as string) ?? "",
      archivoUrl,
      archivoNombre,
      archivoMimeType,
    };
  } catch {
    return null;
  }
}

// ─── Subir un archivo a WhatsApp Cloud API ───

export async function uploadMediaToWhatsApp(
  fileBuffer: Buffer,
  mimeType: string,
  filename: string
): Promise<{ mediaId: string } | { error: string }> {
  try {
    const { token, phoneNumberId } = getCredentials();

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
    formData.append("file", blob, filename);
    formData.append("type", mimeType);
    formData.append("messaging_product", "whatsapp");

    const response = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error?.message ?? `Error HTTP ${response.status}` };
    }

    return { mediaId: data.id };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido al subir media",
    };
  }
}

// ─── Enviar mensaje con media ───

export async function sendWhatsAppMediaMessage(
  to: string,
  type: "image" | "document" | "audio" | "video",
  mediaId: string,
  options?: { filename?: string; caption?: string }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { token, phoneNumberId } = getCredentials();

    const mediaObject: Record<string, unknown> = {
      id: mediaId,
    };
    if (type === "document" && options?.filename) {
      mediaObject.filename = options.filename;
    }
    if (options?.caption) {
      mediaObject.caption = options.caption;
    }

    const response = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type,
        [type]: mediaObject,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message ?? `Error HTTP ${response.status}`,
      };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ─── Marcar mensaje como leído ───

export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    const { token, phoneNumberId } = getCredentials();

    await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
  } catch {
    // Silencioso
  }
}
