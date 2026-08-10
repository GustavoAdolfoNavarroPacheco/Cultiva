"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { downloadLogs } from "@/lib/db/schema";

export async function logDownloadAction(formData: FormData) {
  const puntoId = Number(formData.get("puntoId"));
  const courseId = Number(formData.get("courseId"));
  const lessonId = Number(formData.get("lessonId"));
  const fileType = String(formData.get("fileType"));
  const url = String(formData.get("url"));

  await db.insert(downloadLogs).values({ puntoId, courseId, lessonId, fileType });
  revalidatePath("/admin");

  redirect(url);
}
