/**
 * Shared resolver for the "effective" R90 score of a report.
 *
 * Priority order:
 * 1. If status is draft/clipped → return null (not display-worthy).
 * 2. If status is hidden:
 *    a. Use `placeholder_per` if set (manual hidden score, already in R90 form).
 *    b. Else compute `(placeholder_raw_score / placeholder_minutes) * 90`.
 *    c. Else return null (hidden with no override → don't show 0.00).
 * 3. Otherwise return `r90_score` (auto-calculated).
 */
export interface R90Source {
  visibility_status?: string | null;
  r90_score?: number | null;
  placeholder_per?: number | null;
  placeholder_raw_score?: number | null;
  placeholder_minutes?: number | null;
}

export const getEffectiveR90 = (a: R90Source | null | undefined): number | null => {
  if (!a) return null;
  const status = String(a.visibility_status || '').toLowerCase();
  if (status === 'draft' || status === 'clipped') return null;
  if (status === 'hidden') {
    if (a.placeholder_per != null) return Number(a.placeholder_per);
    if (a.placeholder_raw_score != null && a.placeholder_minutes && a.placeholder_minutes > 0) {
      return (Number(a.placeholder_raw_score) / Number(a.placeholder_minutes)) * 90;
    }
    return null;
  }
  return a.r90_score ?? null;
};
