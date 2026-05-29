## Goals

1. Pull across the remaining recent RISE improvements (operating profile, decimal places, hidden-R90 use).
2. Stop the one performance report that crashes the page from killing the whole view.
3. Make the R90 chip on locked/hidden reports legible on mobile (currently white text on yellow/lime).

## What's already in sync with RISE (verified)

- Operating Profile dialog, reminder banner copy ("What makes you tick?"), drag-to-rank, silent autosave, one-time auto-open gated on `portalWelcomeSeen`, `localStorage` dismiss — all match RISE.
- `getEffectiveR90` logic (draft/clipped → null, hidden → `placeholder_raw_score / placeholder_minutes * 90`, else `r90_score`) is identical in `Hub.tsx`, `AnalysisDataTab.tsx`, `Dashboard.tsx`, `r90Resolver.ts`.
- `R90FlowChart` 5-minute warm-up delay, `statAggregation` blanks-vs-zero rule, hidden-state lock screen in `PerformanceReportDialog` — all match.

So the porting work is mostly consolidation + small correctness fixes, not large features.

## A. Operating Profile — visibility tightening

Two small misses vs RISE:

1. `OperatingProfileReminder` currently renders for any player who hasn't submitted, even existing/legacy ones — same trap we hit with the welcome modal. Add the same rollout cutoff used for `PORTAL_WELCOME_ROLLOUT_AT`: hide the banner for players created before the operating-profile rollout date unless they've already started answering. This stops the banner appearing for accounts that have logged in dozens of times pre-feature.
2. `ActionReportsList.tsx` (staff) `getEffectiveR90` is missing the `draft`/`clipped` → null branch — it returns `r90_score` for drafts, which leaks an auto score into the staff list. Replace it with `import { getEffectiveR90 } from "@/lib/r90Resolver"` so all four call sites share one definition (Hub, Dashboard, AnalysisDataTab, ActionReportsList).

## B. Decimal places + hidden-R90 use

Centralise the formatting that's currently `.toFixed(2)` / `.toFixed(3)` scattered around:

- Add `src/lib/numberFormat.ts` with `fmtR90(n)`, `fmtScore(n)`, `fmtPct(n)` — all null-safe (return `'—'` for null / NaN / Infinity, matching the project's null-guard rule).
- Replace raw `.toFixed()` in `PerformanceReportDialog.tsx` (Raw Score, R90, action_score), `ActionReportsList.tsx`, `AnalysisDataTab.tsx` r90 cell and the metric cells (`val.toFixed(2)`), `Hub.tsx` R90 chip.
- Use `getEffectiveR90` from `r90Resolver` everywhere `r90_score` is read for display, so hidden reports consistently show the placeholder-derived figure (the staff list currently shows `null` for hidden when placeholder is set, because of the missing branch in A.2).

## C. Performance report that crashes the page

Without the offending report ID I can't pinpoint the field, but the dialog has two well-known crash vectors that match the symptom ("breaks the page" on one specific report):

1. `PerformanceReportDialog.tsx:858` divides by `analysis.minutes_played` without a `> 0` guard → `Infinity`/`NaN` → `.toFixed()` is fine but downstream chart math (R90FlowChart, heatmaps) explodes when a report has `minutes_played = 0` or `null` and `actions.length > 0`.
2. `R90FlowChart` does `Math.max(...sorted.map(...))` with no fallback when an action's `minute` is null — produces `NaN`, then `startMinute = NaN`, then the loop doesn't run but `chartData[chartData.length - 1]` is fine. Safer: filter null minutes before reducing.

Fix plan:
- Wrap the dialog body in an `ErrorBoundary` so a single bad report shows a "Couldn't render this report" panel instead of taking the page down.
- Add null/zero guards in `PerformanceReportDialog` Raw Score / R90 / Mins blocks (`minutes_played > 0`, `Number.isFinite(...)`).
- Add null-minute filtering at the top of `R90FlowChart.useMemo`, plus null filtering in `ActionHeatmap`, `MatchTimelapse`, `ChanceCreationFlow` for `action_score`/`minute`.
- Log a `console.warn` with `analysis.id` when we hit a guard so the next crash report is debuggable.

**Need from you (non-blocking — I'll ship the guards regardless):** which player + opponent is the report that crashes? That lets me confirm the exact field that's empty rather than guessing.

## D. Locked / hidden R90 — mobile colour contrast

The R90 chip in `Hub.tsx` (portal) and the mobile R90 strip in `ActionReportsList` use `text-white` over `getR90ColorClass`, which returns light yellow (`bg-yellow-400`) and lime (`bg-lime-400`) for mid-range scores — white-on-yellow is invisible. This affects every R90 chip but is most visible for hidden reports because the placeholder score often lands in that mid range.

Fix:
- In `getR90ColorClass` (staff) and `getR90Color` (portal), pair every colour with a matching foreground token; expose `getR90Foreground(score)` returning `text-black` for the light bands (`yellow-400`, `lime-400`, `orange-500`) and `text-white` for the dark bands.
- Apply at the four chip sites: portal Hub R90 button (line 1106), staff list mobile R90 (line 272) + desktop R90 (line 283), and the inline draft/clipped `text-white/60` pills (those are already on `bg-zinc-700`, no change needed).

## Technical notes

- No DB or edge-function changes.
- New file: `src/lib/numberFormat.ts`.
- Edits: `r90Resolver.ts` (no logic change, just add `getR90Color` + `getR90Foreground` helper there for one source of truth), `Hub.tsx`, `Dashboard.tsx`, `AnalysisDataTab.tsx`, `ActionReportsList.tsx`, `PerformanceReportDialog.tsx`, `R90FlowChart.tsx`, `OperatingProfileReminder.tsx` (rollout-cutoff prop), `pages/Dashboard.tsx` (pass `playerCreatedAt` + rollout constant to the reminder), new `src/components/portal/ReportErrorBoundary.tsx`.
- `r90Resolver.ts` already exists and is unused — this finally adopts it.

Reply with the crashing report (player + opponent or URL) when you have it; I'll fold the specific field into the guards before shipping.