import OpenAI from "openai";
import { db } from "@/lib/db";
import { agentIaConfig } from "@/lib/db/schema";
import { logger } from "@/lib/log";
import { SCORE_PROMPT } from "@/lib/ai-prompts";

// ─── Singleton del cliente DeepSeek / OpenAI ───

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    const baseURL = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";

    if (!apiKey) {
      throw new Error(
        "DEEPSEEK_API_KEY o OPENAI_API_KEY no está configurada en las variables de entorno."
      );
    }

    _client = new OpenAI({
      apiKey,
      baseURL,
    });
  }
  return _client;
}

// ─── Tipos ───

export type MensajeConversacion = {
  rol: "system" | "user" | "assistant";
  contenido: string;
};

export type AIResponse = {
  contenido: string;
  tokensUsados: number;
};

// ─── Obtener configuración del agente desde DB ───

export async function getAgentConfig() {
  try {
    const [existing] = await db.select().from(agentIaConfig).limit(1);
    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(agentIaConfig)
      .values({
        nombre: "KHC Bot",
        tono: "PROFESIONAL",
        modelo: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
        maxTokens: 2048,
        temperatura: "0.7",
        systemPrompt: "Eres el asistente virtual de la plataforma educativa KHC.",
      })
      .returning();

    return created;
  } catch (error) {
    logger.warn("IA", "No se pudo consultar agentIaConfig en DB, usando defaults", error);
    return {
      nombre: "KHC Bot",
      tono: "PROFESIONAL",
      modelo: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
      maxTokens: 2048,
      temperatura: "0.7",
      systemPrompt: "Eres el asistente virtual de la plataforma educativa KHC.",
    };
  }
}

// ─── Función principal para enviar mensajes a la IA ───

export async function enviarMensaje(
  mensajes: MensajeConversacion[],
  options?: {
    temperatura?: number;
    maxTokens?: number;
  }
): Promise<AIResponse> {
  const client = getClient();
  const config = await getAgentConfig();

  const model = config.modelo || process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";
  const temperatura = options?.temperatura ?? parseFloat(config.temperatura || "0.7");
  const maxTokens = options?.maxTokens ?? config.maxTokens ?? 2048;

  const completion = await client.chat.completions.create({
    model,
    messages: mensajes.map((m) => ({
      role: m.rol,
      content: m.contenido,
    })),
    temperature: temperatura,
    max_tokens: maxTokens,
  });

  const choice = completion.choices[0];
  const contenido = choice?.message?.content ?? "";

  return {
    contenido,
    tokensUsados: completion.usage?.total_tokens ?? 0,
  };
}

// ─── Generar respuesta estructurada con historial ───

export async function generarRespuestaIA(params: {
  systemPrompt: string;
  historial: { autor: string; contenido: string }[];
  mensajeUsuario: string;
}): Promise<AIResponse> {
  const mensajes: MensajeConversacion[] = [
    { rol: "system", contenido: params.systemPrompt },
    ...params.historial.map((m) => ({
      rol: (m.autor === "STUDENT" || m.autor === "CANDIDATO" ? "user" : "assistant") as "user" | "assistant",
      contenido: m.contenido,
    })),
    { rol: "user", contenido: params.mensajeUsuario },
  ];

  return enviarMensaje(mensajes);
}

// ─── Generar score de usuario / estudiante ───

export async function generarScoreUsuario(params: {
  nombre: string;
  resumenConversacion: string;
}): Promise<{ score: number; razon: string }> {
  const prompt = `Evalúa la interacción del usuario:
Nombre: ${params.nombre}

Resumen de la conversación:
${params.resumenConversacion.slice(0, 1000)}

${SCORE_PROMPT}`;

  const result = await enviarMensaje([
    {
      rol: "system",
      contenido: "Eres un evaluador de interacciones de usuario en KHC.",
    },
    { rol: "user", contenido: prompt },
  ], { temperatura: 0.3, maxTokens: 600 });

  return parseScoreResult(result.contenido);
}

function parseScoreResult(texto: string): { score: number; razon: string } {
  const scoreMatch =
    texto.match(/SCORE\s*[:\-]?\**\s*(\d{1,3})/i) ??
    texto.match(/(\d{1,3})\s*\/\s*100/) ??
    texto.match(/(?:^|[^\d])([5-9]\d|100)(?:\D|$)/);

  const razonMatch = texto.match(/RAZON\s*[:\-]?\**\s*(.+?)(?:\n|$)/i);

  if (!scoreMatch) {
    const anyNumber = texto.match(/(\d{2,3})/);
    if (anyNumber) {
      const n = parseInt(anyNumber[1], 10);
      if (n >= 0 && n <= 100) {
        return { score: n, razon: razonMatch?.[1]?.trim() ?? "Sin justificación" };
      }
    }

    return { score: 70, razon: "Score genérico de interacción" };
  }

  const score = Math.max(0, Math.min(100, parseInt(scoreMatch[1], 10)));
  return {
    score,
    razon: razonMatch?.[1]?.trim() ?? "Sin justificación",
  };
}

export function resetClient() {
  _client = null;
}
