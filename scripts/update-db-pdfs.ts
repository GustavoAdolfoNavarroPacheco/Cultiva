import { db } from "../lib/db";
import { lessons } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allLessons = await db.select().from(lessons);
  console.log(`Encontradas ${allLessons.length} lecciones en la base de datos.`);

  for (const lesson of allLessons) {
    let newPdfUrl = "/guias/guia-buenas-practicas-agroindustria.pdf";

    if (lesson.courseId === 2 || lesson.title.toLowerCase().includes("hato") || lesson.title.toLowerCase().includes("pastura")) {
      newPdfUrl = "/guias/ganaderia-leccion-1.pdf";
    } else if (lesson.courseId === 3 || lesson.title.toLowerCase().includes("hídrica") || lesson.title.toLowerCase().includes("riego")) {
      newPdfUrl = "/guias/riego-leccion-1.pdf";
    } else if (lesson.courseId === 4 || lesson.title.toLowerCase().includes("cosecha") || lesson.title.toLowerCase().includes("secado")) {
      newPdfUrl = "/guias/poscosecha-leccion-1.pdf";
    }

    await db
      .update(lessons)
      .set({ pdfUrl: newPdfUrl })
      .where(eq(lessons.id, lesson.id));

    console.log(`Lección ID ${lesson.id} ("${lesson.title}") actualizada a -> ${newPdfUrl}`);
  }

  console.log("¡Actualización masiva de URLs de PDF completada en la base de datos!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error al actualizar lecciones:", e);
    process.exit(1);
  });
