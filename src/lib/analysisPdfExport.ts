/**
 * Analysis PDF Export using direct jsPDF rendering
 * Programmatically builds PDF without DOM screenshot
 */

import { jsPDF } from 'jspdf';

// Brand colors
const BRAND = {
  gold: '#fdc61b',
  darkGreen: '#12571e',
  contentBg: '#c7d4ca',
  bodyText: '#000000',
  headerBg: '#0a2e12',
};

interface Analysis {
  id: string;
  analysis_type: string;
  title: string | null;
  home_team: string | null;
  away_team: string | null;
  home_score: number | null;
  away_score: number | null;
  match_date: string | null;
  home_team_logo: string | null;
  away_team_logo: string | null;
  home_team_bg_color: string | null;
  away_team_bg_color: string | null;
  player_team: string | null;
  key_details: string | null;
  opposition_strengths: string | null;
  opposition_weaknesses: string | null;
  matchups: any;
  scheme_title: string | null;
  scheme_paragraph_1: string | null;
  scheme_paragraph_2: string | null;
  scheme_image_url: string | null;
  player_image_url: string | null;
  match_image_url: string | null;
  strengths_improvements: string | null;
  concept: string | null;
  explanation: string | null;
  points: any;
  player_name: string | null;
  selected_scheme: string | null;
  starting_xi: any;
}

// Convert image URL to base64
async function imageToBase64(url: string): Promise<string | null> {
  try {
    // Handle relative URLs
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const response = await fetch(fullUrl, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load image:', url, error);
    return null;
  }
}

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

interface PdfState {
  pdf: jsPDF;
  yPosition: number;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
}

function checkPageBreak(state: PdfState, neededHeight: number): void {
  if (state.yPosition + neededHeight > state.pageHeight - 20) {
    state.pdf.addPage();
    state.yPosition = 20;
  }
}

function drawSectionHeader(state: PdfState, title: string): void {
  checkPageBreak(state, 20);
  
  // Gold background bar
  const rgb = hexToRgb(BRAND.gold);
  state.pdf.setFillColor(rgb.r, rgb.g, rgb.b);
  state.pdf.rect(state.margin, state.yPosition, state.contentWidth, 12, 'F');
  
  // Title text - centered, dark
  state.pdf.setFontSize(14);
  state.pdf.setTextColor(0, 0, 0);
  state.pdf.text(title.toUpperCase(), state.pageWidth / 2, state.yPosition + 8, { align: 'center' });
  
  state.yPosition += 16;
}

function drawParagraph(state: PdfState, text: string): void {
  if (!text) return;
  
  state.pdf.setFontSize(10);
  state.pdf.setTextColor(0, 0, 0);
  
  const lines = state.pdf.splitTextToSize(text, state.contentWidth - 10);
  const lineHeight = 5;
  const totalHeight = lines.length * lineHeight + 8;
  
  checkPageBreak(state, totalHeight);
  
  // Content background
  const rgb = hexToRgb(BRAND.contentBg);
  state.pdf.setFillColor(rgb.r, rgb.g, rgb.b);
  state.pdf.rect(state.margin, state.yPosition, state.contentWidth, totalHeight, 'F');
  
  // Text
  state.pdf.text(lines, state.margin + 5, state.yPosition + 6);
  
  state.yPosition += totalHeight + 4;
}

async function drawImage(state: PdfState, imageUrl: string, maxHeight: number = 60): Promise<void> {
  const base64 = await imageToBase64(imageUrl);
  if (!base64) return;
  
  try {
    // Load image to get dimensions
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = base64;
    });
    
    const aspectRatio = img.width / img.height;
    let imgWidth = state.contentWidth - 20;
    let imgHeight = imgWidth / aspectRatio;
    
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = imgHeight * aspectRatio;
    }
    
    checkPageBreak(state, imgHeight + 10);
    
    const xPos = state.margin + (state.contentWidth - imgWidth) / 2;
    state.pdf.addImage(base64, 'JPEG', xPos, state.yPosition, imgWidth, imgHeight);
    
    state.yPosition += imgHeight + 8;
  } catch (error) {
    console.error('Failed to draw image:', error);
  }
}

