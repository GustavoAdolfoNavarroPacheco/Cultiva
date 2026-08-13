"use server";

import { revalidatePath } from "next/cache";
import { asc, desc, eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  students,
  courses,
  lessons,
  whatsappSteps,
  chatSessions,
  whatsappConversations,
  whatsappMessages,
  type ChatAnswer,
} from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { normalizePhone, phoneRegex } from "@/lib/utils/phone";
import { getCurrentUser } from "@/lib/auth/current-user";

export type StudentCourseProgress = {
  courseId: number;
  courseTitle: string;
  courseCategory: string | null;
  progressPercentage: number;
  status: "COMPLETADO" | "EN_PROGRESO" | "NO_INICIADO";
  totalSteps: number;
  currentStepOrder: number;
  correctAnswers: number;
  totalAnswers: number;
};

export type StudentWithStats = {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  overallCompletionPercentage: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  totalPublishedCourses: number;
  totalQuizQuestionsAnswered: number;
  correctQuizQuestions: number;
  accuracyPercentage: number;
  coursesProgress: StudentCourseProgress[];
};

export async function getStudentsWithStats(): Promise<StudentWithStats[]> {
  // 1. Cargar todos los cursos publicados
  const publishedCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      category: courses.category,
    })
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(asc(courses.id));

  const totalPublished = publishedCourses.length;

  // 2. Cargar todos los pasos de WhatsApp para calcular el total de pasos por curso
  const allSteps = await db
    .select({
      id: whatsappSteps.id,
      courseId: whatsappSteps.courseId,
      order: whatsappSteps.order,
      kind: whatsappSteps.kind,
      correctOptionIndex: whatsappSteps.correctOptionIndex,
    })
    .from(whatsappSteps)
    .orderBy(asc(whatsappSteps.order));

  // Mapa de total de pasos máximos por curso
  const maxStepsByCourse: Record<number, number> = {};
  const totalQuizStepsByCourse: Record<number, number> = {};

  for (const step of allSteps) {
    maxStepsByCourse[step.courseId] = Math.max(
      maxStepsByCourse[step.courseId] || 0,
      step.order
    );
    if (step.kind === "question") {
      totalQuizStepsByCourse[step.courseId] =
        (totalQuizStepsByCourse[step.courseId] || 0) + 1;
    }
  }

  // 3. Cargar todos los estudiantes
  const allStudents = await db
    .select()
    .from(students)
    .orderBy(desc(students.createdAt));

  if (allStudents.length === 0) {
    return [];
  }

  // 4. Cargar todas las sesiones de chat y conversaciones
  const allSessions = await db.select().from(chatSessions);
  const allConversations = await db.select().from(whatsappConversations);
  const allMessages = await db.select().from(whatsappMessages);

  // Mapear sesiones por estudiante y curso
  const sessionsByStudentCourse: Record<string, typeof allSessions[0]> = {};
  for (const s of allSessions) {
    if (s.studentId) {
      sessionsByStudentCourse[`${s.studentId}_${s.courseId}`] = s;
    }
  }

  // Mapear conversaciones por studentId o teléfono
  const convsByStudent: Record<number, typeof allConversations[0]> = {};
  for (const c of allConversations) {
    if (c.studentId) {
      convsByStudent[c.studentId] = c;
    } else {
      const rawPhone = c.phone.replace(/^\+/, "");
      const matched = allStudents.find((st) => st.phone.replace(/^\+/, "") === rawPhone);
      if (matched) {
        convsByStudent[matched.id] = c;
      }
    }
  }

  // Mensajes por conversación
  const messagesByConv: Record<number, typeof allMessages> = {};
  for (const m of allMessages) {
    if (!messagesByConv[m.conversationId]) {
      messagesByConv[m.conversationId] = [];
    }
    messagesByConv[m.conversationId].push(m);
  }

  // 5. Calcular estadísticas precisas por cada estudiante
  const result: StudentWithStats[] = allStudents.map((student) => {
    let sumRatios = 0;
    let completedCoursesCount = 0;
    let inProgressCoursesCount = 0;
    let totalQuizAnswered = 0;
    let totalQuizCorrect = 0;

    const studentConv = convsByStudent[student.id];
    const studentMessages = studentConv ? messagesByConv[studentConv.id] || [] : [];

    // Verificar si el chatbot en mensajes completó algún curso
    const completedCourseIdsInChat = new Set<number>();
    const hasGlobalCompletionMessage = studentMessages.some(
      (m) =>
        m.author === "AGENTE_IA" &&
        (m.content.includes("[CURSO_COMPLETADO]") ||
          m.content.toLowerCase().includes("has completado satisfactoriamente"))
    );

    const coursesProgress: StudentCourseProgress[] = publishedCourses.map((c) => {
      const session = sessionsByStudentCourse[`${student.id}_${c.id}`];
      const maxSteps = maxStepsByCourse[c.id] || 3;

      let isCompleted = false;
      let stepOrder = 0;
      let correctAnswers = 0;
      let totalAnswers = 0;

      if (session) {
        stepOrder = session.currentStepOrder;
        isCompleted = session.completed;
        const answers = (session.answers as ChatAnswer[]) || [];
        totalAnswers = answers.length;
        correctAnswers = answers.filter((a) => a.correct).length;
      }

      // Si en la conversación de WhatsApp con el bot se completó el curso
      if (hasGlobalCompletionMessage && publishedCourses.length === 1) {
        isCompleted = true;
        stepOrder = maxSteps;
      }

      let ratio = 0;
      let status: "COMPLETADO" | "EN_PROGRESO" | "NO_INICIADO" = "NO_INICIADO";

      if (isCompleted) {
        ratio = 1.0;
        status = "COMPLETADO";
        completedCoursesCount++;
      } else if (stepOrder > 0) {
        ratio = Math.min(0.99, Number((stepOrder / maxSteps).toFixed(3)));
        status = "EN_PROGRESO";
        inProgressCoursesCount++;
      } else {
        ratio = 0;
        status = "NO_INICIADO";
      }

      sumRatios += ratio;
      totalQuizAnswered += totalAnswers;
      totalQuizCorrect += correctAnswers;

      return {
        courseId: c.id,
        courseTitle: c.title,
        courseCategory: c.category,
        progressPercentage: Math.round(ratio * 100),
        status,
        totalSteps: maxSteps,
        currentStepOrder: stepOrder,
        correctAnswers,
        totalAnswers,
      };
    });

    // Fórmula exacta de completación global
    const overallCompletionPercentage =
      totalPublished > 0
        ? Number(((sumRatios / totalPublished) * 100).toFixed(1))
        : 0;

    // Fórmula exacta de tasa de acierto en quizzes
    const accuracyPercentage =
      totalQuizAnswered > 0
        ? Number(((totalQuizCorrect / totalQuizAnswered) * 100).toFixed(1))
        : 0;

    return {
      id: student.id,
      name: student.name,
      phone: student.phone,
      createdAt: student.createdAt,
      overallCompletionPercentage,
      completedCoursesCount,
      inProgressCoursesCount,
      totalPublishedCourses: totalPublished,
      totalQuizQuestionsAnswered: totalQuizAnswered,
      correctQuizQuestions: totalQuizCorrect,
      accuracyPercentage,
      coursesProgress,
    };
  });

  return result;
}

