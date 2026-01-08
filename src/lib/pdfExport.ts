/**
 * PDF Export utilities for signature contracts
 * Handles overlaying signatures onto PDF documents
 */

import { jsPDF } from 'jspdf';

interface SignatureField {
  id: string;
  field_type: string;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  signer_party: string;
}

interface FieldValue {
  fieldId: string;
  value: string;
  type: string;
}

interface ExportOptions {
  pdfUrl: string;
  fields: SignatureField[];
  ownerFieldValues: Record<string, FieldValue>;
  counterpartyFieldValues: Record<string, FieldValue>;
  pageImages: string[]; // Base64 encoded page images
}

/**
 * Export a signed PDF with all signatures overlaid
 */
export async function exportSignedPdf(options: ExportOptions): Promise<Blob> {
  const { fields, ownerFieldValues, counterpartyFieldValues, pageImages } = options;
  
  if (pageImages.length === 0) {
    throw new Error('No page images provided');
  }

  // Create new PDF with the same dimensions as the first page
  const firstImage = new Image();
  await new Promise<void>((resolve, reject) => {
    firstImage.onload = () => resolve();
    firstImage.onerror = reject;
    firstImage.src = pageImages[0];
  });

  const aspectRatio = firstImage.height / firstImage.width;
  const pdfWidth = 210; // A4 width in mm
  const pdfHeight = pdfWidth * aspectRatio;

  const pdf = new jsPDF({
    orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
  });

  // Process each page
  for (let pageIndex = 0; pageIndex < pageImages.length; pageIndex++) {
    if (pageIndex > 0) {
      pdf.addPage([pdfWidth, pdfHeight]);
    }

    // Add the page image as background
    pdf.addImage(pageImages[pageIndex], 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Get fields for this page
    const pageFields = fields.filter(f => f.page_number === pageIndex + 1);

    // Overlay field values
    for (const field of pageFields) {
      const ownerValue = ownerFieldValues[field.id];
      const counterpartyValue = counterpartyFieldValues[field.id];
      const value = ownerValue || counterpartyValue;

      if (!value) continue;

      // Convert positions from percentage to mm
      const xMm = (field.x_position / 100) * pdfWidth;
      const yMm = (field.y_position / 100) * pdfHeight;
      const widthMm = (field.width / 100) * pdfWidth;
      const heightMm = (field.height / 100) * pdfHeight;

      if (value.type === 'signature' || value.type === 'initial') {
        // Add signature image
        if (value.value.startsWith('data:image')) {
          try {
            pdf.addImage(value.value, 'PNG', xMm, yMm, widthMm, heightMm);
          } catch (error) {
            console.error('Failed to add signature image:', error);
          }
        }
      } else if (value.type === 'date') {
        // Add date text
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(value.value, xMm + 2, yMm + heightMm / 2 + 2);
      } else if (value.type === 'text') {
        // Add text
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(value.value, xMm + 2, yMm + heightMm / 2 + 2);
      } else if (value.type === 'checkbox') {
        // Draw checkbox
        if (value.value === 'true') {
          pdf.setDrawColor(0, 0, 0);
          pdf.setFillColor(0, 0, 0);
          pdf.rect(xMm, yMm, Math.min(widthMm, heightMm), Math.min(widthMm, heightMm), 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(14);
          pdf.text('✓', xMm + 2, yMm + Math.min(widthMm, heightMm) - 2);
        }
      }
    }
  }

  return pdf.output('blob');
}

/**
 * Convert a PDF page to an image using canvas
 */
export async function pdfPageToImage(
  pdfDocument: any,
  pageNumber: number,
  scale: number = 2
): Promise<string> {
  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to get canvas context');
  }

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toDataURL('image/png');
}

/**
 * Upload completed PDF to storage
 */
export async function uploadCompletedPdf(
  supabase: any,
  contractId: string,
  pdfBlob: Blob
): Promise<string> {
  const fileName = `completed/${contractId}_${Date.now()}.pdf`;
  
  const { error: uploadError } = await supabase.storage
    .from('signature-contracts')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('signature-contracts')
    .getPublicUrl(fileName);

  return publicUrl;
}