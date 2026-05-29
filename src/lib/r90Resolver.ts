/**
 * Shared resolver for the "effective" R90 score of a report.
 *
 * IMPORTANT: In this project's schema:
 *   - `placeholder_raw_score` + `placeholder_minutes` → hidden R90 source
 *   - `placeholder_per` → PER metric (NOT R90)
 *   - `placeholder_sr`  → SR metric  (NOT R90)
 *
 * Priority order:
 * 1. draft/clipped → null (not display-worthy).
 * 2. hidden → compute `(placeholder_raw_score / placeholder_minutes) * 90`,
 *    else null (do NOT fall back to auto r90_score for hidden reports).
 * 3. live/other → `r90_score` (auto-calculated).
 */
export interface R90Source {
  visibility_status?: string | null;
  r90_score?: number | null;
  /** PER metric — NOT used for R90. Kept on the type for shared selects. */
  placeholder_per?: number | null;
  placeholder_raw_score?: number | null;
  placeholder_minutes?: number | null;
}

export const getEffectiveR90 = (a: R90Source | null | undefined): number | null => {
  if (!a) return null;
  const status = String(a.visibility_status || '').toLowerCase();
  if (status === 'draft' || status === 'clipped') return null;
  if (status === 'hidden') {
    if (a.placeholder_raw_score != null && a.placeholder_minutes && a.placeholder_minutes > 0) {
      return (Number(a.placeholder_raw_score) / Number(a.placeholder_minutes)) * 90;
    }
    return null;
  }
  return a.r90_score ?? null;
};

/**
 * Tailwind background class for an R90 score band. Mirrors the staff list bands.
 */
export const getR90ColorClass = (score: number): string => {
  if (score < 0) return "bg-red-950";
  if (score < 0.2) return "bg-red-600";
  if (score < 0.4) return "bg-red-400";
  if (score < 0.6) return "bg-orange-700";
  if (score < 0.8) return "bg-orange-500";
  if (score < 1.0) return "bg-yellow-400";
  if (score < 1.4) return "bg-lime-400";
  if (score < 1.8) return "bg-green-500";
  if (score < 2.5) return "bg-green-700";
  return "bg-gold";
};

/**
 * Foreground text class paired with the R90 background band so the score
 * stays legible across light (yellow/lime) and dark (deep red/green) bands.
 * Used on mobile chips where white-on-yellow currently disappears.
 */
export const getR90Foreground = (score: number): string => {
  // Light bands → black text. Everything else → white.
  if (score >= 0.6 && score < 1.8) return "text-black";
  return "text-white";
};
