import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import {
  courses,
  lessons,
  puntosDigitales,
  users,
  whatsappSteps,
} from "../lib/db/schema";
import { hashPassword } from "../lib/auth/password";

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@agro.ai").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "changeme";
  const name = process.env.ADMIN_NAME ?? "Administrador Agro.ai";

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    console.log(`Usuario admin ya existe: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ name, email, passwordHash, role: "admin" });
  console.log(`Usuario admin creado: ${email}`);
}

async function seedCourse() {
  const slug = "buenas-practicas-agroindustria";
  const [existing] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (existing) {
    console.log("Curso de ejemplo ya existe, se omite.");
    return;
  }

  const [course] = await db
    .insert(courses)
    .values({
      title: "Buenas Prácticas en Agroindustria",
      slug,
      description:
        "Introducción a las buenas prácticas de manejo, cosecha y almacenamiento para pequeños productores.",
      category: "Agroindustria",
      published: true,
    })
    .returning();

  const lessonRows = await db
    .insert(lessons)
    .values([
      {
        courseId: course.id,
        order: 1,
        title: "Preparación del terreno",
        summary: "Cómo preparar el suelo antes de la siembra.",
        videoUrl: "https://example.com/videos/leccion-1.mp4",
        pdfUrl: "https://example.com/guias/leccion-1.pdf",
      },
      {
        courseId: course.id,
        order: 2,
        title: "Manejo de plagas",
        summary: "Identificación temprana y control natural de plagas.",
        videoUrl: "https://example.com/videos/leccion-2.mp4",
        pdfUrl: "https://example.com/guias/leccion-2.pdf",
      },
      {
        courseId: course.id,
        order: 3,
        title: "Cosecha y almacenamiento",
        summary: "Buenas prácticas para conservar la calidad del producto.",
        videoUrl: "https://example.com/videos/leccion-3.mp4",
        pdfUrl: "https://example.com/guias/leccion-3.pdf",
      },
    ])
    .returning();

  await db.insert(whatsappSteps).values([
    {
      courseId: course.id,
      order: 1,
      kind: "welcome",
      messageText:
        "¡Hola! Soy el asistente de Agro.ai. Vamos a empezar el curso \"Buenas Prácticas en Agroindustria\". Son 3 lecciones cortas.",
    },
    {
      courseId: course.id,
      order: 2,
      kind: "lesson",
      lessonId: lessonRows[0].id,
      messageText:
        "Lección 1: Preparación del terreno. Mira el video y revisa la guía en PDF cuando puedas.",
    },
    {
      courseId: course.id,
      order: 3,
      kind: "question",
      lessonId: lessonRows[0].id,
      messageText: "Antes de seguir, una pregunta rápida:",
      question: "¿Cuál es el primer paso antes de sembrar?",
      options: [
        "Preparar y analizar el terreno",
        "Aplicar pesticidas",
        "Cosechar el cultivo anterior",
      ],
      correctOptionIndex: 0,
    },
    {
      courseId: course.id,
      order: 4,
      kind: "lesson",
      lessonId: lessonRows[1].id,
      messageText: "Lección 2: Manejo de plagas. Aquí tienes el video y la guía.",
    },
    {
      courseId: course.id,
      order: 5,
      kind: "question",
      lessonId: lessonRows[1].id,
      messageText: "Rápida pregunta sobre esta lección:",
      question: "¿Qué se recomienda para el control temprano de plagas?",
      options: [
        "Esperar a que se propaguen",
        "Identificarlas a tiempo y usar control natural",
        "Ignorarlas hasta la cosecha",
      ],
      correctOptionIndex: 1,
    },
    {
      courseId: course.id,
      order: 6,
      kind: "lesson",
      lessonId: lessonRows[2].id,
      messageText: "Lección 3: Cosecha y almacenamiento. Último video y guía del curso.",
    },
    {
      courseId: course.id,
      order: 7,
      kind: "closing",
      messageText:
        "¡Felicidades, completaste el curso! Un asesor de Agro.ai puede contactarte si tienes preguntas.",
    },
  ]);

  console.log(`Curso de ejemplo creado con ${lessonRows.length} lecciones.`);
}

async function seedPuntoDigital() {
  const [existing] = await db.select().from(puntosDigitales).limit(1);
  if (existing) {
    console.log("Puntos digitales ya existen, se omite.");
    return;
  }

  await db.insert(puntosDigitales).values([
    {
      name: "Punto Digital Central",
      zona: "Cabecera municipal",
      responsable: "Equipo de extensión agropecuaria",
    },
    {
      name: "Punto Digital La Vereda",
      zona: "Zona rural norte",
      responsable: "Casa comunal",
    },
  ]);

  console.log("Puntos digitales de ejemplo creados.");
}

async function main() {
  await seedAdmin();
  await seedCourse();
  await seedPuntoDigital();
  console.log("Seed completado.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
