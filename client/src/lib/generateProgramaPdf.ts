import jsPDF from "jspdf";

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface DiaPrograma {
  numero: number;
  titulo: string;
  descripcion?: string | null;
  versiculoRef?: string | null;
  versiculoTexto?: string | null;
  reflexion?: string | null;
  actividadTitulo?: string | null;
  actividadDescripcion?: string | null;
  ayunoDescripcion?: string | null;
  lecturas?: string[] | null;
}

interface Programa {
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  color?: string | null;
  duracion?: string | null;
  nivel?: string | null;
  version?: string | null;
  totalDias?: number | null;
}

// ── Colores estilo devocional ──────────────────────────────────────────────────
const C = {
  gold: "#8B7332",        // dorado para bordes y acentos
  goldLight: "#C4A855",   // dorado claro para detalles
  goldRef: "#9E7C30",     // dorado para referencia bíblica
  title: "#2C2418",       // marrón oscuro para títulos
  body: "#3A3228",        // texto principal
  gray: "#5A5040",        // gris cálido
  light: "#8A7E6E",       // gris claro cálido
  verseBg: "#FFFFFF",     // fondo del versículo (blanco)
  actBg: "#FFFFFF",       // fondo actividad (blanco)
  ayunoBg: "#FFFFFF",     // fondo ayuno (blanco)
  border: "#B8A67A",      // borde dorado
  borderLight: "#D4C9A8", // borde claro
  white: "#FFFFFF",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function setColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

function setDrawColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

function setFillColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

function wrap(doc: jsPDF, text: string, maxW: number): string[] {
  return doc.splitTextToSize(text, maxW);
}

// ── Layout ─────────────────────────────────────────────────────────────────────
const M = 16;  // margin
const LH = 5.7;  // line height body
const IN = 20; // inner padding from border

// ── Ornamental border ──────────────────────────────────────────────────────────
function ornamentalBorder(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const b = 8; // border offset

  // Outer rect
  setDrawColor(doc, C.border);
  doc.setLineWidth(0.8);
  doc.rect(b, b, w - b * 2, h - b * 2);

  // Inner rect
  setDrawColor(doc, C.borderLight);
  doc.setLineWidth(0.3);
  doc.rect(b + 3, b + 3, w - (b + 3) * 2, h - (b + 3) * 2);

  // Corner decorations (small L-shapes)
  const cn = 8; // corner length
  const ci = b + 3; // inner offset
  setDrawColor(doc, C.gold);
  doc.setLineWidth(0.6);
  // Top-left
  doc.line(ci - 1, ci + cn, ci - 1, ci - 1); doc.line(ci - 1, ci - 1, ci + cn, ci - 1);
  // Top-right
  doc.line(w - ci + 1, ci - 1, w - ci - cn, ci - 1); doc.line(w - ci + 1, ci - 1, w - ci + 1, ci + cn);
  // Bottom-left
  doc.line(ci - 1, h - ci - cn, ci - 1, h - ci + 1); doc.line(ci - 1, h - ci + 1, ci + cn, h - ci + 1);
  // Bottom-right
  doc.line(w - ci + 1, h - ci - cn, w - ci + 1, h - ci + 1); doc.line(w - ci + 1, h - ci + 1, w - ci - cn, h - ci + 1);
}

function needPage(doc: jsPDF, y: number, space: number): number {
  if (y + space > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    ornamentalBorder(doc);
    return IN;
  }
  return y;
}

/** Renders wrapped body text, returns new y */
function bodyText(doc: jsPDF, text: string, x: number, y: number, maxW: number, opts?: { italic?: boolean; center?: boolean; fontSize?: number; color?: string }): number {
  const size = opts?.fontSize ?? 11;
  doc.setFontSize(size);
  doc.setFont("helvetica", opts?.italic ? "italic" : "normal");
  setColor(doc, opts?.color ?? C.body);
  const paragraphs = text.split("\n");
  for (const p of paragraphs) {
    if (!p.trim()) { y += 2; continue; }
    const lines = wrap(doc, p.trim(), maxW);
    for (const line of lines) {
      y = needPage(doc, y, LH);
      if (opts?.center) {
        doc.text(line, x, y, { align: "center" });
      } else {
        doc.text(line, x, y);
      }
      y += LH;
    }
  }
  return y;
}

// ── Section header (left-aligned with gold underline) ──────────────────────────
function sectionHeader(doc: jsPDF, y: number, title: string): number {
  y = needPage(doc, y, 12);
  setColor(doc, C.title);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, M, y);
  const tw = doc.getTextWidth(title);
  y += 1.5;
  setDrawColor(doc, C.gold);
  doc.setLineWidth(0.5);
  doc.line(M, y, M + tw + 4, y);
  return y + 4;
}

