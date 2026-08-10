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
  const email = (process.env.ADMIN_EMAIL ?? "admin@cultiva.demo").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "changeme";
  const name = process.env.ADMIN_NAME ?? "Administrador Cultiva";

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
        "¡Hola! Soy el asistente de Cultiva. Vamos a empezar el curso \"Buenas Prácticas en Agroindustria\". Son 3 lecciones cortas.",
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
        "¡Felicidades, completaste el curso! Un asesor de Cultiva puede contactarte si tienes preguntas.",
    },
  ]);

  console.log(`Curso de ejemplo creado con ${lessonRows.length} lecciones.`);
}

type LessonInput = {
  title: string;
  summary: string;
  videoUrl: string;
  pdfUrl: string;
};

type QuestionInput = {
  question: string;
  options: string[];
  correctOptionIndex: number;
};

async function seedGeneratedCourse(input: {
  slug: string;
  title: string;
  description: string;
  category: string;
  welcome: string;
  closing: string;
  lessons: LessonInput[];
  questions: QuestionInput[];
}) {
  const [existing] = await db.select().from(courses).where(eq(courses.slug, input.slug)).limit(1);
  if (existing) {
    console.log(`Curso "${input.title}" ya existe, se omite.`);
    return;
  }

  const [course] = await db
    .insert(courses)
    .values({
      title: input.title,
      slug: input.slug,
      description: input.description,
      category: input.category,
      published: true,
    })
    .returning();

  const lessonRows = await db
    .insert(lessons)
    .values(
      input.lessons.map((lesson, index) => ({
        courseId: course.id,
        order: index + 1,
        title: lesson.title,
        summary: lesson.summary,
        videoUrl: lesson.videoUrl,
        pdfUrl: lesson.pdfUrl,
      })),
    )
    .returning();

  let order = 1;
  const steps: (typeof whatsappSteps.$inferInsert)[] = [
    { courseId: course.id, order: order++, kind: "welcome", messageText: input.welcome },
  ];

  lessonRows.forEach((lesson, index) => {
    steps.push({
      courseId: course.id,
      order: order++,
      kind: "lesson",
      lessonId: lesson.id,
      messageText: `Lección ${index + 1}: ${lesson.title}. Mira el video y revisa la guía en PDF.`,
    });

    const q = input.questions[index];
    if (q) {
      steps.push({
        courseId: course.id,
        order: order++,
        kind: "question",
        lessonId: lesson.id,
        messageText: "Antes de seguir, una pregunta rápida:",
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
      });
    }
  });

  steps.push({ courseId: course.id, order: order++, kind: "closing", messageText: input.closing });

  await db.insert(whatsappSteps).values(steps);

  console.log(`Curso "${input.title}" creado con ${lessonRows.length} lecciones.`);
}

