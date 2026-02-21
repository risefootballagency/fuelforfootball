

# Phase 1: Video Analysis, Annotations, and Core Sync

This phase focuses on the critical video analysis and annotation features that are missing compared to the RISE repository, plus supporting utilities.

---

## 1. New Utility Files

### A. `src/lib/titleCase.ts`
Copy from RISE: a `toTitleCase` function that capitalises each word and handles hyphens (e.g. "build-up" becomes "Build-Up").

### B. `src/lib/clientClipExtractor.ts`
Copy from RISE (adapting `supabase` import to `sharedSupabase`): client-side clip extraction using canvas + MediaRecorder. Trims a video segment and uploads to `analysis-videos/clips/{clipId}.webm`, returning the public URL. This is what makes clips independent files rather than fragment URLs.

### C. `src/lib/playerSorting.ts` -- Add `groupPlayersByStatus`
The current file has `sortPlayersByRepresentation` and `getStatusLabel` but is missing the `groupPlayersByStatus` function used by RISE for Select dropdowns with grouped player options. Add it.

---

## 2. Full VideoAnalysis.tsx Sync (473 lines to ~1841 lines)

Replace the current `VideoAnalysis.tsx` with the RISE version, adapting `supabase` imports to `sharedSupabase`. Key additions:

### A. Playback Speed Controls
- Speed steps: 0.25x, 0.5x, 1x, 2x, 4x, 8x
- Speed selector buttons overlaid on the video player (compact pill buttons)
- Visual indicator of current speed

### B. Keyboard Hotkeys
- Arrow Left/Right: 10s seek
- Shift: 30s forward
- Delete: instant clip at current position
- +/-: speed up/down
- 0: reset to 1x
- Hotkeys work even in fullscreen (capture phase, `onKeyDown` on video element prevents native handler interference)

### C. Clip `minute` Field (Editable)
- Each clip gets an editable `minute` field (mm:ss format) showing the match time
- Inline Input on the clip card, auto-populated from `fmtClipMinute` but manually overridable

### D. Clip Saved Toast in Fullscreen
- When clipping during fullscreen playback, a persistent "Clip saved" banner appears at bottom-right with auto-dismiss after 2.5s
- Uses absolute positioning within the video container so it's visible in fullscreen

### E. Link/Export Split
- "Link Clips" button: updates `linked_video_analysis_ids` on `player_analysis` to make clips available for selection on a report (without adding them as actions)
- "Export as Actions" button: uses `clientClipExtractor` to trim each clip into an independent file, then inserts them as actions on `performance_report_actions`
- Fallback to fragment URL if extraction fails

### F. Export to Analysis Points
- New export destination: "Analysis" tab in the export dialog
- Allows adding clips to a specific point on a pre-match or post-match analysis
- Each clip is extracted and its URL added to the point's `video_urls` array

### G. Clip-to-Action Attachment (Paperclip Button)
- Paperclip icon on each clip (shown when linked reports exist)
- Opens an "Attach Clip to Action" dialog listing all actions from linked reports
- Actions without clips shown prominently; actions with existing clips collapsed at bottom
- "Add new action here" insert buttons between each existing action
- Extracts clip file and attaches to the selected action (or creates a new one)

### H. Player Grouping in Dropdowns
- Uses `groupPlayersByStatus` for the player Select in both the upload form and export dialog
- Players grouped by representation status (Represented, Mandated, etc.) with group labels

### I. Annotation Badge on Clips
- Shows annotation count badge (pencil icon + count) on clips that have saved annotations in localStorage

### J. Annotation-Aware Export
- When exporting clips, checks for saved annotations via `getClipAnnotations`
- Includes `clip_annotations` field in the inserted action data

---

## 3. AnnotationEditor Props Sync

Update `AnnotationEditor.tsx` to accept two new optional props from RISE:

### A. `clipConstraint?: { start: number; end: number }`
- Constrains video playback to a specific time range when annotating a clip from Video Analysis
- Currently the annotation editor plays the full video; with this prop it restricts to the clip segment

### B. `autoPlay?: boolean`
- Auto-starts playback once video is loaded
- Used when opening the annotation editor from Video Analysis

---

## 4. ReadOnlyAnnotationOverlay (Portal)

### New file: `src/components/portal/ReadOnlyAnnotationOverlay.tsx`
Copy from RISE: an SVG overlay component that renders saved annotations during portal video playback. Supports all annotation element types (lines, arrows, curved arrows, rects, circles, spotlights, player markers, vision cones, semi-circles, points). Uses `computeVisibleElements` for timing and reads annotations from the video's metadata.

---

## 5. Staff.tsx -- Hidden Class Pattern for Stateful Sections

Update the rendering of VideoAnalysis, AnnotationProjects, PlayerManagement, and AnalysisManagement from conditional rendering (`&&`) to the `hidden` class pattern:

```
// Before:
{expandedSection === 'videoanalysis' && <VideoAnalysis />}

// After:
<div className={expandedSection === 'videoanalysis' ? '' : 'hidden'}><VideoAnalysis /></div>
```

This preserves component state (video playback position, popup state, etc.) when switching between tabs.

---

## 6. ScatterComparisonChart (Portal)

### New file: `src/components/portal/ScatterComparisonChart.tsx`
Copy from RISE: a scatter plot for player comparison data with dual metric axis selectors. Features X-marker data points, hover/click interaction, glossy dark gradient background, and animated info panel. Depends on `ComparisonPlayerData` metrics -- will check if this component exists and stub minimal metric data if needed.

---

## Technical Details

### New Files
- `src/lib/titleCase.ts`
- `src/lib/clientClipExtractor.ts`
- `src/components/portal/ReadOnlyAnnotationOverlay.tsx`
- `src/components/portal/ScatterComparisonChart.tsx`

### Modified Files
- `src/lib/playerSorting.ts` -- add `groupPlayersByStatus` function
- `src/components/staff/coaching/VideoAnalysis.tsx` -- full replacement with RISE version (adapted imports)
- `src/components/staff/annotations/AnnotationEditor.tsx` -- add `clipConstraint` and `autoPlay` props
- `src/pages/Staff.tsx` -- hidden class pattern for 4 sections

### No Database Changes
The `linked_video_analysis_ids`, `video_analysis_id`, and `clip_id` columns were already added in the previous migration.

### Dependencies
No new packages needed.

