"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { getCurrentUser } from "@/lib/auth/current-user";

const userSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "editor"]),
});

export type UserFormState = { error?: string };

export async function createUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const parsed = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) {
    return { error: "Ya existe un usuario con ese correo" };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.insert(users).values({
    name: parsed.data.name,
    email,
    passwordHash,
    role: parsed.data.role,
  });

  revalidatePath("/admin/usuarios");
  return {};
}

export async function deleteUser(userId: number) {
  const current = await getCurrentUser();
  if (current && Number(current.sub) === userId) {
    return { error: "No puedes eliminar tu propio usuario" };
  }

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/usuarios");
  return {};
}
