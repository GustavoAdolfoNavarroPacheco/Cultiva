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
