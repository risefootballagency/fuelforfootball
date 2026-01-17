/**
 * Analysis PDF Export using pure jsPDF programmatic rendering
 * Builds the PDF section by section with proper font handling
 */

import { jsPDF } from 'jspdf';

// Brand colors
const BRAND = {
  gold: [253, 198, 27] as [number, number, number],
  darkGreen: [9, 56, 14] as [number, number, number],
  contentBg: [199, 212, 202] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
};

// Page constants (A4 in mm)
const PAGE = {
  width: 210,
  height: 297,
  margin: 15,
  contentWidth: 180, // 210 - 2*15
};

interface AnalysisData {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  playerName: string;
  playerTeam: string | null;
  keyDetails: string;
  oppositionStrengths: string;
  oppositionWeaknesses: string;
  matchups: { name?: string; number?: string; notes?: string; image_url?: string }[];
  scheme: {
    title: string;
    formation: string;
    paragraphs: string[];
  };
  points: { title: string; description?: string; image_url?: string; video_url?: string }[];
  strengthsImprovements: string;
  matchImageUrl: string | null;
  homeScore: number | null;
  awayScore: number | null;
}

/**
 * Export analysis data to a styled PDF
 */
export async function exportAnalysisPdf(
  analysis: AnalysisData,
  fileName: string
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let y = PAGE.margin;

  // Helper functions
  const checkPageBreak = (neededHeight: number): void => {
    if (y + neededHeight > PAGE.height - PAGE.margin) {
      pdf.addPage();
      y = PAGE.margin;
      // Add page background
      pdf.setFillColor(...BRAND.darkGreen);
      pdf.rect(0, 0, PAGE.width, PAGE.height, 'F');
    }
  };

  const addSectionTitle = (title: string): void => {
    checkPageBreak(20);
    
    // Gold background bar
    pdf.setFillColor(...BRAND.gold);
    pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, 10, 2, 2, 'F');
    
    // Title text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(...BRAND.black);
    pdf.text(title.toUpperCase(), PAGE.width / 2, y + 7, { align: 'center' });
    
    y += 14;
  };

  const addParagraph = (text: string, indent = 0): void => {
    if (!text || !text.trim()) return;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...BRAND.black);
    
    const lines = pdf.splitTextToSize(text, PAGE.contentWidth - indent);
    
    for (const line of lines) {
      checkPageBreak(6);
      pdf.text(line, PAGE.margin + indent, y);
      y += 5;
    }
    y += 2;
  };

  const addBulletPoint = (text: string, icon: '+' | '-'): void => {
    if (!text || !text.trim()) return;
    
    checkPageBreak(8);
    
    // Gold circle with icon
    pdf.setFillColor(...BRAND.gold);
    pdf.circle(PAGE.margin + 4, y - 1, 3, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...BRAND.black);
    pdf.text(icon, PAGE.margin + 4, y, { align: 'center' });
    
    // Bullet text
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(text, PAGE.contentWidth - 12);
    
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) checkPageBreak(5);
      pdf.text(lines[i], PAGE.margin + 10, y);
      y += 5;
    }
    y += 2;
  };

  // ==================
  // START BUILDING PDF
  // ==================

  // Page 1 background
  pdf.setFillColor(...BRAND.darkGreen);
  pdf.rect(0, 0, PAGE.width, PAGE.height, 'F');

  // ---- HEADER SECTION ----
  // Title bar
  pdf.setFillColor(...BRAND.gold);
  pdf.rect(0, 0, PAGE.width, 25, 'F');

  // Match title
  const matchTitle = `${analysis.homeTeam || 'Home'} vs ${analysis.awayTeam || 'Away'}`;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(...BRAND.black);
  pdf.text(matchTitle.toUpperCase(), PAGE.width / 2, 12, { align: 'center' });

  // Score if available
  if (analysis.homeScore !== null && analysis.awayScore !== null) {
    pdf.setFontSize(12);
    pdf.text(`${analysis.homeScore} - ${analysis.awayScore}`, PAGE.width / 2, 20, { align: 'center' });
  } else if (analysis.matchDate) {
    pdf.setFontSize(10);
    pdf.text(analysis.matchDate, PAGE.width / 2, 20, { align: 'center' });
  }

  y = 30;

  // Player name box
  if (analysis.playerName) {
    checkPageBreak(15);
    
    // Centered oval-ish box
    const playerNameWidth = Math.min(pdf.getTextWidth(analysis.playerName.toUpperCase()) + 20, 100);
    const boxX = (PAGE.width - playerNameWidth) / 2;
    
    pdf.setFillColor(50, 70, 50);
    pdf.roundedRect(boxX, y, playerNameWidth, 10, 5, 5, 'F');
    
    pdf.setDrawColor(...BRAND.gold);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(boxX, y, playerNameWidth, 10, 5, 5, 'S');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...BRAND.white);
    pdf.text(analysis.playerName.toUpperCase(), PAGE.width / 2, y + 7, { align: 'center' });
    
    y += 18;
  }

  // ---- OVERVIEW SECTION ----
  if (analysis.keyDetails && analysis.keyDetails.trim()) {
    // Content card background
    checkPageBreak(30);
    
    addSectionTitle('Overview');
    
    // Content box
    const overviewLines = pdf.splitTextToSize(analysis.keyDetails, PAGE.contentWidth - 8);
    const boxHeight = overviewLines.length * 5 + 8;
    
    pdf.setFillColor(...BRAND.contentBg);
    pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, boxHeight, 2, 2, 'F');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...BRAND.black);
    
    y += 6;
    for (const line of overviewLines) {
      checkPageBreak(6);
      pdf.text(line, PAGE.margin + 4, y);
      y += 5;
    }
    y += 6;
  }

  // ---- OPPOSITION STRENGTHS ----
  if (analysis.oppositionStrengths && analysis.oppositionStrengths.trim()) {
    addSectionTitle('Opposition Strengths');
    
    // Content box start
    const strengthLines = analysis.oppositionStrengths.split('\n').filter(l => l.trim());
    const boxStartY = y;
    
    pdf.setFillColor(...BRAND.contentBg);
    const estimatedHeight = strengthLines.length * 10 + 10;
    pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, estimatedHeight, 2, 2, 'F');
    
    y += 5;
    
    for (const line of strengthLines) {
      const cleanLine = line.trim().replace(/^[-•]\s*/, '');
      if (cleanLine) {
        addBulletPoint(cleanLine, '+');
      }
    }
    y += 5;
  }

  // ---- OPPOSITION WEAKNESSES ----
  if (analysis.oppositionWeaknesses && analysis.oppositionWeaknesses.trim()) {
    addSectionTitle('Opposition Weaknesses');
    
    const weaknessLines = analysis.oppositionWeaknesses.split('\n').filter(l => l.trim());
    
    pdf.setFillColor(...BRAND.contentBg);
    const estimatedHeight = weaknessLines.length * 10 + 10;
    pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, estimatedHeight, 2, 2, 'F');
    
    y += 5;
    
    for (const line of weaknessLines) {
      const cleanLine = line.trim().replace(/^[-•]\s*/, '');
      if (cleanLine) {
        addBulletPoint(cleanLine, '-');
      }
    }
    y += 5;
  }

  // ---- MATCHUPS ----
  if (analysis.matchups && analysis.matchups.length > 0) {
    addSectionTitle('Potential Matchups');
    
    for (const matchup of analysis.matchups) {
      checkPageBreak(25);
      
      // Matchup card
      pdf.setFillColor(...BRAND.contentBg);
      pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, 20, 2, 2, 'F');
      
      // Name and number
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(...BRAND.black);
      
      const displayName = matchup.name?.toUpperCase() || 'PLAYER';
      const displayNumber = matchup.number ? ` #${matchup.number}` : '';
      pdf.text(`${displayName}${displayNumber}`, PAGE.margin + 5, y + 8);
      
      // Notes
      if (matchup.notes) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(9);
        const noteLines = pdf.splitTextToSize(matchup.notes, PAGE.contentWidth - 10);
        pdf.text(noteLines[0] || '', PAGE.margin + 5, y + 15);
      }
      
      y += 24;
    }
    y += 5;
  }

  // ---- SCHEME ----
  if (analysis.scheme.title || analysis.scheme.formation || analysis.scheme.paragraphs.length > 0) {
    addSectionTitle('Scheme');
    
    checkPageBreak(20);
    
    // Formation badge
    if (analysis.scheme.formation) {
      pdf.setFillColor(...BRAND.black);
      pdf.roundedRect(PAGE.margin, y, 40, 8, 1, 1, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(...BRAND.gold);
      pdf.text(analysis.scheme.formation, PAGE.margin + 20, y + 5.5, { align: 'center' });
      
      y += 12;
    }
    
    // Scheme title
    if (analysis.scheme.title) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(...BRAND.white);
      pdf.text(analysis.scheme.title.toUpperCase(), PAGE.margin, y);
      y += 8;
    }
    
    // Paragraphs
    pdf.setTextColor(...BRAND.white);
    for (const para of analysis.scheme.paragraphs) {
      if (para && para.trim()) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(para, PAGE.contentWidth);
        for (const line of lines) {
          checkPageBreak(6);
          pdf.text(line, PAGE.margin, y);
          y += 5;
        }
        y += 3;
      }
    }
    y += 5;
  }

  // ---- IMPROVEMENTS ----
  if (analysis.strengthsImprovements && analysis.strengthsImprovements.trim()) {
    addSectionTitle('Strengths & Improvements');
    
    pdf.setFillColor(...BRAND.contentBg);
    const lines = pdf.splitTextToSize(analysis.strengthsImprovements, PAGE.contentWidth - 8);
    const boxHeight = lines.length * 5 + 8;
    pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, boxHeight, 2, 2, 'F');
    
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...BRAND.black);
    
    for (const line of lines) {
      checkPageBreak(6);
      pdf.text(line, PAGE.margin + 4, y);
      y += 5;
    }
    y += 6;
  }

  // ---- ANALYSIS POINTS ----
  if (analysis.points && analysis.points.length > 0) {
    for (let i = 0; i < analysis.points.length; i++) {
      const point = analysis.points[i];
      
      addSectionTitle(point.title || `Point ${i + 1}`);
      
      if (point.description && point.description.trim()) {
        checkPageBreak(15);
        
        pdf.setFillColor(...BRAND.contentBg);
        const lines = pdf.splitTextToSize(point.description, PAGE.contentWidth - 8);
        const boxHeight = lines.length * 5 + 8;
        pdf.roundedRect(PAGE.margin, y, PAGE.contentWidth, boxHeight, 2, 2, 'F');
        
        y += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...BRAND.black);
        
        for (const line of lines) {
          checkPageBreak(6);
          pdf.text(line, PAGE.margin + 4, y);
          y += 5;
        }
        y += 6;
      }
    }
  }

  // ---- FOOTER ----
  checkPageBreak(20);
  y = PAGE.height - 20;
  
  pdf.setFillColor(...BRAND.gold);
  pdf.rect(0, y, PAGE.width, 20, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...BRAND.black);
  pdf.text('FUEL FOR FOOTBALL', PAGE.width / 2, y + 8, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Professional Football Analysis', PAGE.width / 2, y + 14, { align: 'center' });

  // Save PDF
  pdf.save(fileName);
}
