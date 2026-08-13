"use server";

import { asc, desc, eq, and, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  whatsappConversations,
  whatsappMessages,
  students,
  courses,
  lessons,
  whatsappSteps,
} from "@/lib/db/schema";
import { enviarMensaje, getAgentConfig } from "@/lib/ai";
import { buildCourseTutorPrompt, type CourseLessonContext, type CourseQuizContext } from "@/lib/ai-prompts";
import { logger } from "@/lib/log";

export type StudentChatMessage = {
  id: number;
  conversationId: number;
  author: "STUDENT" | "AGENTE_IA" | "ADMIN" | "SISTEMA";
  type: string;
  content: string;
  fileName: string | null;
  fileUrl: string | null;
  fileMimeType: string | null;
  createdAt: Date;
};

// ─── Obtener o Crear Conversación del Estudiante para el Curso ───

export async function getOrCreateStudentConversation(
  courseId: number,
  options?: {
    studentId?: number | null;
    studentName?: string | null;
    studentPhone?: string | null;
  }
) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course) {
    throw new Error("Curso no encontrado");
  }

  let student = null;
  if (options?.studentId) {
    const [found] = await db
      .select()
      .from(students)
      .where(eq(students.id, options.studentId))
      .limit(1);
    student = found ?? null;
  }

  const phone =
    student?.phone ||
    options?.studentPhone ||
    `+57300${String(options?.studentId || 1000 + courseId).padStart(7, "0")}`;
  const name = student?.name || options?.studentName || "Estudiante Agro";

  // Buscar conversación existente por teléfono o studentId
  let [conversation] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.phone, phone))
    .limit(1);

  if (!conversation) {
    [conversation] = await db
      .insert(whatsappConversations)
      .values({
        phone,
        name,
        studentId: student?.id ?? null,
        mode: "AGENTE_IA",
        etapaActual: `CURSO_${course.id}`,
        unreadCount: 0,
      })
      .returning();
  } else if (!conversation.studentId && student?.id) {
    await db
      .update(whatsappConversations)
      .set({ studentId: student.id, name })
      .where(eq(whatsappConversations.id, conversation.id));
  }

  // Cargar mensajes existentes
  let messages = await db
    .select()
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.conversationId, conversation.id),
        ne(whatsappMessages.type, "WHATSAPP_ID")
      )
    )
    .orderBy(asc(whatsappMessages.createdAt));

  // Si no hay mensajes, enviar el MENSAJE AUTOMÁTICO INICIAL para empezar el curso
  if (messages.length === 0) {
    const primerNombre = name.split(" ")[0] || "Estudiante";
    const welcomeText = `¡Hola ${primerNombre}! 🌾 Bienvenido(a) al curso *${course.title}*.\n\nSoy tu tutor inteligente de la Plataforma Educativa Agro. Te acompañaré durante este curso explicando cada lección paso a paso, compartiéndote guías en PDF y realizándote preguntas rápidas (quizzes) para evaluar tu aprendizaje.\n\n¿Estás listo(a) para comenzar la primera lección? 🚀`;

    const [welcomeMessage] = await db
      .insert(whatsappMessages)
      .values({
        conversationId: conversation.id,
        author: "AGENTE_IA",
        type: "TEXTO",
        content: welcomeText,
      })
      .returning();

    messages = [welcomeMessage as StudentChatMessage];
  }

  return {
    conversation,
    messages: messages as StudentChatMessage[],
    course,
  };
}

// ─── Enviar Mensaje del Estudiante y Generar Respuesta del Bot IA ───

