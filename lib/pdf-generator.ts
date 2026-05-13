'use client';

import jsPDF from 'jspdf';

export interface QuoteData {
  clientName: string;
  clientPhone: string;
  countrCode: string;
  currencySymbol: string;
  concept: string;
  workAmount: number;
  materialsAmount: number;
  depositAmount: number;
  totalAmount: number;
  balanceAmount: number;
  createdAt?: Date;
}

/**
 * Formatea una cantidad numérica con símbolo de divisa y separadores de miles
 * Utiliza la localización es-MX para separadores decimales y miles españoles
 */
function formatAmount(symbol: string, value: number) {
  return `${symbol}${new Intl.NumberFormat('es-MX').format(value)}`;
}

/**
 * Divide un texto en múltiples líneas según el ancho máximo permitido
 * Útil para ajustar descripciones largas en el PDF
 */
/**
 * Dibuja un título de sección con fondo azul y texto blanco
 * Proporciona consistencia visual en las secciones del presupuesto
 */
function splitText(pdf: jsPDF, text: string, maxWidth: number) {
  return pdf.splitTextToSize(text, maxWidth) as string[];
}

function addSectionTitle(pdf: jsPDF, title: string, x: number, y: number) {
  pdf.setFillColor(14, 165, 233);
  pdf.roundedRect(x, y - 4, 58, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
/**
 * Carga una imagen como data URL (base64)
 * Permite que jsPDF acceda a la imagen sin requerir CORS complejo
 */
  pdf.setFontSize(10);
  pdf.text(title.toUpperCase(), x + 4, y + 1);
}

async function loadImageAsDataUrl(src: string): Promise<string> {
  const response = await fetch(src);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Unable to read image: ${src}`));
/**
 * Carga una imagen y la transforma en un logo circular
 * Utiliza Canvas API para crear un recorte circular con fondo blanco
 * Esta técnica es más confiable que dependencias de procesamiento de imágenes
 */
    reader.readAsDataURL(blob);
  });
}

async function loadCircularLogoAsDataUrl(src: string): Promise<string> {
  const dataUrl = await loadImageAsDataUrl(src);
  
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 120; // size for circular logo
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        
        // Create circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw image centered in circle
        const imageSize = Math.max(img.width, img.height);
        const scale = size / imageSize;
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Convert to data URL
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not convert canvas to blob'));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Could not read canvas blob'));
          reader.readAsDataURL(blob);
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = dataUrl;
  });
}

/**
 * Genera un PDF profesional con el presupuesto sin depender del render HTML.
 */
export async function generateQuotePDF(data: QuoteData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, 12, contentWidth, 40, 5, 5, 'F');
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(margin, 12, contentWidth, 40, 5, 5, 'S');

  try {
    const logoDataUrl = await loadCircularLogoAsDataUrl('/images/presuclic-logo.png');
    // Draw circular logo at the top left
    pdf.addImage(logoDataUrl, 'PNG', margin + 3, 15, 28, 28);
  } catch (error) {
    pdf.setFillColor(14, 165, 233);
    pdf.circle(margin + 17, 29, 11, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('PC', margin + 17, 32.5, { align: 'center' });
  }

  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text('PRESUPUESTO', margin + 33, 25);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Documento profesional generado por PresuClic', margin + 33, 31);
  pdf.setTextColor(14, 165, 233);
  pdf.setFont('helvetica', 'bold');
  pdf.text(dateStr, pageWidth - margin - 4, 23, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  pdf.text('Cotización personalizada', pageWidth - margin - 4, 29, { align: 'right' });

  let cursorY = 48;

  addSectionTitle(pdf, 'Cliente', margin, cursorY);
  cursorY += 8;
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text(data.clientName || 'Cliente', margin, cursorY);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  cursorY += 6;
  pdf.text(`Teléfono: ${data.clientPhone || 'Sin teléfono'}`, margin, cursorY);
  cursorY += 6;
  pdf.text(`Fecha de emisión: ${dateStr}`, margin, cursorY);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Moneda: ${data.currencySymbol}`, pageWidth - margin, cursorY, { align: 'right' });

  cursorY += 12;
  addSectionTitle(pdf, 'Trabajo', margin, cursorY);
  cursorY += 8;
  pdf.setFillColor(240, 249, 255);
  pdf.roundedRect(margin, cursorY, contentWidth, 22, 3, 3, 'F');
  pdf.setDrawColor(186, 230, 253);
  pdf.roundedRect(margin, cursorY, contentWidth, 22, 3, 3, 'S');
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const conceptLines = splitText(pdf, data.concept || 'Sin concepto especificado', contentWidth - 8);
  pdf.text(conceptLines, margin + 4, cursorY + 6);
  pdf.setTextColor(14, 165, 233);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Concepto del trabajo', margin + 4, cursorY + 2.5);

  cursorY += 30;
  addSectionTitle(pdf, 'Desglose', margin, cursorY);
  cursorY += 8;

  const rows: Array<[string, string, boolean, boolean]> = [
    ['Mano de obra', formatAmount(data.currencySymbol, data.workAmount), false, false],
    ['Materiales', formatAmount(data.currencySymbol, data.materialsAmount), false, false],
    ['Subtotal', formatAmount(data.currencySymbol, data.workAmount + data.materialsAmount), true, false],
    ['Anticipo', formatAmount(data.currencySymbol, data.depositAmount), false, false],
    ['Saldo a pagar', formatAmount(data.currencySymbol, data.balanceAmount), true, true],
  ];

  const rowHeight = 10;
  const leftColWidth = contentWidth * 0.64;
  const rightColWidth = contentWidth - leftColWidth;

  rows.forEach(([label, value, isBold, isHighlight]) => {
    pdf.setFillColor(isHighlight ? 14 : isBold ? 239 : 255, isHighlight ? 165 : isBold ? 247 : 255, isHighlight ? 233 : isBold ? 250 : 255);
    pdf.setDrawColor(isHighlight ? 14 : 203, isHighlight ? 165 : 213, isHighlight ? 233 : 225);
    pdf.roundedRect(margin, cursorY, contentWidth, rowHeight, 2, 2, 'FD');
    pdf.setTextColor(isHighlight ? 255 : 30, isHighlight ? 255 : 41, isHighlight ? 255 : 59);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setFontSize(isHighlight ? 11 : 10);
    pdf.text(label, margin + 4, cursorY + 6.5);
    pdf.text(value, margin + leftColWidth + rightColWidth - 4, cursorY + 6.5, { align: 'right' });
    cursorY += rowHeight + 2;
  });

  cursorY += 5;
  pdf.setFillColor(236, 240, 241);
  pdf.roundedRect(margin, cursorY, contentWidth, 18, 3, 3, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin, cursorY, contentWidth, 18, 3, 3, 'S');
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Total presupuesto:', margin + 4, cursorY + 7);
  pdf.text(formatAmount(data.currencySymbol, data.totalAmount), pageWidth - margin - 4, cursorY + 7, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Presupuesto generado por PresuClic`, margin + 4, cursorY + 13);

  const footerY = pageHeight - 14;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Este presupuesto es válido por 30 días', margin, footerY - 3);
  pdf.text('PresuClic', pageWidth - margin, footerY - 3, { align: 'right' });

  return pdf.output('blob');
}

/**
 * Descarga el PDF al dispositivo del usuario
 */
export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