async function seedMoreCourses() {
  await seedGeneratedCourse({
    slug: "ganaderia-sostenible-doble-proposito",
    title: "Ganadería Sostenible de Doble Propósito",
    category: "Ganadería",
    description:
      "Prácticas de manejo para hatos de doble propósito (leche y carne): bienestar animal, rotación de potreros, sanidad preventiva y registro productivo, adaptadas a fincas pequeñas y medianas.",
    welcome:
      '¡Hola! Vamos a comenzar el curso "Ganadería Sostenible de Doble Propósito". Son 3 lecciones cortas sobre manejo del hato, pasturas y sanidad.',
    closing:
      "¡Completaste el curso de ganadería sostenible! Aplica lo aprendido en tu próxima rotación de potreros.",
    lessons: [
      {
        title: "Manejo del hato y bienestar animal",
        summary:
          "Cómo agrupar el ganado por etapa productiva, señales de estrés y buenas prácticas de manejo que mejoran la producción de leche y carne.",
        videoUrl: "https://cdn.cultiva.demo/videos/ganaderia-leccion-1.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/ganaderia-leccion-1.pdf",
      },
      {
        title: "Pasturas y rotación de potreros",
        summary:
          "Diseño de un sistema de pastoreo rotacional que recupera el suelo, mejora el forraje disponible y reduce la necesidad de suplementos.",
        videoUrl: "https://cdn.cultiva.demo/videos/ganaderia-leccion-2.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/ganaderia-leccion-2.pdf",
      },
      {
        title: "Sanidad preventiva y registro productivo",
        summary:
          "Calendario básico de vacunación y desparasitación, y cómo llevar un registro simple que ayuda a detectar problemas a tiempo.",
        videoUrl: "https://cdn.cultiva.demo/videos/ganaderia-leccion-3.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/ganaderia-leccion-3.pdf",
      },
    ],
    questions: [
      {
        question: "¿Por qué se agrupa el ganado por etapa productiva?",
        options: [
          "Para facilitar el manejo y ajustar la alimentación a cada grupo",
          "Porque es una tradición sin efecto real",
          "Para venderlo más rápido",
        ],
        correctOptionIndex: 0,
      },
      {
        question: "¿Cuál es el principal beneficio de la rotación de potreros?",
        options: [
          "Aumenta el gasto en fertilizantes",
          "Permite que el pasto se recupere y mejora el forraje disponible",
          "Reduce el tamaño del hato",
        ],
        correctOptionIndex: 1,
      },
      {
        question: "¿Qué permite un registro productivo simple?",
        options: [
          "Nada relevante para la finca",
          "Solo llevar cuentas de gastos",
          "Detectar a tiempo problemas de sanidad o producción",
        ],
        correctOptionIndex: 2,
      },
    ],
  });

  await seedGeneratedCourse({
    slug: "riego-eficiente-pequenos-productores",
    title: "Riego Eficiente para Pequeños Productores",
    category: "Riego y Agua",
    description:
      "Cómo diagnosticar las necesidades reales de agua del cultivo, elegir un sistema de riego adecuado y mantenerlo para reducir el desperdicio de agua sin sacrificar producción.",
    welcome:
      '¡Hola! Empecemos el curso "Riego Eficiente para Pequeños Productores". En 3 lecciones veremos diagnóstico, sistemas de riego y mantenimiento.',
    closing: "¡Curso de riego completado! Un uso eficiente del agua protege tu cosecha y tu inversión.",
    lessons: [
      {
        title: "Diagnóstico de necesidades hídricas",
        summary:
          "Cómo estimar cuánta agua necesita realmente tu cultivo según el tipo de suelo, el clima y la etapa de crecimiento.",
        videoUrl: "https://cdn.cultiva.demo/videos/riego-leccion-1.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/riego-leccion-1.pdf",
      },
      {
        title: "Sistemas de riego por goteo",
        summary:
          "Ventajas del riego por goteo frente al riego por gravedad, y cómo instalarlo de forma sencilla en parcelas pequeñas.",
        videoUrl: "https://cdn.cultiva.demo/videos/riego-leccion-2.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/riego-leccion-2.pdf",
      },
      {
        title: "Mantenimiento y ahorro de agua",
        summary:
          "Rutinas de limpieza y revisión que evitan fugas y goteros tapados, y hábitos que reducen el consumo de agua sin afectar el cultivo.",
        videoUrl: "https://cdn.cultiva.demo/videos/riego-leccion-3.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/riego-leccion-3.pdf",
      },
    ],
    questions: [
      {
        question: "¿De qué depende principalmente la necesidad de agua de un cultivo?",
        options: [
          "Solo del tamaño de la parcela",
          "Del tipo de suelo, el clima y la etapa de crecimiento",
          "Del color de las hojas",
        ],
        correctOptionIndex: 1,
      },
      {
        question: "¿Cuál es una ventaja clave del riego por goteo?",
        options: [
          "Usa más agua que el riego por gravedad",
          "Entrega agua directamente a la raíz y reduce el desperdicio",
          "Solo funciona en terrenos muy grandes",
        ],
        correctOptionIndex: 1,
      },
      {
        question: "¿Qué previene el mantenimiento regular del sistema de riego?",
        options: [
          "Fugas y goteros tapados que desperdician agua",
          "El crecimiento del cultivo",
          "La necesidad de sembrar",
        ],
        correctOptionIndex: 0,
      },
    ],
  });

  await seedGeneratedCourse({
    slug: "poscosecha-almacenamiento-granos",
    title: "Poscosecha y Almacenamiento de Granos",
    category: "Poscosecha",
    description:
      "Buenas prácticas para cosechar en el punto óptimo, secar correctamente el grano y almacenarlo protegido de plagas y humedad, reduciendo pérdidas después de la cosecha.",
    welcome:
      '¡Hola! Vamos con el curso "Poscosecha y Almacenamiento de Granos". 3 lecciones sobre cosecha, secado y almacenamiento.',
    closing: "¡Completaste el curso de poscosecha! Reducir pérdidas después de cosechar es tan importante como la cosecha misma.",
    lessons: [
      {
        title: "Punto óptimo de cosecha",
        summary:
          "Cómo identificar el momento correcto para cosechar según la humedad del grano y evitar pérdidas por cosecha temprana o tardía.",
        videoUrl: "https://cdn.cultiva.demo/videos/poscosecha-leccion-1.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/poscosecha-leccion-1.pdf",
      },
      {
        title: "Secado y control de humedad",
        summary:
          "Métodos sencillos de secado al sol y con secadoras artesanales, y por qué el porcentaje de humedad final es clave para conservar el grano.",
        videoUrl: "https://cdn.cultiva.demo/videos/poscosecha-leccion-2.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/poscosecha-leccion-2.pdf",
      },
      {
        title: "Almacenamiento libre de plagas",
        summary:
          "Cómo preparar silos o bodegas limpias, herméticas y ventiladas para proteger el grano almacenado de plagas y hongos.",
        videoUrl: "https://cdn.cultiva.demo/videos/poscosecha-leccion-3.mp4",
        pdfUrl: "https://cdn.cultiva.demo/guias/poscosecha-leccion-3.pdf",
      },
    ],
    questions: [
      {
        question: "¿Qué determina principalmente el punto óptimo de cosecha?",
        options: [
          "El clima del día siguiente",
          "La humedad del grano",
          "El precio del mercado",
        ],
        correctOptionIndex: 1,
      },
      {
        question: "¿Por qué es clave controlar la humedad final del grano?",
        options: [
          "No tiene ningún efecto en el almacenamiento",
          "Porque afecta el color del grano únicamente",
          "Porque un grano mal secado se daña más rápido durante el almacenamiento",
        ],
        correctOptionIndex: 2,
      },
      {
        question: "¿Qué característica debe tener un buen espacio de almacenamiento?",
        options: [
          "Limpio, hermético y bien ventilado",
          "Húmedo y cerrado sin ventilación",
          "Grande, sin importar la limpieza",
        ],
        correctOptionIndex: 0,
      },
    ],
  });
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
  await seedMoreCourses();
  await seedPuntoDigital();
  console.log("Seed completado.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