// ── Cover ──────────────────────────────────────────────────────────────────────
function drawCover(doc: jsPDF, prog: Programa) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  ornamentalBorder(doc);

  // Cream background
  // (white page is fine, border gives the look)

  let y = h * 0.28;

  // Decorative small lines before title
  setDrawColor(doc, C.gold);
  doc.setLineWidth(0.5);
  doc.line(w / 2 - 30, y - 4, w / 2 + 30, y - 4);
  y += 6;

  // Title
  setColor(doc, C.title);
  doc.setFontSize(33);
  doc.setFont("helvetica", "bold");
  const tLines = wrap(doc, prog.nombre.toUpperCase(), w - 60);
  for (const l of tLines) { doc.text(l, w / 2, y, { align: "center" }); y += 14; }

  y += 4;
  // Decorative divider
  setDrawColor(doc, C.gold);
  doc.setLineWidth(0.4);
  doc.line(w / 2 - 25, y, w / 2 - 6, y);
  setFillColor(doc, C.gold);
  doc.circle(w / 2, y, 1.2, "F");
  doc.line(w / 2 + 6, y, w / 2 + 25, y);
  y += 16;

  if (prog.descripcion) {
    setColor(doc, C.gray);
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    const dl = wrap(doc, prog.descripcion, w - 70);
    for (const l of dl) { doc.text(l, w / 2, y, { align: "center" }); y += 8; }
    y += 14;
  }

  const infos: string[] = [];
  if (prog.duracion) infos.push(prog.duracion);
  if (prog.totalDias) infos.push(`${prog.totalDias} días`);
  if (prog.nivel) infos.push(prog.nivel);
  if (infos.length) {
    setColor(doc, C.light);
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(infos.join("    |    "), w / 2, y, { align: "center" });
  }

  if (prog.version) {
    setColor(doc, C.light);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`v${prog.version}`, w / 2, h - 18, { align: "center" });
  }
}

