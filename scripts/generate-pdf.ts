import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generatePdfBuffer(title: string): Promise<Buffer> {
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

  y -= 35;

  const sections = [
    {
      num: "Leccion 1",
      title: "Preparacion y Analisis del Terreno",
      desc: "El primer paso indispensable antes de sembrar es preparar y analizar el terreno. Se deben realizar estudios del suelo para medir nutrientes, nivel de acidez (pH) y drenaje, garantizando las condiciones optimas para el cultivo.",
      keyAnswer: "Pregunta evaluativa: ?Cual es el primer paso antes de sembrar?\nRespuesta correcta: Preparar y analizar el terreno.",
    },
    {
      num: "Leccion 2",
      title: "Manejo Integrado y Control de Plagas",
      desc: "Para un control de plagas efectivo y sostenible, se recomienda la deteccion temprana mediante revisiones frecuentes y la aplicacion de metodos naturales u organicos antes de utilizar agroquimicos.",
      keyAnswer: "Pregunta evaluativa: ?Que se recomienda para el control temprano de plagas?\nRespuesta correcta: Identificarlas a tiempo y usar control natural.",
    },
    {
      num: "Leccion 3",
      title: "Cosecha, Almacenamiento y Calidad",
      desc: "Al momento de cosechar, se debe manipular el producto con higiene. El almacenamiento debe realizarse en bodegas secas, limpias y bien ventiladas para prevenir humedad y proliferacion de hongos.",
      keyAnswer: "Resumen clave: Conservacion en empaques limpios y ambiente seco.",
    },
  ];

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

  const pdfBuffer = await generatePdfBuffer("Guia de Buenas Practicas en Agroindustria");

  fs.writeFileSync(path.join(guiasDir, "guia-buenas-practicas-agroindustria.pdf"), pdfBuffer);
  fs.writeFileSync(path.join(guiasDir, "leccion-1-preparacion-terreno.pdf"), pdfBuffer);
  fs.writeFileSync(path.join(guiasDir, "leccion-2-manejo-plagas.pdf"), pdfBuffer);
  fs.writeFileSync(path.join(guiasDir, "leccion-3-cosecha-almacenamiento.pdf"), pdfBuffer);

  console.log("PDFs 100% estándar creados exitosamente en public/guias/");
}

main().catch(console.error);