// ─── Actualizar Estudiante ───

const updateStudentSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z
    .string()
    .min(1, "Ingresa un teléfono válido")
    .transform(normalizePhone)
    .refine((v) => phoneRegex.test(v), "Ingresa un número de teléfono válido"),
  password: z.string().optional(),
});

export async function updateStudent(
  studentId: number,
  data: { name: string; phone: string; password?: string }
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return { success: false, error: "No autorizado" };
  }

  const parsed = updateStudentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, phone, password } = parsed.data;

  // Verificar si otro estudiante ya tiene ese teléfono
  const existing = await db
    .select({ id: students.id })
    .from(students)
    .where(and(eq(students.phone, phone), sql`${students.id} != ${studentId}`))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: "Ya existe otro estudiante con este número de teléfono" };
  }

  const updateValues: { name: string; phone: string; passwordHash?: string } = {
    name,
    phone,
  };

  if (password && password.trim().length >= 6) {
    updateValues.passwordHash = await hashPassword(password.trim());
  }

  await db.update(students).set(updateValues).where(eq(students.id, studentId));

  // Actualizar nombre y teléfono en conversaciones de WhatsApp asociadas
  await db
    .update(whatsappConversations)
    .set({ name, phone })
    .where(eq(whatsappConversations.studentId, studentId));

  revalidatePath("/admin/estudiantes");
  revalidatePath("/admin/chats");
  return { success: true };
}

// ─── Eliminar Estudiante ───

export async function deleteStudent(
  studentId: number
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // Eliminar sesiones de chat asociadas
    await db.delete(chatSessions).where(eq(chatSessions.studentId, studentId));

    // Eliminar o desvincular conversaciones de WhatsApp
    await db
      .delete(whatsappConversations)
      .where(eq(whatsappConversations.studentId, studentId));

    // Eliminar estudiante
    await db.delete(students).where(eq(students.id, studentId));

    revalidatePath("/admin/estudiantes");
    revalidatePath("/admin/chats");
    return { success: true };
  } catch (err) {
    console.error("Error eliminando estudiante:", err);
    return { success: false, error: "Error al eliminar el estudiante de la base de datos" };
  }
}
