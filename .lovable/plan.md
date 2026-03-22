

# Sync Recent RISE Football Changes (Last 7 Days)

Based on the RISE Football conversation history (Mar 11-15), here are all the changes that need to be synced to this project.

## Changes Summary

### 1. New Files to Create

**`src/components/report/MatchTimelapse.tsx`** — Full match timelapse component with SVG pitch, animated zone trail, continuous MM:SS clock with variable speed playback (fast-forward gaps, normal speed during actions), vertical timeline with action markers.

**`src/lib/reportActionHelpers.ts`** — Utility for chronological action sorting (`sortReportActionsChronologically`), zone filtering (`filterActionsByZone`, `actionMatchesZone`, `actionMatchesSubZone`). Used by MatchTimelapse, R90FlowChart, RankedActionsPlayer, ZonePerformance.

### 2. Report Components to Update (sync from RISE)

**`src/components/report/R90FlowChart.tsx`** — Add import of `sortReportActionsChronologically` from reportActionHelpers; use it for chart data sorting.

**`src/components/report/RankedActionsPlayer.tsx`** — Add `sortReportActionsChronologically` import; add `X` close icon import; add `[&>button.absolute]:hidden` to DialogContent to fix duplicate X icons; add language prop usage.

**`src/components/report/ZonePerformance.tsx`** — Replace inline video player with `onSelectZone` callback prop; add clickable zone buttons for zone-to-video filtering; remove embedded RankedActionsPlayer/clip logic.

**`src/components/report/PitchHeatmap.tsx`** — Update heatmap color gradient for better red-density differentiation (green→yellow→red scale with clearer hot zones).

**`src/components/report/ActionHeatmap.tsx`** — Add language prop; use `t()` for all labels.

**`src/components/report/ChanceCreationFlow.tsx`** — Add language prop; use `t()` for labels.

**`src/components/ClippedActionsPlayer.tsx`** — Add `[&>button.absolute]:hidden` to fix duplicate X icons; add language prop support.

### 3. Performance Report Pages (major sync)

**`src/pages/PerformanceReport.tsx`** — Add MatchTimelapse import and toggle; add `filterActionsByZone` import; add zone player state/handlers; add translation support via `reportTranslations` helpers; add Timer icon import; wire `onSelectZone` to ZonePerformance for zone-specific video popups.

**`src/components/PerformanceReportDialog.tsx`** — Same changes as above: MatchTimelapse, zone player, `filterActionsByZone`, translation helpers, draft `estimated_ready_at` visibility.

### 4. Edge Functions to Sync

**`supabase/functions/parse-stats-url/index.ts`** — Complete rewrite: deterministic `__NEXT_DATA__` JSON extraction, AI fallback with tool calling (structured output), expanded stat key aliases, 40K char context limit.

**`supabase/functions/suggest-fixture-stats/index.ts`** — Add `normaliseFixtureSuggestions` validation layer, pass zone evidence, arithmetic constraint enforcement, model upgrade to `gemini-3-flash-preview`.

**`supabase/functions/ai-write/index.ts`** — Updated prompts enforcing British English, improved style example instructions for analysis-paragraph and analysis-overview types.

### 5. UI Component Updates

**`src/components/ui/textarea.tsx`** — Add `spellCheck` attribute globally.

**`src/components/staff/VideoActionEditor.tsx`** — Description dropdown opens upward (`bottom-full mb-1`); jump-to list gets scroll arrow buttons at top/bottom.

**`src/components/staff/R90RatingsViewer.tsx`** — Default expand "Offensive" category on open; sort "Offensive" to top; add `prefilledSearch` prop.

**`src/components/staff/XGPitchMap.tsx`** — Rebuilt with research-based 12x9 xG grid, interactive tooltips, box zoom toggle.

### 6. Translation Expansion

**`src/lib/portalTranslations.ts`** — Add ~40 new translation keys across all 10 languages for report UI (match_timelapse, press_play, zone_word, view_clips, save_label, share_label, etc.).

### 7. Error Reporting (main.tsx)

**`src/main.tsx`** — Add monkey-patch of `toast.error` to include a "Report" button that inserts error details into `staff_notification_events` table. Requires importing `toast` from sonner and `supabase` client.

### 8. Not synced (RISE-specific only)

- Visitor Diagnostics page (RISE-specific debugging tool)
- Birthday notification cron job fix (RISE-specific infrastructure)
- PWA scope guard in main.tsx (RISE-specific, this project has its own approach)

## Implementation Order

1. Create new utility files (reportActionHelpers.ts)
2. Create MatchTimelapse component
3. Update report sub-components (R90FlowChart, RankedActionsPlayer, ZonePerformance, PitchHeatmap, ActionHeatmap, ChanceCreationFlow, ClippedActionsPlayer)
4. Update portalTranslations.ts with new keys
5. Update textarea.tsx (spellCheck)
6. Sync edge functions (parse-stats-url, suggest-fixture-stats, ai-write)
7. Update PerformanceReport.tsx and PerformanceReportDialog.tsx
8. Update staff components (VideoActionEditor, R90RatingsViewer, XGPitchMap)
9. Add error reporting to main.tsx

## Branding Note
All RISE-specific references (e.g. `text-risegold`) will be adapted to this project's equivalent colour tokens.

