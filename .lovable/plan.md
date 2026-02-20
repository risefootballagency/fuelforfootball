

# Comprehensive Update Plan

## Summary
This plan covers 6 areas: landing page button visibility, video clip persistence and correctness, portal comparison UX, a new Video Downloader tool, syncing missing RISE features, and fixing the Staff Data section.

---

## 1. Landing Page Top-Right Buttons -- Lighter Colour

Both `Landing.tsx` (line 262) and `StaticLandingFallback.tsx` (line 83) use very low opacity text for Staff/Scout/Portal buttons:
- Landing.tsx: `text-light-green/30` hover `text-light-green/60`
- StaticLandingFallback.tsx: `text-[hsl(var(--mint)/0.3)]` hover `text-[hsl(var(--mint)/0.6)]`

**Change:** Increase base opacity from 30% to 55% and hover from 60% to 85% on both files.

---

## 2. Video Clips -- Fix Clip URLs, Persistence, and Annotation Integration

### Problem
When exporting clips from Video Analysis to performance reports, the current code (VideoAnalysis.tsx line 349) sets `video_url: selectedVideo.video_url` -- the full match video URL, not a clip-specific URL. This means performance reports play the entire match video instead of the clipped segment.

Additionally, clips inherit the 7-day auto-delete lifecycle of the parent video. They should persist indefinitely.

### Changes

**A. Fix export to use fragment URLs (VideoAnalysis.tsx)**
- When exporting clips to a report, use `${selectedVideo.video_url}#t=${clip.start},${clip.end}` instead of the raw full video URL
- This makes the browser play only the relevant segment

**B. Add `video_analysis_id` and `clip_id` columns (database migration)**
- Add `video_analysis_id` (text, nullable) and `clip_id` (text, nullable) to `performance_report_actions` table
- These track the source video analysis and specific clip for traceability

**C. Preserve clips when parent video is deleted (VideoAnalysis.tsx)**
- Before deleting a video analysis entry, unlink any report actions referencing it by clearing `video_analysis_id` while preserving the `video_url` (clip URL) -- matching RISE behaviour
- Only delete the main uploaded video file from storage, not fragment references

**D. Annotation-aware clip URLs**
- When a clip has annotations saved in localStorage (`va_annotations_{clipId}`), the export should note this so the performance report player can show annotations
- The `ActionVideoPopup` and `ClippedActionsPlayer` components already handle video URLs; the fragment URL approach ensures the correct segment plays

**E. Fix existing reports (Loris Mettler vs Kristiansund, Cristiano Ronaldo vs Barcelona)**
- Query `performance_report_actions` for these reports
- Update any full-video URLs to fragment URLs using the stored clip start/end data

---

## 3. Portal Comparisons -- Searchable Dropdown with Request Feature

### Current State
`AnalysisComparisons.tsx` shows comparison players as a grid of toggle buttons. Users can only select from pre-stored players matching their position.

### Changes

**A. Replace button grid with searchable dropdown (AnalysisComparisons.tsx)**
- Use a `Command`/`Popover` combo (combobox pattern) with search input
- Selected players appear as removable chips below the dropdown
- Players still filtered by position

**B. "Request a Player" option**
- If the player types a name not found in the database, show a "Request {name}" option at the bottom
- Clicking it triggers a staff notification via the `notify-staff` edge function with category `comparison_request` and the player name/position requested
- Show a toast confirming the request was sent

**C. Staff notification handling**
- Add `comparison_request` to the `StaffNotificationsDropdown.tsx` category map with a suitable label and icon

---

## 4. Video Downloader -- New Staff App Section

### Concept
A new section under "Apps" on Staff that accepts a URL input, fetches the page content, and extracts all `.mp4` links found on that page. Users can then click links to open them and use the three-dot menu to download.

### Implementation

**A. New component: `src/components/staff/VideoDownloaderSection.tsx`**
- Text input for URL
- "Inspect" button that calls a new edge function
- Results list showing extracted mp4 URLs as clickable links (opens in new tab)
- Each link opens the mp4 directly where the user can right-click or use three-dot menu to save

**B. New edge function: `supabase/functions/extract-video-links/index.ts`**
- Accepts a URL in the request body
- Fetches the page HTML server-side (to avoid CORS)
- Parses for `.mp4` links using regex on `src=`, `href=`, and common video player attributes
- Returns array of found mp4 URLs

