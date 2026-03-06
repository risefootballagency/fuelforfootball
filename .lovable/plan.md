

## Plan: Port Remaining RISE Features

After thorough comparison of both projects, here is everything still missing or diverged.

### A. Fix OOM Build Error (Blocker)

The build is crashing with heap OOM. The `Home.tsx` lazy-import fix was applied but the build still fails. This needs investigation -- likely the new files added (music player, large video modal, etc.) or other heavy static imports are contributing. The immediate fix is to audit the largest static import chains and ensure aggressive code splitting.

**Action**: Read `Home.tsx` to verify lazy imports took effect, then check if any other route-level pages have heavy static imports that should be lazy.

### B. invokeEdgeFunction Adoption (43 files still using raw calls)

RISE uses `invokeEdgeFunction` in 19 files. This project has 46 files with raw `supabase.functions.invoke` calls. This is the largest mechanical diff.

**Files to update** (all files from the search results): `RecruitmentManagement.tsx`, `ServiceDetail.tsx`, `PlaylistPlayer.tsx`, `PlaylistManager.tsx`, `ContractCrossReference.tsx`, `CreatePerformanceReportDialog.tsx`, `CognisanceSection.tsx`, `AnalysisComparisons.tsx`, `R90RatingsViewer.tsx`, `LanguageContext.tsx`, `useAutoTranslate.ts`, `AIWriter.tsx`, `BTLWriter.tsx`, `ImageCreator.tsx`, `SalesDeck.tsx`, `PostContent.tsx`, `IdeasReview.tsx`, `ContentCalendar.tsx`, `AISessionSuggestions.tsx`, `StaffPushNotifications.tsx`, `AnalysisManagement.tsx`, `ProgrammingManagement.tsx`, `EmailResponseDialog.tsx`, `ClubRatings.tsx`, `ComparisonPlayerData.tsx`, `ScoutingCentre.tsx`, and others.

**Pattern**: Replace `await supabase.functions.invoke('fn-name', { body })` with `await invokeEdgeFunction('fn-name', { body })` (or `invokeEdgeFunction('fn-name', { body }, localSupabase)` when using a non-default client).

### C. Missing Utility Libraries (2 files)

RISE has these that this project lacks:
1. `src/lib/actionSorting.ts` -- `parseMinuteToSeconds` and `sortActionsByMinute` for chronological action ordering
2. `src/lib/actionSuggestionEngine.ts` -- Rule-based action suggestion from Roboflow tracking JSON (possession, shots, duels heuristics)

### D. Missing Components (6 files)

1. `src/components/staff/coaching/RoboflowTracking.tsx` -- Computer vision tracking integration using Roboflow + action suggestion engine
2. `src/components/staff/DatasetBuilder.tsx` -- Dataset builder for training data (frame capture, annotation, YOLO export)
3. `src/components/staff/DatasetAnnotationCanvas.tsx` -- Bounding box / point / line annotation canvas for dataset frames
4. `src/components/staff/DatasetFrameCapture.tsx` -- Video frame capture dialog for dataset building
5. `src/components/staff/AiShellSuggestions.tsx` -- AI shell suggestions component for staff sections
6. `src/components/portal/PortalWelcomeModal.tsx` -- Welcome onboarding modal for new portal users

### E. Missing/Diverged Portal Feature

`src/lib/portalTranslations.ts` -- RISE has 706 lines of portal UI translations. This project doesn't have it, meaning all portal translation `t()` calls would fail silently.

### F. Edge Functions Missing from config.toml

RISE has these registered that this project doesn't:
- `trim-video-clip`
- `generate-shell-suggestions`
- `process-video-frames`
- `fill-action-scores`
- `find-r90-rating`
- `split-r90-ratings`
- `translate-report-content`

These need registering in `supabase/config.toml` (and corresponding edge function code if not already deployed).

### G. TUS Upload Integration (Carried Over)

Still pending from previous plan: port TUS resumable upload logic into `VideoAnalysis.tsx`, `AnalysisManagement.tsx`, and `PlayerMatchClipper.tsx`.

### H. CreatePerformanceReportDialog Refactor (Carried Over)

Use `playerActionFrequency.ts` module instead of inlined logic.

### Implementation Order

1. Fix OOM build (investigate and resolve)
2. New utility files (`actionSorting.ts`, `actionSuggestionEngine.ts`, `portalTranslations.ts`)
3. New components (`RoboflowTracking`, `DatasetBuilder`, `DatasetAnnotationCanvas`, `DatasetFrameCapture`, `AiShellSuggestions`, `PortalWelcomeModal`)
4. Edge function config registrations
5. `invokeEdgeFunction` mass adoption (~43 files, mechanical replacement)
6. TUS upload integration (3 files)
7. `CreatePerformanceReportDialog` refactor

### Files Summary

**New** (8 files):
- `src/lib/actionSorting.ts`
- `src/lib/actionSuggestionEngine.ts`
- `src/lib/portalTranslations.ts`
- `src/components/staff/coaching/RoboflowTracking.tsx`
- `src/components/staff/DatasetBuilder.tsx`
- `src/components/staff/DatasetAnnotationCanvas.tsx`
- `src/components/staff/DatasetFrameCapture.tsx`
- `src/components/staff/AiShellSuggestions.tsx`
- `src/components/portal/PortalWelcomeModal.tsx`

**Edit** (~50 files):
- `supabase/config.toml` (register missing edge functions)
- ~43 files for `invokeEdgeFunction` adoption
- `src/components/staff/coaching/VideoAnalysis.tsx` (TUS)
- `src/components/staff/AnalysisManagement.tsx` (TUS)
- `src/components/portal/PlayerMatchClipper.tsx` (TUS)
- `src/components/staff/CreatePerformanceReportDialog.tsx` (playerActionFrequency module)

This is a large batch. Given message size limits, implementation will need to be split across multiple messages, starting with the OOM fix and new files, then the mechanical `invokeEdgeFunction` replacement, then TUS.