export async function sendStudentMessage(
  conversationId: number,
  courseId: number,
  content: string,
  studentId?: number | null
) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("El mensaje no puede estar vacío");

  const [conversation] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.id, conversationId))
    .limit(1);

  if (!conversation) throw new Error("Conversación no encontrada");

  // 1. Guardar mensaje del estudiante
  const [studentMessage] = await db
    .insert(whatsappMessages)
    .values({
      conversationId,
      author: "STUDENT",
      type: "TEXTO",
      content: trimmed,
    })
    .returning();

  await db
    .update(whatsappConversations)
    .set({
      lastMessageAt: new Date(),
    })
    .where(eq(whatsappConversations.id, conversationId));

  // 2. Si la conversación está en modo MANUAL, el bot no responde (responderá el admin)
  if (conversation.mode === "MANUAL") {
    const allMessages = await db
      .select()
      .from(whatsappMessages)
      .where(
        and(
          eq(whatsappMessages.conversationId, conversationId),
          ne(whatsappMessages.type, "WHATSAPP_ID")
        )
      )
      .orderBy(asc(whatsappMessages.createdAt));

    return {
      success: true,
      messages: allMessages as StudentChatMessage[],
    };
  }

  // 3. Cargar contexto del curso (Lecciones y Pasos/Quizzes)
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.order));

  const courseSteps = await db
    .select()
    .from(whatsappSteps)
    .where(eq(whatsappSteps.courseId, courseId))
    .orderBy(asc(whatsappSteps.order));

  const lessonContexts: CourseLessonContext[] = courseLessons.map((l) => ({
    id: l.id,
    order: l.order,
    title: l.title,
    summary: l.summary,
    videoUrl: l.videoUrl,
    pdfUrl: l.pdfUrl,
  }));

  const quizContexts: CourseQuizContext[] = courseSteps
    .filter((s) => s.kind === "question" && s.question && s.options)
    .map((s) => ({
      id: s.id,
      order: s.order,
      question: s.question!,
      options: (s.options as string[]) || [],
      correctOptionIndex: s.correctOptionIndex ?? 0,
      lessonId: s.lessonId,
    }));

  // 4. Obtener historial reciente para el prompt
  const recentMessages = await db
    .select()
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.conversationId, conversationId),
        ne(whatsappMessages.type, "WHATSAPP_ID")
      )
    )
    .orderBy(desc(whatsappMessages.createdAt))
    .limit(15);

  const history = recentMessages.reverse();

  let aiReplyText = "";

  try {
    const agentConfig = await getAgentConfig();
    const studentName = conversation.name || "Estudiante";

    const systemPrompt = buildCourseTutorPrompt({
      nombre: agentConfig.nombre || "Tutor Agro IA",
      tono: agentConfig.tono || "EMPRENDEDOR",
      studentName,
      courseTitle: course?.title || "Curso Agropecuario",
      courseCategory: course?.category || undefined,
      courseDescription: course?.description || undefined,
      lessons: lessonContexts,
      quizzes: quizContexts,
      instrucciones: agentConfig.systemPrompt,
    });

    const aiMessages = [
      { rol: "system" as const, contenido: systemPrompt },
      ...history.map((m) => ({
        rol: (m.author === "STUDENT" ? "user" : "assistant") as "user" | "assistant",
        contenido: m.content,
      })),
    ];

    const aiResult = await enviarMensaje(aiMessages);
    aiReplyText = aiResult.contenido;
  } catch (err) {
    logger.warn("IA", "Fallo llamada al modelo de IA, usando motor fallback pedagógico", err);
    aiReplyText = generateFallbackCourseReply(
      trimmed,
      history.map((h) => h.content),
      course,
      lessonContexts,
      quizContexts,
      conversation.name || "Estudiante"
    );
  }

  // Limpieza de formato
  let cleanedReply = aiReplyText
    .replace(/\*\*(.*?)\*\*/g, "*$1*")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanedReply) {
    cleanedReply = "¡Excelente pregunta! Sigamos profundizando en el tema. ¿Tienes alguna otra duda o avanzamos al quiz?";
  }

  // 5. Guardar respuesta del Bot IA
  await db.insert(whatsappMessages).values({
    conversationId,
    author: "AGENTE_IA",
    type: "TEXTO",
    content: cleanedReply,
  });

  await db
    .update(whatsappConversations)
    .set({
      lastMessageAt: new Date(),
    })
    .where(eq(whatsappConversations.id, conversationId));

  // 6. Devolver todos los mensajes actualizados
  const allMessages = await db
    .select()
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.conversationId, conversationId),
        ne(whatsappMessages.type, "WHATSAPP_ID")
      )
    )
    .orderBy(asc(whatsappMessages.createdAt));

  return {
    success: true,
    messages: allMessages as StudentChatMessage[],
  };
}

