

## Plan: Add Live/Hidden/Draft Visibility Status to Performance Reports

### What's Missing

This project has zero support for the `visibility_status` system that RISE uses on performance reports. In RISE, every performance report has a status — **Draft** (blurred preview for player), **Hidden** (locked, only shows R90 placeholder), or **Live** (fully visible). This project treats everything as live.

The shared database already has `visibility_status`, `placeholder_raw_score`, and `placeholder_minutes` columns on `player_analysis` (confirmed by RISE's working code using `as any` casts). No DB migration needed.

### Changes Required

**1. Create `src/components/staff/VisibilityStatusButton.tsx`** (new file)
- Port directly from RISE: a popover button with Draft/Hidden/Live options
- Hidden mode shows placeholder Raw Score + Minutes inputs
- Color-coded badges (yellow=draft, red=hidden, green=live)

**2. Update `src/components/staff/CreatePerformanceReportDialog.tsx`**
- Import `VisibilityStatusButton` and `VisibilityStatus` type
- Add state: `visibilityStatus` (default "draft"), `placeholderRawScore`, `placeholderMinutes`
- Load these from existing data in `fetchExistingData` (via `as any` cast)
- Include in save payload (both create and update paths)
- Render `VisibilityStatusButton` next to the Save button in both mobile and desktop action bars

**3. Update `src/components/staff/analysis/ActionReportsList.tsx`**
- Add `visibility_status`, `placeholder_raw_score`, `placeholder_minutes` to query select
- Add `visibility_status` to `ActionReport` interface
- Show draft/hidden badge next to player name (yellow/red pill like RISE)
- Add `getEffectiveR90` function: if hidden + placeholder values exist, calculate R90 from placeholders instead

**4. Update `src/components/PerformanceReportDialog.tsx`**
- Add `visibility_status`, `placeholder_raw_score`, `placeholder_minutes` to `AnalysisDetails` interface
- Load from query result via `as any` cast (default "live")
- When `visibility_status === "hidden"`: show locked view with placeholder R90/Raw Score/Minutes grid, "This report is locked" message
- When `visibility_status === "draft"` and in portal view: overlay blur with "Report In Progress" message
- When `visibility_status === "live"`: show full report (current behavior)

**5. Update `src/pages/PerformanceReport.tsx`** (standalone page)
- Same visibility logic as the dialog: hidden shows lock screen, draft shows blur overlay for non-staff

**6. Update `src/components/dashboard/Hub.tsx`**
- Add `visibility_status`, `placeholder_raw_score`, `placeholder_minutes` to `PlayerAnalysis` interface
- Add `getEffectiveR90` function for R90 chart to use placeholder values when hidden

**7. Update `src/components/dashboard/NewsFeed.tsx`**
- Filter news feed to only show `live` reports (exclude draft/hidden from player inbox)

### Files
- **New**: `src/components/staff/VisibilityStatusButton.tsx`
- **Edit**: `src/components/staff/CreatePerformanceReportDialog.tsx`
- **Edit**: `src/components/staff/analysis/ActionReportsList.tsx`
- **Edit**: `src/components/PerformanceReportDialog.tsx`
- **Edit**: `src/pages/PerformanceReport.tsx`
- **Edit**: `src/components/dashboard/Hub.tsx`
- **Edit**: `src/components/dashboard/NewsFeed.tsx`

No database migration required — the shared DB already has the columns.

