

## Plan: Port Recent RISE Commits (Past 72 Hours)

There are two categories of work: (A) fix the immediate OOM build error, and (B) port missing RISE features.

### A. Fix OOM Build Error (Blocker)

`Home.tsx` statically imports `Landing`, `Clubs`, `Scouts`, `Agents`, `Coaches`, `Media`, `Business`, `Dashboard`, `PlayersIntro` — all of which `App.tsx` lazy-loads. This defeats code splitting and contributes to the OOM crash during build.

**Fix**: Change `Home.tsx` to use `lazy()` + `Suspense` for all its subdomain components instead of static imports. This matches what `App.tsx` already does.

**File**: `src/pages/Home.tsx`

### B. Missing RISE Features (Past 72 Hours)

Based on the RISE commit history, the following are missing from this project:

#### 1. Swipe-to-close on ClippedActionsPlayer
RISE added swipe-to-close gesture to `ClippedActionsPlayer.tsx` (matching `RankedActionsPlayer.tsx` which already has it in this project). This project's `ClippedActionsPlayer.tsx` has no swipe support.

**File**: `src/components/ClippedActionsPlayer.tsx` — add `swipeY`, `swiping`, `touchStartY` state and touch handlers, apply transform/opacity style to `DialogContent`.

#### 2. Client clip extractor quality improvements
RISE's `clientClipExtractor.ts` has:
- Server-first strategy (calls `trim-video-clip` edge function before falling back to canvas)
- Direct `video.captureStream(0)` preference over canvas (better quality)
- VP9+Opus codec preference
- Resolution-scaled bitrate (~40Mbps for 1080p)

This project's version needs to be replaced with RISE's version.

**File**: `src/lib/clientClipExtractor.ts` — replace with RISE version (adapt import to use `sharedSupabase` for storage operations)

#### 3. Sound effects library
RISE has `src/lib/soundEffects.ts` with `playTick`, `playSuccess`, `playError`, `playNotification`, `playWelcome` — used in performance report saves and portal login. This project doesn't have it.

**New file**: `src/lib/soundEffects.ts`

#### 4. Player action frequency helper
RISE extracted `canonicalActionType` and `fetchPlayerActionFrequencies` into `src/lib/playerActionFrequency.ts` — a dedicated module with player-specific recency weighting. This project still has these inlined in `CreatePerformanceReportDialog.tsx`.

**New file**: `src/lib/playerActionFrequency.ts`
**Edit**: `src/components/staff/CreatePerformanceReportDialog.tsx` — import from the new module instead of inlining

#### 5. Background export service + ExportProgressFloat
RISE has `src/lib/backgroundExportService.ts` and `src/components/staff/ExportProgressFloat.tsx` for running clip-to-report exports in the background (survives navigation). This project has neither.

**New files**: `src/lib/backgroundExportService.ts`, `src/components/staff/ExportProgressFloat.tsx`
**Edit**: `src/pages/Staff.tsx` — import and render `ExportProgressFloat`

#### 6. Video split upload + LargeVideoProcessingModal
RISE has `src/lib/videoSplitUpload.ts` and `src/components/staff/coaching/LargeVideoProcessingModal.tsx` for handling files > 1.8GB via binary splitting + TUS. This project has neither.

**New files**: `src/lib/videoSplitUpload.ts`, `src/components/staff/coaching/LargeVideoProcessingModal.tsx`

#### 7. TUS resumable uploads in VideoAnalysis + AnalysisManagement + PlayerMatchClipper
RISE uses TUS (`tus-js-client`) for all video uploads with hybrid split flow, progress tracking, purge source button, refresh button. This project still uses standard `supabase.storage.upload()`. This is a large diff across 3 files — the VideoAnalysis component alone is 2650 lines in RISE.

**Files**: `src/components/staff/coaching/VideoAnalysis.tsx`, `src/components/staff/AnalysisManagement.tsx`, `src/components/portal/PlayerMatchClipper.tsx` — port TUS upload logic, hybrid flow integration, purge source button, and related state from RISE.

#### 8. invokeEdgeFunction adoption across staff components
RISE uses `invokeEdgeFunction` in 19 files. This project only uses it in 1 (`FixtureStatsEditor.tsx`). The remaining 15+ files still use raw `supabase.functions.invoke` calls.

**Files**: All staff components that call `supabase.functions.invoke` — replace with `invokeEdgeFunction` for proper error extraction.

#### 9. Database migration: multi-part video columns
RISE added `part_number`, `group_id`, `total_parts` columns to `video_analyses`. This project doesn't have them.

**Migration SQL**:
```sql
ALTER TABLE public.video_analyses
ADD COLUMN IF NOT EXISTS part_number INTEGER,
ADD COLUMN IF NOT EXISTS group_id UUID,
ADD COLUMN IF NOT EXISTS total_parts INTEGER;
CREATE INDEX IF NOT EXISTS idx_video_analyses_group_id ON public.video_analyses(group_id);
```

### Implementation Order

1. Fix OOM build error (`Home.tsx` lazy imports) — unblocks everything
2. New utility files (soundEffects, playerActionFrequency, videoSplitUpload, backgroundExportService)
3. New UI components (LargeVideoProcessingModal, ExportProgressFloat)
4. ClippedActionsPlayer swipe-to-close
5. clientClipExtractor quality upgrade
6. VideoAnalysis / AnalysisManagement / PlayerMatchClipper TUS + hybrid flow
7. invokeEdgeFunction adoption
8. Database migration for multi-part video columns
9. Staff.tsx integration (ExportProgressFloat render)

### Files Summary

**New** (6 files):
- `src/lib/soundEffects.ts`
- `src/lib/playerActionFrequency.ts`
- `src/lib/videoSplitUpload.ts`
- `src/lib/backgroundExportService.ts`
- `src/components/staff/coaching/LargeVideoProcessingModal.tsx`
- `src/components/staff/ExportProgressFloat.tsx`

**Edit** (7+ files):
- `src/pages/Home.tsx` (lazy imports fix)
- `src/components/ClippedActionsPlayer.tsx` (swipe-to-close)
- `src/lib/clientClipExtractor.ts` (server-first + quality)
- `src/components/staff/coaching/VideoAnalysis.tsx` (TUS, hybrid, purge, refresh)
- `src/components/staff/AnalysisManagement.tsx` (TUS)
- `src/components/portal/PlayerMatchClipper.tsx` (TUS, hybrid)
- `src/components/staff/CreatePerformanceReportDialog.tsx` (use playerActionFrequency module)
- `src/pages/Staff.tsx` (ExportProgressFloat)
- 15+ staff files (invokeEdgeFunction adoption)

