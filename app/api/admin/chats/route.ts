import { NextResponse } from "next/server";
import { desc, eq, ne, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappConversations, whatsappMessages, students, courses } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const conversations = await db
    .select()
    .from(whatsappConversations)
    .orderBy(desc(whatsappConversations.lastMessageAt));

  const conversationsWithDetails = await Promise.all(
    conversations.map(async (conv) => {
      const [lastMsg] = await db
        .select()
        .from(whatsappMessages)
        .where(
          and(
            eq(whatsappMessages.conversationId, conv.id),
            ne(whatsappMessages.type, "WHATSAPP_ID")
          )
        )
        .orderBy(desc(whatsappMessages.createdAt))
        .limit(1);

      const rawPhone = conv.phone.replace(/^\+/, "");
      const [matchingStudent] = await db
        .select()
        .from(students)
        .where(sql`replace(${students.phone}, '+', '') = ${rawPhone}`)
        .limit(1);

      return {
        ...conv,
        student: matchingStudent ?? null,
        lastMessage: lastMsg ?? null,
      };
    })
  );

  return NextResponse.json({ conversations: conversationsWithDetails });
}