// ── Day page ───────────────────────────────────────────────────────────────────
function drawDay(doc: jsPDF, dia: DiaPrograma) {
  const w = doc.internal.pageSize.getWidth();
  const cW = w - M * 2;
  ornamentalBorder(doc);

  let y = 22;

  // ── DÍA N with decorative lines on sides ──
  setColor(doc, C.gold);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const diaLabel = `DÍA ${dia.numero}`;
  const diaW = doc.getTextWidth(diaLabel);
  const cx = w / 2;
  setDrawColor(doc, C.goldLight);
  doc.setLineWidth(0.3);
  doc.line(cx - diaW / 2 - 18, y - 1, cx - diaW / 2 - 3, y - 1);
  doc.line(cx + diaW / 2 + 3, y - 1, cx + diaW / 2 + 18, y - 1);
  doc.text(diaLabel, cx, y, { align: "center" });
  y += 9;

  // ── Título grande ──
  setColor(doc, C.title);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const tl = wrap(doc, dia.titulo.toUpperCase(), cW - 10);
  for (const l of tl) { doc.text(l, cx, y, { align: "center" }); y += 8; }
  y += 4;

  // ── Descripción breve ──
  if (dia.descripcion) {
    setColor(doc, C.gray);
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const dl = wrap(doc, dia.descripcion, cW - 10);
    for (const l of dl) { doc.text(l, cx, y, { align: "center" }); y += 6; }
  }
  y += 6;

  // ── Versículo del Día (en caja con fondo) ──
  if (dia.versiculoTexto || dia.versiculoRef) {
    y = needPage(doc, y, 50);

    // Precalculate verse content height
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const verseLines = dia.versiculoTexto ? wrap(doc, `\u201C${dia.versiculoTexto}\u201D`, cW - 14) : [];
    const headerH = 9;
    const verseH = verseLines.length * 5.7;
    const refH = dia.versiculoRef ? 9 : 0;
    const boxPadTop = 7;
    const boxPadBot = 6;
    const totalBoxH = headerH + boxPadTop + verseH + refH + boxPadBot + 2;

    // Background rect
    setFillColor(doc, C.verseBg);
    setDrawColor(doc, C.borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, cW, totalBoxH, 3, 3, "FD");

    // Header
    const iy = y + boxPadTop;
    setColor(doc, C.title);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Versículo del Día", cx, iy, { align: "center" });
    let ty = iy + headerH;

    // Verse text centered
    if (dia.versiculoTexto) {
      setColor(doc, C.body);
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      for (const l of verseLines) {
        doc.text(l, cx, ty, { align: "center" });
        ty += 5.7;
      }
    }

    // Reference with small lines
    if (dia.versiculoRef) {
      ty += 1;
      setColor(doc, C.goldRef);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const refW = doc.getTextWidth(dia.versiculoRef);
      setDrawColor(doc, C.goldRef);
      doc.setLineWidth(0.3);
      doc.line(cx - refW / 2 - 12, ty - 1, cx - refW / 2 - 2, ty - 1);
      doc.line(cx + refW / 2 + 2, ty - 1, cx + refW / 2 + 12, ty - 1);
      doc.text(dia.versiculoRef, cx, ty, { align: "center" });
    }

    y += totalBoxH + 7;
  }

  // ── Reflexión ──
  if (dia.reflexion) {
    y = sectionHeader(doc, y, "Reflexión");
    y = bodyText(doc, dia.reflexion, M, y, cW, { fontSize: 11 });
    y += 7;
  }

  // ── Actividad del Día (en caja con fondo) ──
  if (dia.actividadTitulo || dia.actividadDescripcion) {
    y = needPage(doc, y, 35);

    // Precalculate height
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const actTitleH = dia.actividadTitulo ? 8 : 0;
    const actDescLines = dia.actividadDescripcion ? wrap(doc, dia.actividadDescripcion, cW - 14) : [];
    const actDescH = actDescLines.length * 5.7;
    const boxPad = 7;
    const headerH = 11;
    const actBoxH = boxPad + headerH + actTitleH + actDescH + boxPad + 2;

    // Background rect
    setFillColor(doc, C.actBg);
    setDrawColor(doc, C.borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, cW, actBoxH, 3, 3, "FD");

    let ay = y + boxPad;

    // Section header inside box
    setColor(doc, C.title);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Actividad del Día", M + 8, ay);
    const actHw = doc.getTextWidth("Actividad del Día");
    ay += 1.5;
    setDrawColor(doc, C.gold);
    doc.setLineWidth(0.4);
    doc.line(M + 8, ay, M + 8 + actHw + 4, ay);
    ay += headerH - 2;

    // Activity title
    if (dia.actividadTitulo) {
      setColor(doc, C.body);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`• ${dia.actividadTitulo}`, M + 8, ay);
      ay += actTitleH;
    }

    // Activity description
    if (dia.actividadDescripcion) {
      setColor(doc, C.body);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      for (const l of actDescLines) {
        doc.text(l, M + 8, ay);
        ay += 5.7;
      }
    }

    y += actBoxH + 7;
  }

  // ── Ayuno del Día (en caja con fondo beige) ──
  if (dia.ayunoDescripcion) {
    y = needPage(doc, y, 35);

    // Precalculate
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const ayunoLines = wrap(doc, dia.ayunoDescripcion, cW - 14);
    const boxPad = 7;
    const headerH = 11;
    const ayunoBoxH = boxPad + headerH + (ayunoLines.length * 5.7) + boxPad + 2;

    // Background rect
    setFillColor(doc, C.ayunoBg);
    setDrawColor(doc, C.borderLight);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, cW, ayunoBoxH, 3, 3, "FD");

    let fy = y + boxPad;

    // Section header inside box
    setColor(doc, C.title);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("Ayuno del Día", M + 8, fy);
    const ayHw = doc.getTextWidth("Ayuno del Día");
    fy += 1.5;
    setDrawColor(doc, C.gold);
    doc.setLineWidth(0.4);
    doc.line(M + 8, fy, M + 8 + ayHw + 4, fy);
    fy += headerH - 2;

    // Content
    setColor(doc, C.body);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    for (const l of ayunoLines) {
      doc.text(l, M + 8, fy);
      fy += 5.7;
    }

    y += ayunoBoxH + 7;
  }

  // ── Lecturas ──
  if (dia.lecturas && dia.lecturas.length > 0) {
    y = sectionHeader(doc, y, "Lecturas");

    setColor(doc, C.body);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    for (const lectura of dia.lecturas) {
      if (!lectura) continue;
      y = needPage(doc, y, LH);
      doc.text(`•  ${lectura}`, M + 4, y);
      y += LH;
    }
    y += 5;
  }

  // ── Page footer ──
  const ph = doc.internal.pageSize.getHeight();
  setColor(doc, C.light);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(`— Día ${dia.numero} —`, cx, ph - 14, { align: "center" });
}

// ── Main export ────────────────────────────────────────────────────────────────
export async function generateProgramaPdf(
  programa: Programa,
  dias: DiaPrograma[],
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const sorted = [...dias].sort((a, b) => a.numero - b.numero);

  drawCover(doc, programa);

  for (const dia of sorted) {
    doc.addPage();
    drawDay(doc, dia);
  }

  const filename = `${programa.nombre.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, "").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
