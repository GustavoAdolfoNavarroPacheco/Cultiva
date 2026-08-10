"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { puntosDigitales } from "@/lib/db/schema";

const puntoSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  zona: z.string().min(2, "La zona es obligatoria"),
  responsable: z.string().optional(),
});

export type PuntoFormState = { error?: string };

export async function createPunto(
  _prevState: PuntoFormState,
  formData: FormData,
): Promise<PuntoFormState> {
  const parsed = puntoSchema.safeParse({
    name: formData.get("name"),
    zona: formData.get("zona"),
    responsable: formData.get("responsable"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await db.insert(puntosDigitales).values({
    name: parsed.data.name,
    zona: parsed.data.zona,
    responsable: parsed.data.responsable || null,
  });

  revalidatePath("/admin/puntos");
  revalidatePath("/puntos");
  return {};
}

export async function deletePunto(puntoId: number) {
  await db.delete(puntosDigitales).where(eq(puntosDigitales.id, puntoId));
  revalidatePath("/admin/puntos");
  revalidatePath("/puntos");
}
