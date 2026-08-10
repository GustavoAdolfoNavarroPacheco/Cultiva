import fs from "node:fs";
import path from "node:path";

function createValidPdfContent(title: string, lessonsText: string[]): Buffer {
  const contentStream = `
BT
/F1 22 Tf
50 750 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(Plataforma Educativa - Material Oficial de Capacitacion) Tj
0 -40 Td
(--------------------------------------------------------------------------------) Tj
0 -30 Td
/F1 14 Tf
(CONTENIDO PEDAGOGICO DEL CURSO) Tj
/F1 11 Tf
0 -25 Td
${lessonsText.map(line => `(${line.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj\n0 -18 Td`).join('\n')}
0 -30 Td
(--------------------------------------------------------------------------------) Tj
0 -25 Td
/F1 10 Tf
(Este documento contiene la informacion necesaria para responder las preguntas) Tj
0 -15 Td
(evaluativas del Agente de WhatsApp y completar la leccion en Puntos Digitales.) Tj
ET
`;

  const streamLength = Buffer.byteLength(contentStream, 'utf8');

  const pdfTemplate = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj

2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj

3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
>>
endobj

4 0 obj
<<
  /Length ${streamLength}
>>
stream
${contentStream}
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000281 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
${350 + streamLength}
%%EOF`;

  return Buffer.from(pdfTemplate, 'utf8');
}

async function main() {
  const guiasDir = path.join(process.cwd(), "public", "guias");
  if (!fs.existsSync(guiasDir)) {
    fs.mkdirSync(guiasDir, { recursive: true });
  }

  const pdf1 = createValidPdfContent("Buenas Practicas en Agroindustria", [
    "Leccion 1: Preparacion y analisis del terreno antes de sembrar.",
    "Respuesta clave: El primer paso obligatorio antes de sembrar es PREPARAR Y ANALIZAR EL TERRENO.",
    " ",
    "Leccion 2: Manejo integrado y control temprano de plagas.",
    "Respuesta clave: Para el control temprano de plagas se recomienda IDENTIFICARLAS A TIEMPO",
    "y aplicar metodos de control natural en lugar de quimicos agresivos.",
    " ",
    "Leccion 3: Cosecha, almacenamiento y conservacion de calidad.",
    "Respuesta clave: Conservar los productos en lugares secos y ventilados para evitar la humedad."
  ]);

  fs.writeFileSync(path.join(guiasDir, "guia-buenas-practicas-agroindustria.pdf"), pdf1);
  fs.writeFileSync(path.join(guiasDir, "leccion-1-preparacion-terreno.pdf"), pdf1);
  fs.writeFileSync(path.join(guiasDir, "leccion-2-manejo-plagas.pdf"), pdf1);
  fs.writeFileSync(path.join(guiasDir, "leccion-3-cosecha-almacenamiento.pdf"), pdf1);

  console.log("Archivos PDF generados con éxito en public/guias/");
}

main().catch(console.error);
