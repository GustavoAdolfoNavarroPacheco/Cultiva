"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "./password";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "./session";
import { normalizePhone, phoneRegex } from "@/lib/utils/phone";

const phoneField = z
  .string()
  .min(1, "Ingresa tu número de teléfono")
  .transform(normalizePhone)
  .refine((value) => phoneRegex.test(value), "Ingresa un número de teléfono válido");

const studentLoginSchema = z.object({
  phone: phoneField,
  password: z.string().min(1, "Ingresa tu contraseña"),
});

const studentRegisterSchema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre"),
    phone: phoneField,
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type StudentAuthState = { error?: string };

export async function studentLoginAction(
  _prevState: StudentAuthState,
  formData: FormData,
): Promise<StudentAuthState> {
  const parsed = studentLoginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { phone, password } = parsed.data;

  const [student] = await db.select().from(students).where(eq(students.phone, phone)).limit(1);

  if (!student) {
    return { error: "Teléfono o contraseña incorrectos" };
  }

  const validPassword = await verifyPassword(password, student.passwordHash);
  if (!validPassword) {
    return { error: "Teléfono o contraseña incorrectos" };
  }

  const token = await signSession({
    sub: String(student.id),
    name: student.name,
    phone: student.phone,
    role: "student",
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  redirect("/puntos");
}

export async function studentRegisterAction(
  _prevState: StudentAuthState,
  formData: FormData,
): Promise<StudentAuthState> {
  const parsed = studentRegisterSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, phone, password } = parsed.data;

  const [existing] = await db.select({ id: students.id }).from(students).where(eq(students.phone, phone));
  if (existing) {
    return { error: "Ya existe una cuenta con este número. Inicia sesión." };
  }

  const passwordHash = await hashPassword(password);

  const [student] = await db.insert(students).values({ name, phone, passwordHash }).returning();

  const token = await signSession({
    sub: String(student.id),
    name: student.name,
    phone: student.phone,
    role: "student",
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  redirect("/puntos");
}
