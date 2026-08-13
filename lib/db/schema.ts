import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  videoUrl: text("video_url"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** kind: 'welcome' | 'lesson' | 'question' | 'closing' */
export const whatsappSteps = pgTable("whatsapp_steps", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  kind: text("kind").notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  messageText: text("message_text").notNull(),
  question: text("question"),
  options: jsonb("options").$type<string[]>(),
  correctOptionIndex: integer("correct_option_index"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const puntosDigitales = pgTable("puntos_digitales", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  zona: text("zona").notNull(),
  responsable: text("responsable"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** fileType: 'video' | 'pdf' */
export const downloadLogs = pgTable("download_logs", {
  id: serial("id").primaryKey(),
  puntoId: integer("punto_id")
    .notNull()
    .references(() => puntosDigitales.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  studentId: integer("student_id").references(() => students.id, { onDelete: "set null" }),
  fileType: text("file_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ChatAnswer = {
  stepId: number;
  optionIndex: number;
  correct: boolean;
};

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  studentId: integer("student_id").references(() => students.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  currentStepOrder: integer("current_step_order").notNull().default(0),
  answers: jsonb("answers").$type<ChatAnswer[]>().notNull().default([]),
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const agentIaConfig = pgTable("agent_ia_config", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull().default("KHC Bot"),
  tono: text("tono").notNull().default("PROFESIONAL"),
  modelo: text("modelo").notNull().default("deepseek-v4-pro"),
  maxTokens: integer("max_tokens").notNull().default(2048),
  temperatura: text("temperatura").notNull().default("0.7"),
  systemPrompt: text("system_prompt").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappConversations = pgTable("whatsapp_conversations", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  name: text("name"),
  studentId: integer("student_id").references(() => students.id, { onDelete: "set null" }),
  mode: text("mode").notNull().default("AGENTE_IA"),
  etapaActual: text("etapa_actual").notNull().default("INICIO"),
  unreadCount: integer("unread_count").notNull().default(0),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => whatsappConversations.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  type: text("type").notNull().default("TEXTO"),
  content: text("content").notNull(),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  fileMimeType: text("file_mime_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappBusinessConfig = pgTable("whatsapp_business_config", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().default(""),
  businessName: text("business_name").notNull().default(""),
  wabaId: text("waba_id").notNull().default(""),
  phoneNumberId: text("phone_number_id").notNull().default(""),
  qualityRating: text("quality_rating").notNull().default(""),
  messagingTier: text("messaging_tier").notNull().default(""),
  webhookUrl: text("webhook_url").notNull().default(""),
  webhookToken: text("webhook_token").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