// ─── Obtener Mensajes en Tiempo Real ───

export async function getCourseChatMessages(conversationId: number) {
  const [conversation] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.id, conversationId))
    .limit(1);

  if (!conversation) throw new Error("Conversación no encontrada");

  const messages = await db
    .select()
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.conversationId, conversationId),
        ne(whatsappMessages.type, "WHATSAPP_ID")
      )
    )
    .orderBy(asc(whatsappMessages.createdAt));

  return {
    conversation,
    messages: messages as StudentChatMessage[],
  };
}

// ─── Reiniciar Conversación del Curso ───

export async function resetStudentConversation(
  conversationId: number,
  courseId: number
) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  const [conversation] = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.id, conversationId))
    .limit(1);

  if (!conversation) throw new Error("Conversación no encontrada");

  // Eliminar mensajes anteriores
  await db
    .delete(whatsappMessages)
    .where(eq(whatsappMessages.conversationId, conversationId));

  // Generar nuevo mensaje de bienvenida
  const primerNombre = conversation.name?.split(" ")[0] || "Estudiante";
  const welcomeText = `¡Hola ${primerNombre}! 🌾 Bienvenido(a) nuevamente al curso *${course?.title || "Agro"}*.\n\nHe reiniciado nuestro recorrido. Estoy listo para acompañarte paso a paso en las lecciones y actividades prácticas.\n\n¿Comenzamos con la primera lección? 🚀`;

  const [welcomeMessage] = await db
    .insert(whatsappMessages)
    .values({
      conversationId,
      author: "AGENTE_IA",
      type: "TEXTO",
      content: welcomeText,
    })
    .returning();

  return {
    conversation,
    messages: [welcomeMessage as StudentChatMessage],
  };
}

// ─── Motor de Respuestas Pedagógicas Fallback (Garantiza funcionamiento siempre) ───

