import { toTitleCase } from '@/lib/titleCase';

const categoriseAction = (type: string): string => {
  const lower = (type || '').toLowerCase();
  const keyPatterns: Record<string, string[]> = {
    'Key Actions': ['goal', 'assist', 'key pass', 'penalty', 'big chance', 'chance created'],
    'Offensive': ['shot', 'cross', 'dribble', 'pass', 'carry', 'through ball', 'progressive', 'touch', 'ball retention', 'chance', 'attacking', 'offensive', 'forward'],
    'Defensive': ['tackle', 'interception', 'clearance', 'block', 'header', 'recovery', 'regain', 'defensive', 'press', 'duel'],
  };
  for (const [cat, patterns] of Object.entries(keyPatterns)) {
    if (patterns.some(p => lower.includes(p))) return cat;
  }
  return 'Other';
};

export const CATEGORY_ORDER = ['Key Actions', 'Offensive', 'Defensive', 'Other'];

/**
 * Deduplicates action types (case-insensitive) and groups them by category.
 * Returns { categories: Record<category, string[]>, allDeduped: string[] }
 */
export const categoriseActionTypes = (rawTypes: string[]): {
  categories: Record<string, string[]>;
  allDeduped: string[];
} => {
  // Deduplicate case-insensitively, keeping the first canonical form
  const canonical = new Map<string, string>();
  for (const t of rawTypes) {
    const key = t.trim().toLowerCase();
    if (!canonical.has(key)) {
      canonical.set(key, key);
    }
  }

  const allDeduped = Array.from(canonical.values()).sort();

  const categories: Record<string, string[]> = {};
  for (const type of allDeduped) {
    const cat = categoriseAction(type);
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(type);
  }

  return { categories, allDeduped };
};
