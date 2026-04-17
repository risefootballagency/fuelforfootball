/**
 * Centralised fixture-stat aggregation rules synced from RISE.
 *
 * Both raw count stats and percentage stats exclude rows where the metric
 * key is missing entirely. An explicit value of 0 IS counted — only true
 * absence is excluded. This avoids dragging averages down to 0 for GK
 * metrics like clean sheets when older fixtures predate the metric set.
 */

const STAT_KEY_ALIASES: Record<string, string[]> = {
  gk_clean_sheets: ['clean_sheets'],
  clean_sheets: ['gk_clean_sheets'],
  gk_saves_made: ['saves'],
  saves: ['gk_saves_made'],
  gk_save_percentage: ['save_percentage'],
  save_percentage: ['gk_save_percentage'],
  gk_goals_conceded: ['goals_conceded'],
  goals_conceded: ['gk_goals_conceded'],
};

const PERCENTAGE_PATTERNS = ['_pct', 'accuracy', 'percentage', 'win_pct', 'success_pct'];

export const isPercentageMetric = (key: string): boolean => {
  const lower = key.toLowerCase();
  return PERCENTAGE_PATTERNS.some((p) => lower.includes(p));
};

export const getStatValue = (analysis: any, key: string): number | null => {
  const fs = analysis?.fixture_stats as Record<string, any> | null;
  const ss = analysis?.striker_stats as Record<string, any> | null;
  const keysToTry = [key, ...(STAT_KEY_ALIASES[key] || [])];
  for (const k of keysToTry) {
    if (fs?.[k] != null) return Number(fs[k]);
    if (ss?.[k] != null) return Number(ss[k]);
  }
  return null;
};

export const computeStatAverage = (analyses: any[], metricKey: string): number | null => {
  if (analyses.length === 0) return null;
  const vals = analyses
    .map((a) => getStatValue(a, metricKey))
    .filter((v): v is number => v != null && !isNaN(v));
  if (vals.length === 0) return null;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
};

export const computeAllStatAverages = (
  analyses: any[],
  metrics: { key: string }[],
): Record<string, number | null> => {
  const result: Record<string, number | null> = {};
  metrics.forEach((m) => {
    result[m.key] = computeStatAverage(analyses, m.key);
  });
  return result;
};
