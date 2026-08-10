import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generatePdfBuffer(title: string, subtitle: string, sections: Array<{ num: string; title: string; desc: string; keyAnswer: string }>): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([612, 792]); // Letter dimensions
  const { width, height } = page.getSize();

  // Header Bar (Emerald Corporate)
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: rgb(0.015, 0.3, 0.22), // #047857
  });

  // Header Title
  page.drawText("PLATAFORMA EDUCATIVA", {
    x: 40,
    y: height - 48,
    size: 20,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Material Oficial de Capacitacion Agropecuaria", {
    x: 40,
    y: height - 72,
    size: 12,
    font: fontHelvetica,
    color: rgb(0.7, 0.95, 0.8),
  });

  let y = height - 150;

  // Document Title
  page.drawText(title, {
    x: 40,
    y,
    size: 16,
    font: fontHelveticaBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  y -= 20;

  page.drawText(subtitle, {
    x: 40,
    y,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.3, 0.35, 0.4),
  });

  y -= 30;

  for (const sec of sections) {
    page.drawText(`${sec.num}: ${sec.title}`, {
      x: 40,
      y,
      size: 13,
      font: fontHelveticaBold,
      color: rgb(0.015, 0.47, 0.34),
    });

    y -= 18;

    page.drawText(sec.desc, {
      x: 40,
      y,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.2, 0.25, 0.3),
      maxWidth: 532,
      lineHeight: 14,
    });

    y -= 48;

    // Highlight key answer box
    page.drawRectangle({
      x: 40,
      y: y - 8,
      width: 532,
      height: 36,
      color: rgb(0.93, 0.98, 0.94),
      borderColor: rgb(0.7, 0.9, 0.75),
      borderWidth: 1,
    });

    page.drawText(sec.keyAnswer, {
      x: 52,
      y: y + 14,
      size: 9,
      font: fontHelveticaBold,
      color: rgb(0.02, 0.35, 0.25),
      lineHeight: 12,
    });

    y -= 55;
  }

  // Footer line & text
  page.drawLine({
    start: { x: 40, y: 50 },
    end: { x: 572, y: 50 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  page.drawText("Plataforma Educativa - Material valido para Puntos Digitales y Agente de WhatsApp", {
    x: 40,
    y: 34,
    size: 9,
    font: fontHelvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

async function main() {
  const guiasDir = path.join(process.cwd(), "public", "guias");
  if (!fs.existsSync(guiasDir)) {
    fs.mkdirSync(guiasDir, { recursive: true });
  }

  // 1. Agroindustria
  const pdfAgro = await generatePdfBuffer(
    "Guia de Buenas Practicas en Agroindustria",
    "Capacitacion integral para el manejo, preparacion y conservacion de cultivos.",
    [
      {
        num: "Leccion 1",
        title: "Preparacion y Analisis del Terreno",
        desc: "El primer paso indispensable antes de sembrar es preparar y analizar el terreno. Se deben realizar estudios del suelo para medir nutrientes, nivel de acidez (pH) y drenaje.",
        keyAnswer: "Pregunta evaluativa: ?Cual es el primer paso antes de sembrar?\nRespuesta correcta: Preparar y analizar el terreno.",
      },
      {
        num: "Leccion 2",
        title: "Manejo Integrado y Control de Plagas",
        desc: "Para un control de plagas efectivo y sostenible, se recomienda la deteccion temprana mediante revisiones frecuentes y la aplicacion de metodos naturales u organicos.",
        keyAnswer: "Pregunta evaluativa: ?Que se recomienda para el control temprano de plagas?\nRespuesta correcta: Identificarlas a tiempo y usar control natural.",
      },
      {
        num: "Leccion 3",
        title: "Cosecha, Almacenamiento y Calidad",
        desc: "Al momento de cosechar, se debe manipular el producto con higiene. El almacenamiento debe realizarse en bodegas secas, limpias y bien ventiladas.",
        keyAnswer: "Resumen clave: Conservacion en empaques limpios y ambiente seco.",
      },
    ]
  );

  // 2. Riego e Hidratacion
  const pdfRiego = await generatePdfBuffer(
    "Guia de Diagnostico de Necesidades Hidricas y Riego Efficiente",
    "Manual pratico de riego por goteo, conservacion del agua y monitoreo del suelo.",
    [
      {
        num: "Leccion 1",
        title: "Diagnostico de Necesidades Hidricas",
        desc: "Aprende a estimar la cantidad de agua requerida por el cultivo segun el tipo de suelo, nivel de evaporacion y etapa de crecimiento de la planta.",
        keyAnswer: "Respuesta clave: Evaluacion de humedad de suelo y evaporacion diurna.",
      },
      {
        num: "Leccion 2",
        title: "Sistemas de Riego por Goteo",
        desc: "Ventajas del riego por goteo frente al riego tradicional: ahorro del 50% de agua, reduccion de malezas y aplicacion directa a la raiz.",
        keyAnswer: "Respuesta clave: Instalacion de lineas de goteo con bajo caudal.",
      },
      {
        num: "Leccion 3",
        title: "Mantenimiento y Ahorro de Agua",
        desc: "Prevencion de fugas, lavado periodic de filtros y goteros para mantener la presion uniforme en toda la parcela.",
        keyAnswer: "Respuesta clave: Revision semanal de filtros y lineas secundarias.",
      },
    ]
  );

  // 3. Ganadería
  const pdfGanaderia = await generatePdfBuffer(
    "Guia de Manejo de Hato y Bienestar Animal",
    "Principios fundamentales para la alimentacion, salud y pastoreo rotacional.",
    [
      {
        num: "Leccion 1",
        title: "Manejo del Hato y Bienestar Animal",
        desc: "Organizacion de bovinos segun etapa productiva, garantia de agua limpia a voluntad y sombra en praderas.",
        keyAnswer: "Respuesta clave: Agrupamiento por etapa productiva y reduccion del estres.",
      },
      {
        num: "Leccion 2",
        title: "Pasturas y Rotacion de Potreros",
        desc: "Division de praderas para permitir la recuperacion biologica del pasto y mejorar el rendimiento por hectarea.",
        keyAnswer: "Respuesta clave: Periodos de descanso segun la variedad de pasto.",
      },
      {
        num: "Leccion 3",
        title: "Sanidad Preventiva y Registro",
        desc: "Cumplimiento del plan de vacunacion oficial, desparasitacion programada y fichas de control de peso.",
        keyAnswer: "Respuesta clave: Registros individuales de produccion y vacunacion.",
      },
    ]
  );

  // 4. Poscosecha
  const pdfPoscosecha = await generatePdfBuffer(
    "Guia de Poscosecha y Almacenamiento Libre de Plagas",
    "Tecnicas para evitar perdidas en grano almacenado y mejorar la calidad de venta.",
    [
      {
        num: "Leccion 1",
        title: "Punto Optimo de Cosecha",
        desc: "Determinacion del porcentaje de humedad del grano para decidir el dia ideal de recoleccion sin mermas.",
        keyAnswer: "Respuesta clave: Cosechar con el porcentaje exacto de humedad comercial.",
      },
      {
        num: "Leccion 2",
        title: "Secado y Control de Humedad",
        desc: "Metodos de secado solar y mecanico hasta alcanzar el 12%-14% de humedad interna en grano.",
        keyAnswer: "Respuesta clave: Secado uniforme antes del embolsado.",
      },
      {
        num: "Leccion 3",
        title: "Almacenamiento Libre de Plagas",
        desc: "Uso de silos hermeticos y bodegas desinfectadas para prevenir ataques de gorgojos e insectos.",
        keyAnswer: "Respuesta clave: Limpieza total de bodegas y sellado de silos.",
      },
    ]
  );

  fs.writeFileSync(path.join(guiasDir, "guia-buenas-practicas-agroindustria.pdf"), pdfAgro);
  fs.writeFileSync(path.join(guiasDir, "riego-leccion-1.pdf"), pdfRiego);
  fs.writeFileSync(path.join(guiasDir, "ganaderia-leccion-1.pdf"), pdfGanaderia);
  fs.writeFileSync(path.join(guiasDir, "poscosecha-leccion-1.pdf"), pdfPoscosecha);
  fs.writeFileSync(path.join(guiasDir, "guia-general.pdf"), pdfAgro);

  console.log("Todos los PDFs de los cursos generados exitosamente en public/guias/");
}

main().catch(console.error);
