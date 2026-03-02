

# RISE Football Sync — Missing Changes

After comparing both codebases, here are the changes needed:

## 1. Login: Remove @ Requirement
RISE changed the login input from `type="email"` to `type="text"` with placeholder "Enter your login" so players can log in with usernames or emails without needing an `@` symbol. FFF still uses `type="email"`.

**Files:** `src/pages/Login.tsx`
- Change `type="email"` → `type="text"`
- Change placeholder to "Enter your login"
- Also select `name` in the player query (RISE selects `id, email, name`)
- Add staff notification on login (fire-and-forget `insertStaffNotification` for `portal_login`)

## 2. Player Management: Remove @ Requirement
Same change needed on `PlayerManagement.tsx`, `PlayerList.tsx`, and `AddPlayerDialog.tsx` — the email fields for player login credentials should use `type="text"` instead of `type="email"` so non-email logins are accepted. The label should stay "Email" but validation should not enforce `@`.

**Files:** `src/components/staff/PlayerManagement.tsx`, `src/components/staff/PlayerList.tsx`, `src/components/staff/AddPlayerDialog.tsx`

## 3. Edge Function Error Helper
RISE created `src/lib/edgeFunctionHelper.ts` — a drop-in wrapper for `supabase.functions.invoke` that extracts actual error messages from non-2xx responses instead of showing generic "non-2xx status code" errors. FFF has no equivalent. This was then adopted across 16 staff components.

**Files:** Create `src/lib/edgeFunctionHelper.ts`, then update all components that call `supabase.functions.invoke` to use `invokeEdgeFunction` instead.

## 4. CoachingDataSection: Sync to RISE Version
RISE's version has several improvements over FFF's:
- Simplified inline report state (single `InlineReportState` object vs multiple state vars)
- Uses `inline` prop + `onClose`/`onSuccess` on `CreatePerformanceReportDialog` instead of `open`/`onOpenChange`
- Added Refresh button (desktop: beside tabs, mobile: separate row)
- Active tab styling uses `bg-primary text-primary-foreground` instead of `bg-accent`
- Desktop layout uses `justify-between` to position tabs and refresh on same row

**Files:** `src/components/staff/CoachingDataSection.tsx`

## 5. `linked_video_analysis_ids` on `analyses` Table
RISE added this column to the `analyses` table (in addition to `player_analysis` which FFF already has). This enables linking video analyses to pre/post-match analysis documents. FFF is missing this migration.

**Database:** Add `linked_video_analysis_ids text[] DEFAULT '{}'` to `public.analyses`

## 6. Analysis Points: Video Move-to-Point Feature
RISE added an `ArrowRightLeft` button on each video in `AnalysisPointsSection` that lets you move a video clip from one point to another via a dropdown. FFF's version already has the `ArrowRightLeft` import and `onMoveToPoint` handler — need to verify it's fully wired. Also adds Up/Down arrow buttons next to point headers for easy reordering without drag.

**Files:** `src/components/staff/analysis/AnalysisPointsSection.tsx`

## 7. Video Analysis Clips in Analysis Points
RISE's `AnalysisPointsSection` fetches clips from linked video analyses (`linked_video_analysis_ids`) and presents them in a dropdown "Add from Video Analysis clips..." per point. FFF needs this clip fetching logic added.

**Files:** `src/components/staff/analysis/AnalysisPointsSection.tsx`

## 8. Performance Report: Combobox + Frequency Sorting + Description Suggestions
RISE replaced native `<datalist>` inputs with `Popover + Command` comboboxes for action type and description fields. Features:
- Paginated fetch (bypasses 1000-row limit)
- Frequency-sorted action types (most used first)
- Canonical normalization via `toTitleCase`
- Description suggestions grouped by action type with frequency sorting
- `canonicalActionType` helper for consistent data storage

**Files:** `src/components/staff/CreatePerformanceReportDialog.tsx`

## 9. Fixture Stats → Match Statistics Button
RISE added an `ArrowUpToLine` icon button next to each fixture stat label in `FixtureStatsEditor`, allowing one-click addition of fixture metrics to the Performance Report's match statistics section.

**Files:** `src/components/staff/FixtureStatsEditor.tsx`, `src/components/staff/CreatePerformanceReportDialog.tsx` (handler for `onAddToMatchStats`)

## Implementation Order

1. Login + Player Management `type="text"` change (quick wins)
2. Create `edgeFunctionHelper.ts` and adopt across components
3. Database migration for `linked_video_analysis_ids` on `analyses`
4. CoachingDataSection sync to RISE version
5. AnalysisPointsSection: video move-to-point + VA clip integration
6. Performance Report: combobox, frequency sorting, description suggestions
7. FixtureStatsEditor: add-to-match-stats button