function generateFallbackCourseReply(
  userText: string,
  recentHistory: string[],
  course: any,
  lessons: CourseLessonContext[],
  quizzes: CourseQuizContext[],
  studentName: string
): string {
  const lower = userText.toLowerCase().trim();
  const primerNombre = studentName.split(" ")[0] || "Estudiante";
  const pdfUrl = lessons[0]?.pdfUrl || "/guias/guia-buenas-practicas-agroindustria.pdf";

  // 1. Si el usuario quiere empezar / continuar
  if (
    lower.includes("listo") ||
    lower.includes("comenz") ||
    lower.includes("empez") ||
    lower.includes("si") ||
    lower.includes("iniciar") ||
    lower.includes("leccion 1") ||
    lower.includes("lección 1")
  ) {
    const l1 = lessons[0];
    const l1Title = l1?.title || "Preparación y Manejo";
    const l1Summary = l1?.summary || "El primer paso fundamental es el análisis y preparación adecuada del suelo antes de la siembra.";
    const q1 = quizzes[0];

    let reply = `¡Excelente, ${primerNombre}! 🚜 Empecemos con la *Lección 1: ${l1Title}*.\n\n${l1Summary}\n\nAquí tienes el material oficial de estudio para complementar este módulo:\n[PDF: ${pdfUrl} | Guía Técnica: ${l1Title}]\n\nUna vez revisado, pongamos a prueba lo aprendido:`;

    if (q1) {
      reply += `\n\n[QUIZ: ${q1.question} | ${q1.options.join(" | ")}]`;
    } else {
      reply += `\n\n¿Qué dudas tienes sobre esta primera lección o pasamos a la siguiente?`;
    }

    return reply;
  }

  // 2. Si el usuario pide el PDF o material
  if (lower.includes("pdf") || lower.includes("guia") || lower.includes("guía") || lower.includes("material") || lower.includes("descargar")) {
    return `¡Por supuesto, ${primerNombre}! 📚 Aquí tienes la guía completa del curso en formato PDF:\n\n[PDF: ${pdfUrl} | Guía Oficial: ${course?.title || "Manual Técnico"}]\n\nPuedes previsualizarla directamente en pantalla o descargarla en tu dispositivo. ¿Deseas hacer una pregunta sobre el contenido o tomar un quiz? 😊`;
  }

  // 3. Si el usuario responde a un Quiz
  for (const q of quizzes) {
    const matchedOption = q.options.find((opt) => lower.includes(opt.toLowerCase()));
    if (matchedOption) {
      const correctOpt = q.options[q.correctOptionIndex];
      const isCorrect = matchedOption.toLowerCase() === correctOpt?.toLowerCase();

      if (isCorrect) {
        // Encontrar siguiente lección
        const nextLesson = lessons[1] || lessons[0];
        const q2 = quizzes[1];

        let res = `¡Respuesta Correcta, ${primerNombre}! 🎉👏 *${correctOpt}* es fundamental para garantizar el rendimiento óptimo del cultivo.\n\nPasemos a la *Lección 2: ${nextLesson.title}*.\n${nextLesson.summary || "En este módulo aprenderemos técnicas clave de control y conservación."}`;

        if (q2) {
          res += `\n\n[QUIZ: ${q2.question} | ${q2.options.join(" | ")}]`;
        } else {
          res += `\n\n¡Has avanzado de forma excelente en el curso! ¿Listo(a) para el resumen final? 🌾`;
        }
        return res;
      } else {
        return `Buen intento, ${primerNombre}, pero no es la opción más adecuada. 😊\nLa respuesta correcta es *${correctOpt}*.\n\nRecuerda revisar la guía técnica para profundizar en este concepto:\n[PDF: ${pdfUrl} | Repasar Guía en PDF]\n\n¿Quieres intentar otra pregunta o continuar con la siguiente lección?`;
      }
    }
  }

  // 4. Si el usuario pregunta por temario o cursos
  if (lower.includes("temario") || lower.includes("lecciones") || lower.includes("que aprender") || lower.includes("qué aprender")) {
    const list = lessons.map((l) => `🌱 *Lección ${l.order}:* ${l.title}`).join("\n");
    return `El curso *${course?.title || "Capacitación"}* está estructurado en las siguientes lecciones prácticas:\n\n${list}\n\n¿Por cuál lección te gustaría comenzar o continuar? 🚀`;
  }

  // 5. Si el usuario finaliza o agradece
  if (lower.includes("gracias") || lower.includes("terminar") || lower.includes("finalizar") || lower.includes("listo todo")) {
    return `¡Felicidades, ${primerNombre}! 🏆 Has completado satisfactoriamente los módulos y evaluaciones del curso *${course?.title || "Buenas Prácticas"}*.\n\n¡Gran dedicación para transformar el campo con conocimiento y buenas prácticas!\n\n[CURSO_COMPLETADO]\n\n¡Que estés muy bien y sigamos aprendiendo juntos! 🚜🌱`;
  }

  // 6. Respuesta amigable por defecto orientando al curso
  return `¡Te escucho atentamente, ${primerNombre}! 😊 En este curso de *${course?.title || "Agro"}* estamos viendo buenas prácticas, preparación y manejo técnico.\n\nPuedes pedirme:\n1. 📖 *Empezar lección 1*\n2. 📄 *Descargar Guía en PDF*\n3. ✍️ *Hacer quiz de evaluación*\n\n¿Cómo te gustaría continuar hoy? 🚀`;
}
