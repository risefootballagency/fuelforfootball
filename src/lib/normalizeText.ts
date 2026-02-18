/**
 * Normalize text content to fix double-spacing issues.
 * Collapses multiple spaces within lines to single spaces,
 * and multiple newlines to at most one newline (preserving paragraph breaks).
 */
export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    // Replace multiple spaces (not newlines) with single space
    .replace(/[^\S\n]+/g, ' ')
    // Replace 3+ newlines with double newline (paragraph break)
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
};
