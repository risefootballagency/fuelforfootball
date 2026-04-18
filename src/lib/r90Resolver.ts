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
