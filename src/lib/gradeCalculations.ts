// Grade calculation utilities for performance metrics

export interface GradeInfo {
  grade: string;
  color: string;
}

/**
 * Calculate R90 grade based on score ranges
 */
export function getR90Grade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score < 0) return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
  if (score < 0.2) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  if (score < 0.4) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score < 0.6) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown
  if (score < 0.8) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score < 1.0) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green
  if (score < 1.2) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score < 1.4) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450
  if (score < 1.6) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530
  if (score < 1.8) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score < 2.2) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  return { grade: 'A*', color: 'hsl(47, 100%, 51%)' }; // FFF Yellow for 2.2+
}

/**
 * Calculate xG (Expected Goals) grade based on score ranges
 */
export function getXGGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score === 0) return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
  if (score < 0.05) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  if (score < 0.1) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score < 0.15) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown
  if (score < 0.2) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score < 0.3) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green
  if (score < 0.35) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score < 0.4) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450
  if (score < 0.5) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530
  if (score < 0.75) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score < 1.0) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold for 1.0+
}

/**
 * Calculate xA (Expected Assists) grade based on score ranges
 */
export function getXAGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score === 0) return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
  if (score < 0.04) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  if (score < 0.08) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score < 0.13) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown
  if (score < 0.18) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score < 0.25) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green
  if (score < 0.3) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score < 0.4) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450
  if (score < 0.5) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530
  if (score < 0.6) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score < 0.75) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold for 0.75+
}

/**
 * Calculate Regains grade based on score ranges (supports decimal per-90 values)
 */
export function getRegainsGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score < 1) return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
  if (score < 2) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  if (score < 3) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score < 4) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown
  if (score < 5) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score < 6) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green
  if (score < 7) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score < 8) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450
  if (score < 9) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530
  if (score < 10) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score < 11) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold for 11+
}

/**
 * Calculate Interceptions grade based on score ranges
 */
export function getInterceptionsGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score < 1) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  if (score < 2) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score < 3) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score < 4) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score < 5) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score < 6) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold for 6+
}

/**
 * Calculate xGChain grade based on score ranges
 */
export function getXGChainGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score < 0.4) return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
  if (score < 0.6) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  if (score < 0.8) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score < 1.0) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown
  if (score < 1.2) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score < 1.4) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green
  if (score < 1.6) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score < 1.8) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450
  if (score < 2.2) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530
  if (score < 2.5) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score < 3.0) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold for 3.0+
}

/**
 * Calculate Progressive Passes grade based on score ranges
 */
export function getProgressivePassesGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score === 0) return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
  if (score < 2) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red (1)
  if (score < 3) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown (2)
  if (score < 4) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange (3)
  if (score < 5) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green (4)
  if (score < 7) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400 (5-6)
  if (score < 8) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450 (7)
  if (score < 9) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530 (8)
  if (score < 10) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625 (9)
  if (score < 12) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750 (10-11)
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold for 12+
}

/**
 * Calculate Progressive Passes to Turnovers Ratio grade based on score ranges
 */
export function getPPTurnoversRatioGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score >= 4) return { grade: 'A*', color: 'hsl(43, 96%, 56%)' }; // Rise Gold
  if (score >= 3.5) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' }; // Green 750
  if (score >= 3) return { grade: 'A', color: 'hsl(142, 70%, 50%)' }; // Green 625
  if (score >= 2.5) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' }; // Green 530
  if (score >= 2) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' }; // Green 450
  if (score >= 1.75) return { grade: 'B', color: 'hsl(142, 76%, 36%)' }; // Green 400
  if (score >= 1.5) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' }; // Yellow-Green
  if (score >= 1.25) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' }; // Yellow-Orange
  if (score >= 1) return { grade: 'C', color: 'hsl(25, 75%, 45%)' }; // Orange-Brown
  if (score >= 0.75) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' }; // Light Red
  if (score >= 0.5) return { grade: 'D', color: 'hsl(0, 84%, 45%)' }; // Red
  return { grade: 'U', color: 'hsl(0, 84%, 30%)' }; // Dark Red
}

/**
 * Calculate PER (Player Efficiency Rating) grade based on score ranges
 */
export function getPERGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score < 0.4) return { grade: 'U', color: 'hsl(0, 84%, 30%)' };
  if (score < 0.6) return { grade: 'D', color: 'hsl(0, 84%, 45%)' };
  if (score < 0.75) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' };
  if (score < 0.9) return { grade: 'C', color: 'hsl(25, 75%, 45%)' };
  if (score < 1.0) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' };
  if (score < 1.1) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' };
  if (score < 1.2) return { grade: 'B', color: 'hsl(142, 76%, 36%)' };
  if (score < 1.35) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' };
  if (score < 1.5) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' };
  if (score < 1.75) return { grade: 'A', color: 'hsl(142, 70%, 50%)' };
  if (score < 2.0) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' };
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' };
}

/**
 * Calculate SR (Statistical Rating) grade based on score ranges
 */
export function getSRGrade(score: number | null | undefined): GradeInfo {
  if (score === null || score === undefined) {
    return { grade: '-', color: 'hsl(var(--muted-foreground))' };
  }

  if (score < 30) return { grade: 'U', color: 'hsl(0, 84%, 30%)' };
  if (score < 40) return { grade: 'D', color: 'hsl(0, 84%, 45%)' };
  if (score < 50) return { grade: 'C-', color: 'hsl(0, 84%, 60%)' };
  if (score < 55) return { grade: 'C', color: 'hsl(25, 75%, 45%)' };
  if (score < 60) return { grade: 'C+', color: 'hsl(40, 85%, 50%)' };
  if (score < 65) return { grade: 'B-', color: 'hsl(60, 70%, 50%)' };
  if (score < 70) return { grade: 'B', color: 'hsl(142, 76%, 36%)' };
  if (score < 75) return { grade: 'B+', color: 'hsl(142, 70%, 40%)' };
  if (score < 80) return { grade: 'A-', color: 'hsl(142, 65%, 45%)' };
  if (score < 85) return { grade: 'A', color: 'hsl(142, 70%, 50%)' };
  if (score < 90) return { grade: 'A+', color: 'hsl(142, 76%, 55%)' };
  return { grade: 'A*', color: 'hsl(43, 96%, 56%)' };
}
