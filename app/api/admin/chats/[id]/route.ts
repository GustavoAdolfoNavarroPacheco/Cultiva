import { NextResponse } from "next/server";
import { asc, desc, eq, ne, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages, students, courses } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { generateAndSendAiReply } from "@/lib/ai-reply";

export const dynamic = "force-dynamic";

export async function GET(
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

  // Reset unread count
  if (conversation.unreadCount > 0) {
    await db
      .update(whatsappConversations)
      .set({ unreadCount: 0 })
      .where(eq(whatsappConversations.id, conversationId));
  }

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

  const rawPhone = conversation.phone.replace(/^\+/, "");
  const [student] = await db
    .select()
    .from(students)
    .where(sql`replace(${students.phone}, '+', '') = ${rawPhone}`)
    .limit(1);

  const publishedCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true));

  return NextResponse.json({
    conversation,
    messages,
    student: student ?? null,
    courses: publishedCourses,
  });
}

export async function PATCH(
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

  const body = await request.json();
  const { mode } = body;

  if (!mode || !["AGENTE_IA", "MANUAL"].includes(mode)) {
    return NextResponse.json({ error: "Modo inválido" }, { status: 400 });
  }

  const [updated] = await db
    .update(whatsappConversations)
    .set({ mode })
    .where(eq(whatsappConversations.id, conversationId))
    .returning();

  // ── Si se reactiva el Agente IA y el estudiante quedó sin respuesta, responder de inmediato ──
  if (mode === "AGENTE_IA") {
    const [lastMessage] = await db
      .select()
      .from(whatsappMessages)
      .where(
        and(
          eq(whatsappMessages.conversationId, conversationId),
          ne(whatsappMessages.type, "WHATSAPP_ID")
        )
      )
      .orderBy(desc(whatsappMessages.createdAt))
      .limit(1);

    if (lastMessage?.author === "STUDENT") {
      await generateAndSendAiReply(conversationId);
    }
  }

  return NextResponse.json({ conversation: updated });
}
