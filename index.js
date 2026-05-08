const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { marked } = require('marked');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

let INPUT_FILE = '';
let OUTPUT_FILE = '';

const argFile = process.argv[2];

if (argFile) {
  // Si pasan nombre, lo buscamos en input/
  const checkPath = path.join(inputDir, argFile);
  if (fs.existsSync(checkPath)) {
    INPUT_FILE = checkPath;
  } else if (fs.existsSync(path.resolve(argFile))) {
    INPUT_FILE = path.resolve(argFile);
  } else {
    console.error(`Error: No se encontró el archivo especificado: ${argFile}`);
    process.exit(1);
  }
} else {
  // Si no pasan nombre, buscar cualquier .md en input/
  if (fs.existsSync(inputDir)) {
    const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.md'));
    if (files.length > 0) {
      INPUT_FILE = path.join(inputDir, files[0]);
    }
  }
}

if (!INPUT_FILE || !fs.existsSync(INPUT_FILE)) {
  console.error("No se encontró ningún archivo Markdown de entrada en la carpeta 'input'.");
  console.log("Por favor, crea un archivo .md en la carpeta 'input' o pasa el nombre como parámetro.");
  process.exit(1);
}

const baseName = path.basename(INPUT_FILE, path.extname(INPUT_FILE));
OUTPUT_FILE = path.join(outputDir, `${baseName}.pptx`);

const C = {
  darkBg: "1A2335",
  light: "FFFFFF",
  lightGray: "F0F4F8",
  textDark: "1A2335",
  textMid: "4A5568",
  accent: "F97316"
};

async function buildPPT() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`No se encontró el archivo de entrada: ${INPUT_FILE}`);
    console.log("Por favor, crea un archivo presentacion.md en la carpeta 'input'.");
    process.exit(1);
  }

  const markdownContent = fs.readFileSync(INPUT_FILE, 'utf-8');
  const slides = markdownContent.split(/\n---\n/); // Split by markdown horizontal rule

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";

  for (let i = 0; i < slides.length; i++) {
    const slideText = slides[i].trim();
    if (!slideText) continue;

    // Analizamos los bloques con marked lexer
    const tokens = marked.lexer(slideText);

    let isSectionDivider = false;
    let isCover = (i === 0);

    // Simple heuristic: si el slide tiene un gran Heading 1 y solo 1 Heading 2, podría ser un divisor.
    let h1Tokens = tokens.filter(t => t.type === 'heading' && t.depth === 1);
    let h2Tokens = tokens.filter(t => t.type === 'heading' && t.depth === 2);

    if (h1Tokens.length > 0 && h2Tokens.length > 0 && tokens.length <= 4 && !isCover) {
      isSectionDivider = true;
    }

    if (isCover) {
      const sl = pres.addSlide();
      sl.background = { color: C.darkBg };
      sl.addShape("rect", { x: 0, y: 0, w: 0.35, h: 5.625, fill: { color: C.accent } });
      
      let currentY = 1.65;
      for (const token of tokens) {
        if (token.type === 'heading' && token.depth === 1) {
          sl.addText(token.text, { x: 0.75, y: currentY, w: 8.8, h: 1.5, fontFace: "Calibri", fontSize: 36, bold: true, color: C.light });
          currentY += 1.6;
        } else if (token.type === 'paragraph') {
          sl.addText(token.text, { x: 0.75, y: currentY, w: 8.5, h: 0.45, fontFace: "Calibri", fontSize: 14, color: C.accent });
          currentY += 0.5;
        }
      }
    } else if (isSectionDivider) {
      const sl = pres.addSlide();
      sl.background = { color: C.darkBg };
      const num = h1Tokens[0].text;
      const label = h2Tokens[0].text;
      
      sl.addText(num, { x: 0.6, y: 1.5, w: 2, h: 1.5, fontFace: "Calibri", fontSize: 96, bold: true, color: C.accent });
      sl.addText(label, { x: 0.6, y: 3.0, w: 8.8, h: 1.2, fontFace: "Calibri", fontSize: 36, bold: true, color: C.light });
      sl.addShape("rect", { x: 0.6, y: 2.9, w: 3.5, h: 0.07, fill: { color: C.accent } });
    } else {
      // Normal Slide
      const sl = pres.addSlide();
      sl.background = { color: C.lightGray };
      
      let titleAdded = false;
      let currentY = 1.1;

      for (const token of tokens) {
        if (token.type === 'heading' && token.depth === 2 && !titleAdded) {
          // Slide Title
          sl.addShape("rect", { x: 0.45, y: 0.28, w: 0.07, h: 0.52, fill: { color: C.accent } });
          sl.addText(token.text, { x: 0.60, y: 0.28, w: 9.0, h: 0.55, fontFace: "Calibri", fontSize: 24, bold: true, color: C.textDark });
          titleAdded = true;
        } else if (token.type === 'heading' && token.depth === 3) {
          // Subtitles / Card titles
          sl.addText(token.text, { x: 0.45, y: currentY, w: 9.0, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: true, color: C.accent });
          currentY += 0.5;
        } else if (token.type === 'paragraph') {
          sl.addText(token.text, { x: 0.45, y: currentY, w: 9.0, h: 1.0, fontFace: "Calibri", fontSize: 14, color: C.textMid, valign: "top" });
          currentY += 1.1;
        } else if (token.type === 'list') {
          const listItems = token.items.map(i => ({ text: i.text, options: { bullet: true } }));
          sl.addText(listItems, { x: 0.55, y: currentY, w: 8.9, h: 2.0, fontFace: "Calibri", fontSize: 13, color: C.textMid, valign: "top" });
          currentY += 2.2; // Aprox
        }
      }
    }
  }

  await pres.writeFile({ fileName: OUTPUT_FILE });
  console.log(`Presentación generada exitosamente en ${OUTPUT_FILE}`);
}

buildPPT().catch(console.error);
