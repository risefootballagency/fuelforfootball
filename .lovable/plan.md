

# Missing RISE Features in FFF Analysis Writer

## Differences Found

After comparing both codebases line-by-line, here are all missing features:

### 1. TUS Resumable Video Uploads (RISE lines 537-643)
FFF uses basic `supabase.storage.upload()` for videos. RISE uses `tus-js-client` for resumable uploads with 6MB chunking, retry delays, and a 50GB file size limit. This is critical for large match video files.

### 2. AI Restyle Mode (RISE `generateWithAI` lines 920-1063)
RISE's AI generation requires existing content first ("Please write some content first - AI will restyle it, not create new content"). It takes the user's draft and restyles it using stored examples. FFF's version generates content from scratch using prompts, which is a fundamentally different approach.

### 3. Generate Overview From Points (`generateOverviewFromPoints`, RISE lines 1067-1141)
RISE has a dedicated function that takes existing key_details and/or points content and restyles them into an overview paragraph using AI. FFF's AnalysisOverviewSection has no `generateOverviewWithAI` prop or `onOpenSettings` prop for managing overview examples.

### 4. Tagged Players (`taggedPlayerIds` / `analysis_player_tags` table)
RISE supports tagging multiple players to an analysis (separate from the single player link via `analysis_writer_id`). The `AnalysisMatchDetails` component has `showPlayerLinking`, `taggedPlayerIds`, and `setTaggedPlayerIds` props. FFF has none of this.

### 5. `analysis_player_tags` Table + `fetchLinkedPlayers` Enhancement
RISE's `fetchLinkedPlayers` also queries `analysis_player_tags` to merge tagged players with linked players. FFF only queries `player_analysis.analysis_writer_id`.

### 6. Performance Report Clips (`performanceReportClips`)
RISE fetches `performance_report_actions` clips when a performance report is selected and passes them to `AnalysisPointsSection` via `performanceReportClips` prop. FFF has no equivalent.

### 7. Action Reports Tab in Analysis List
RISE's analysis list has 4 tabs: Pre-Match, Post-Match, Concepts, Action Reports. The Action Reports tab renders `<ActionReportsList>`. FFF has the same 4 tabs but with "Other" instead of "Action Reports" in the last position.

### 8. Concepts from `coaching_analysis` Table
RISE fetches concepts from `coaching_analysis` table (shared with coaching database) via `fetchConcepts` and renders them with `renderConceptsList`. FFF renders concepts from the `analyses` table with type "concept".

### 9. `defaultPlayerId` Context Preservation
RISE preserves the Athlete Centre's selected player context when closing dialogs (`defaultPlayerId || "none"`) and auto-tags the default player. FFF resets to "none" on close.

### 10. Stable Point IDs (`_id`)
RISE assigns `_id: crypto.randomUUID()` to each point for stable drag-and-drop keys. FFF's points have no stable IDs.

### 11. `logActivity` on Delete
RISE calls `logActivity({ action: 'deleted', entityType: 'analysis', entityId: id })` when deleting analyses. FFF does not.

### 12. AnalysisOverviewSection Missing Props
FFF's `AnalysisOverviewSection` is missing: `generateOverviewWithAI`, `aiGenerating`, `onOpenSettings` props. RISE's version has AI generate button and settings gear icon next to Key Details.

### 13. AnalysisMatchDetails Missing Props
FFF's `AnalysisMatchDetails` is missing: `showPlayerLinking`, `taggedPlayerIds`, `setTaggedPlayerIds`, `defaultPlayerId` props. RISE's version has the full player tagging UI for post-match analyses.

### 14. AnalysisPointsSection Missing Features
FFF's `AnalysisPointsSection` is missing: `performanceReportClips`, `analysisId` props, drag-and-drop reordering (DnD Kit), AudioRecorder, VideoTrimmerDialog, AnnotationEditor integration, clip insertion from performance reports, and multi-video support (`video_urls` array).

---

## Implementation Plan

### Batch 1 — Database: `analysis_player_tags` Table
Create the `analysis_player_tags` table with `analysis_id` (UUID, FK to analyses) and `player_id` (UUID) columns, plus RLS policies.

### Batch 2 — AnalysisManagement.tsx Core Logic
Port all missing state and functions from RISE:
- Add `taggedPlayerIds`, `concepts`, `performanceReportClips`, `activeListTab` state
- Add `fetchConcepts`, `fetchPerformanceReportClips` functions
- Update `fetchLinkedPlayers` to also query `analysis_player_tags`
- Update `handleOpenDialog` to load tagged players and assign stable `_id` to points
- Update `handleCloseDialog` to preserve `defaultPlayerId` context
- Update `handleSave` to save/delete `analysis_player_tags`
- Update `addPoint` to include `_id: crypto.randomUUID()`
- Add `generateOverviewFromPoints` and `handleOpenOverviewSettings`
- Update `generateWithAI` to use restyle approach (require existing content)
- Add `logActivity` call on delete
- Update TUS resumable upload for `handleVideoUpload` and `handleVideoUploadForPoint`
- Wire new props to `AnalysisMatchDetails`, `AnalysisOverviewSection`, `AnalysisPointsSection`

### Batch 3 — AnalysisMatchDetails: Player Tagging UI
Add `showPlayerLinking`, `taggedPlayerIds`, `setTaggedPlayerIds`, `defaultPlayerId` props. Render the multi-player tagging UI (Select dropdown + tag badges with remove button) for post-match analyses.

### Batch 4 — AnalysisOverviewSection: AI Generate + Settings
Add `generateOverviewWithAI`, `aiGenerating`, `onOpenSettings` props. Render AI generate button and settings gear icon next to Key Details label.

### Batch 5 — AnalysisPointsSection: Clips + Multi-Video
Add `performanceReportClips` and `analysisId` props. Support `video_urls` array per point. Add clip insertion from linked performance report actions.

### Batch 6 — Analysis List UI: Action Reports Tab
Replace "Other" tab value with "action-reports" and render `<ActionReportsList>` inside it. Add `renderConceptsList` for concepts from `coaching_analysis` table.

### Technical Notes
- TUS uploads require the `tus-js-client` package (already installed as a transitive dep of Supabase, but may need explicit import)
- All AI calls use existing `supabase.functions.invoke('ai-write', ...)` pattern
- `logActivity` import from `@/lib/activityLogger` (check if exists in FFF)
- `sortPlayersByRepresentation` import from `@/lib/playerSorting` (check if exists)
- No new edge functions needed; existing `ai-write` handles all generation types

