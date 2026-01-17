/**
 * Analysis PDF Export using hybrid html2canvas + jsPDF
 * Captures the rendered DOM for high-fidelity output
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export an analysis page to PDF by capturing the rendered content
 * @param containerRef - Reference to the content container element
 * @param fileName - Name for the downloaded PDF file
 */
export async function exportAnalysisPdf(
  containerRef: HTMLElement,
  fileName: string
): Promise<void> {
  // Set print mode to disable all animations
  document.body.setAttribute('data-printing', 'true');
  
  // Allow time for animations to fully stop and content to stabilize
  await new Promise(r => setTimeout(r, 200));
  
  try {
    // Capture with high resolution settings
    const canvas = await html2canvas(containerRef, {
      scale: 3, // High DPI for crisp output
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#09380e', // Match site dark green background
      imageTimeout: 15000, // Wait longer for images to load
      onclone: (clonedDoc) => {
        // Ensure cloned content is fully visible and expanded
        const clonedElement = clonedDoc.querySelector('[data-pdf-content]');
        if (clonedElement) {
          const el = clonedElement as HTMLElement;
          el.style.overflow = 'visible';
          el.style.height = 'auto';
        }
        
        // Force all expandable sections to be visible
        const expandables = clonedDoc.querySelectorAll('[data-expandable]');
        expandables.forEach((section) => {
          const el = section as HTMLElement;
          el.style.display = 'block';
          el.style.overflow = 'visible';
          el.style.height = 'auto';
          el.style.maxHeight = 'none';
        });
        
        // Hide elements marked for hiding during print
        const hideElements = clonedDoc.querySelectorAll('[data-hide-print]');
        hideElements.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      }
    });
    
    // Calculate PDF dimensions from canvas
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF with appropriate orientation
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add subsequent pages if content exceeds one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(fileName);
  } finally {
    // Always remove print mode attribute
    document.body.removeAttribute('data-printing');
  }
}