export async function exportAnalysisPdf(analysis: Analysis): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const state: PdfState = {
    pdf,
    yPosition: 10,
    pageWidth: 210,
    pageHeight: 297,
    margin: 10,
    contentWidth: 190,
  };
  
  const isPostMatch = analysis.analysis_type === 'post-match';
  const isPreMatch = analysis.analysis_type === 'pre-match';
  const isConcept = analysis.analysis_type === 'concept';
  
  // ===== HEADER SECTION =====
  
  // Dark green header background
  const headerRgb = hexToRgb(BRAND.headerBg);
  pdf.setFillColor(headerRgb.r, headerRgb.g, headerRgb.b);
  pdf.rect(0, 0, state.pageWidth, 50, 'F');
  
  // Title
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('FUEL FOR FOOTBALL', state.pageWidth / 2, 15, { align: 'center' });
  
  // Match info
  if (analysis.home_team && analysis.away_team) {
    pdf.setFontSize(12);
    const matchText = `${analysis.home_team} vs ${analysis.away_team}`;
    pdf.text(matchText, state.pageWidth / 2, 25, { align: 'center' });
    
    // Score for post-match
    if (isPostMatch && analysis.home_score !== null && analysis.away_score !== null) {
      const goldRgb = hexToRgb(BRAND.gold);
      pdf.setTextColor(goldRgb.r, goldRgb.g, goldRgb.b);
      pdf.setFontSize(14);
      pdf.text(`${analysis.home_score} - ${analysis.away_score}`, state.pageWidth / 2, 35, { align: 'center' });
    }
  } else if (isConcept && analysis.title) {
    pdf.setFontSize(14);
    pdf.text(analysis.title, state.pageWidth / 2, 25, { align: 'center' });
  }
  
  // Date
  if (analysis.match_date) {
    pdf.setFontSize(9);
    pdf.setTextColor(200, 200, 200);
    const dateStr = new Date(analysis.match_date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    pdf.text(dateStr, state.pageWidth / 2, 45, { align: 'center' });
  }
  
  // Player name if available
  if (analysis.player_name) {
    pdf.setFontSize(10);
    const goldRgb = hexToRgb(BRAND.gold);
    pdf.setTextColor(goldRgb.r, goldRgb.g, goldRgb.b);
    pdf.text(analysis.player_name.toUpperCase(), state.pageWidth / 2, 53, { align: 'center' });
  }
  
  state.yPosition = 60;
  
  // ===== MATCH IMAGE =====
  if (analysis.match_image_url) {
    await drawImage(state, analysis.match_image_url, 50);
  }
  
  // ===== PRE-MATCH / POST-MATCH SECTIONS =====
  if (isPreMatch || isPostMatch) {
    // Key Details / Overview
    if (analysis.key_details) {
      drawSectionHeader(state, isPostMatch ? 'Performance Overview' : 'Key Details');
      drawParagraph(state, analysis.key_details);
    }
    
    // Opposition Strengths
    if (analysis.opposition_strengths) {
      drawSectionHeader(state, 'Opposition Strengths');
      drawParagraph(state, analysis.opposition_strengths);
    }
    
    // Opposition Weaknesses
    if (analysis.opposition_weaknesses) {
      drawSectionHeader(state, 'Opposition Weaknesses');
      drawParagraph(state, analysis.opposition_weaknesses);
    }
    
    // Matchups
    if (analysis.matchups && analysis.matchups.length > 0) {
      drawSectionHeader(state, 'Potential Matchups');
      
      for (const matchup of analysis.matchups) {
        checkPageBreak(state, 25);
        
        // Background
        const bgRgb = hexToRgb(BRAND.contentBg);
        pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
        pdf.rect(state.margin, state.yPosition, state.contentWidth, 20, 'F');
        
        // Player name and number
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const playerText = `${matchup.name?.toUpperCase() || 'PLAYER'} #${matchup.number || '?'}`;
        pdf.text(playerText, state.margin + 40, state.yPosition + 8);
        
        // Notes
        if (matchup.notes) {
          pdf.setFontSize(9);
          pdf.setTextColor(60, 60, 60);
          const noteLines = pdf.splitTextToSize(matchup.notes, state.contentWidth - 50);
          pdf.text(noteLines.slice(0, 2), state.margin + 40, state.yPosition + 14);
        }
        
        state.yPosition += 24;
      }
    }
    
    // Scheme Section
    if (analysis.selected_scheme || analysis.scheme_title) {
      drawSectionHeader(state, analysis.scheme_title || `Our Approach: ${analysis.selected_scheme || ''}`);
      
      if (analysis.scheme_paragraph_1) {
        drawParagraph(state, analysis.scheme_paragraph_1);
      }
      if (analysis.scheme_image_url) {
        await drawImage(state, analysis.scheme_image_url, 70);
      }
      if (analysis.scheme_paragraph_2) {
        drawParagraph(state, analysis.scheme_paragraph_2);
      }
    }
    
    // Improvements (post-match only)
    if (isPostMatch && analysis.strengths_improvements) {
      drawSectionHeader(state, 'Areas for Improvement');
      drawParagraph(state, analysis.strengths_improvements);
    }
  }
  
  // ===== CONCEPT SECTIONS =====
  if (isConcept) {
    if (analysis.concept) {
      drawSectionHeader(state, 'Concept');
      drawParagraph(state, analysis.concept);
    }
    
    if (analysis.explanation) {
      drawSectionHeader(state, 'Explanation');
      drawParagraph(state, analysis.explanation);
    }
  }
  
  // ===== POINTS =====
  if (analysis.points && analysis.points.length > 0) {
    for (const point of analysis.points) {
      drawSectionHeader(state, point.title || 'Analysis Point');
      
      if (point.paragraph_1) {
        drawParagraph(state, point.paragraph_1);
      }
      
      // Point images
      if (point.images && point.images.length > 0) {
        for (const img of point.images) {
          await drawImage(state, img, 60);
        }
      }
      
      if (point.paragraph_2) {
        drawParagraph(state, point.paragraph_2);
      }
      
      // Note: Videos cannot be embedded in PDF, skip video_url
    }
  }
  
  // ===== FOOTER =====
  checkPageBreak(state, 15);
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Generated by Fuel For Football', state.pageWidth / 2, state.yPosition + 10, { align: 'center' });
  
  // ===== SAVE =====
  const fileName = analysis.home_team && analysis.away_team
    ? `${analysis.home_team}-vs-${analysis.away_team}-analysis.pdf`.replace(/\s+/g, '-').toLowerCase()
    : `${analysis.title || 'analysis'}.pdf`.replace(/\s+/g, '-').toLowerCase();
  
  pdf.save(fileName);
}
