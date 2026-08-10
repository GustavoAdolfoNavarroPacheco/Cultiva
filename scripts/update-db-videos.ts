import { db } from "../lib/db";
import { lessons } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allLessons = await db.select().from(lessons);
  console.log(`Encontradas ${allLessons.length} lecciones en la base de datos para actualización de video.`);

  for (const lesson of allLessons) {
    let newVideoUrl = "/videos/video-leccion-oficial.mp4";

    if (lesson.courseId === 2 || lesson.title.toLowerCase().includes("hato") || lesson.title.toLowerCase().includes("pastura")) {
      newVideoUrl = "/videos/ganaderia-leccion-1.mp4";
    } else if (lesson.courseId === 3 || lesson.title.toLowerCase().includes("hídrica") || lesson.title.toLowerCase().includes("riego")) {
      newVideoUrl = "/videos/riego-leccion-1.mp4";
    } else if (lesson.courseId === 4 || lesson.title.toLowerCase().includes("cosecha") || lesson.title.toLowerCase().includes("secado")) {
      newVideoUrl = "/videos/poscosecha-leccion-1.mp4";
    }

    await db
      .update(lessons)
      .set({ videoUrl: newVideoUrl })
      .where(eq(lessons.id, lesson.id));

    console.log(`Lección ID ${lesson.id} ("${lesson.title}") actualizada a -> ${newVideoUrl}`);
  }

  console.log("¡Actualización masiva de URLs de video completada en Neon DB!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error al actualizar videos de lecciones:", e);
    process.exit(1);
  });