**C. Register in Staff.tsx**
- Add `{ id: 'videodownloader', title: 'Video Downloader', icon: Download }` to the Apps sections array
- Add rendering: `{expandedSection === 'videodownloader' && <VideoDownloaderSection />}`

---

## 5. Sync Missing RISE Features

### A. Video Analysis Enhancements (VideoAnalysis.tsx)
The RISE version (1622 lines) has significant features missing from this site (471 lines):

1. **Speed controls** -- Playback speed overlay (0.25x to 2x) with hotkeys (+/-/0)
2. **Keyboard hotkeys** -- Arrow keys for 10s seek, Shift for 30s, Delete for instant clip
3. **Link/Export split** -- "Link Clips" (makes clips available for selection on report) vs "Export as Actions" (adds directly). Currently only export exists
4. **Clip-to-action attachment** -- Paperclip button on each clip to attach it to a specific existing action on a linked report, or insert a new action at a specific position
5. **Editable clip minute field** -- Inline editable match time per clip (mm:ss format)
6. **Clip saved toast in fullscreen** -- Visual confirmation overlay when clipping during fullscreen playback
7. **Player grouping in dropdowns** -- Uses `groupPlayersByStatus` for organised player selection
8. **`linked_video_analysis_ids`** on `player_analysis` table -- Tracks which video analyses are linked to which reports

### B. CoachingDataSection -- Inline Report Editing
RISE uses inline report editing (`CreatePerformanceReportDialog` with `inline` prop) instead of opening a dialog. The current site opens a `PerformanceReportDialog` viewer and a separate `CreatePerformanceReportDialog`. RISE has no viewer dialog -- it goes straight to inline edit mode.

### Database Migration for Sync
```sql
ALTER TABLE player_analysis ADD COLUMN IF NOT EXISTS linked_video_analysis_ids text[] DEFAULT '{}';
ALTER TABLE performance_report_actions ADD COLUMN IF NOT EXISTS video_analysis_id text;
ALTER TABLE performance_report_actions ADD COLUMN IF NOT EXISTS clip_id text;
```

---

## 6. Fix Staff "Data" Section

### Problem
The Staff Data section currently uses section ID `'data'` and renders `CoachingDataSection`. On RISE the section ID is `'coachingdata'` and it renders the same component but with inline editing behaviour.

### Changes
- Update section ID from `'data'` to `'coachingdata'` in Staff.tsx sections config
- Update the rendering condition from `expandedSection === 'data'` to `expandedSection === 'coachingdata'`
- Update `CoachingDataSection` to match RISE: remove the `PerformanceReportDialog` viewer and use inline editing by passing `inline` prop to `CreatePerformanceReportDialog` with `onClose`/`onSuccess` callbacks
- Remove the separate view report dialog state

---

## Technical Details

### Database Migration
```sql
-- Video clip tracking columns
ALTER TABLE performance_report_actions ADD COLUMN IF NOT EXISTS video_analysis_id text;
ALTER TABLE performance_report_actions ADD COLUMN IF NOT EXISTS clip_id text;

-- Video analysis linking to reports
ALTER TABLE player_analysis ADD COLUMN IF NOT EXISTS linked_video_analysis_ids text[] DEFAULT '{}';
```

### New Files
- `src/components/staff/VideoDownloaderSection.tsx` -- Video link extractor UI
- `supabase/functions/extract-video-links/index.ts` -- Server-side page parser

### Modified Files
- `src/pages/Landing.tsx` -- Button opacity increase (line 262)
- `src/components/StaticLandingFallback.tsx` -- Button opacity increase (lines 84-91)
- `src/components/staff/coaching/VideoAnalysis.tsx` -- Major sync with RISE (speed controls, hotkeys, link/export, clip attachment, fragment URLs, clip persistence)
- `src/components/portal/AnalysisComparisons.tsx` -- Searchable dropdown with request feature
- `src/components/staff/StaffNotificationsDropdown.tsx` -- Add `comparison_request` category
- `src/components/staff/CoachingDataSection.tsx` -- Inline editing, remove viewer dialog
- `src/pages/Staff.tsx` -- Fix data section ID, add Video Downloader section
- `src/components/PerformanceReportDialog.tsx` -- Ensure fragment URL playback works correctly
- `src/components/ActionVideoPopup.tsx` -- Ensure fragment URL playback works correctly
- `src/components/ClippedActionsPlayer.tsx` -- Ensure fragment URL playback works correctly

### Dependencies
No new packages needed.

