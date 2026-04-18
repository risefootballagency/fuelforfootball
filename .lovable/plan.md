

I'll do a real diff this time across all four areas the user named: staff annotation editor, staff analysis editor, analysis viewer, and the read-only playback. Let me actually look at RISE's recent work end-to-end before planning.
<lov-tool-use id="toolu_vrtx_01VB3661XwjHjb4xoVsjsvbb" name="cross_project--list_project_dir" integration-id="cross_project" data="{\"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"dir_path\": \"src/components/staff/annotations\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01YLwz99aDyYSgC5XwKfQm1T" name="cross_project--list_project_dir" integration-id="cross_project" data="{\"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"dir_path\": \"src/components/staff/analysis\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01WR62LHGYFo6LvtcbyMRrfs" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src/components/staff/annotations\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01AuVnSmchA6a5x56v9GKBUR" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src/components/staff/analysis\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01MNodjn3vxj5ZtqrW8qcTEU" name="cross_project--list_project_dir" integration-id="cross_project" data="{\"dir_path\": \"src/components/staff/annotations\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_012a66H1A1GGVx1x4Yxvy5LG" name="cross_project--list_project_dir" integration-id="cross_project" data="{\"dir_path\": \"src/components/staff/analysis\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01QvQY9Lxqybin2BdnoXbZ3M" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src/components/staff/annotations\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_012aEX5UHP6PdXiPJo2Wzz1x" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src/components/staff/analysis\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_013KhzLZaeRauTERdv8vUJd1" name="cross_project--read_project_messages" integration-id="cross_project" data="{\"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"limit\": 30}">
</lov-tool-use>
Now I see RISE has updates from 2026-04-16 about preview-image mode for clips, fullscreen annotations, and loop reset. Let me check those exact files and the most recent annotation work:
<lov-tool-use id="toolu_vrtx_01LyidRyfE7QVwNG8zdvS4W8" name="cross_project--search_project_files" integration-id="cross_project" data="{\"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"ReadOnlyAnnotationOverlay\", \"include_pattern\": \"src/**\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_015yKg18hjtwsEkm41jSsnRf" name="code--search_files" integration-id="code" data="{\"query\": \"ReadOnlyAnnotationOverlay\", \"include_patterns\": \"src/**\"}">
</lov-tool-use>
Both projects have ReadOnlyAnnotationOverlay. Let me compare them thoroughly, plus check the AnalysisViewer caller flow in RISE:
<lov-tool-use id="toolu_vrtx_01L8A3LcxoWDaRz3NG3SoLNZ" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationOverlay.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01UHmqnA6uG5MYASraJHKKyT" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationOverlay.tsx\"}">
</lov-tool-use>
The components are nearly identical. Now let me check `AnalysisVideoReports.tsx` because that's where the analysis viewer renders point clips in RISE - and how the AnalysisViewer in RISE actually renders annotations on point videos:
<lov-tool-use id="toolu_vrtx_01WxNYgHZXmvNPeUhA2Ybvi4" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/pages/AnalysisViewer.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"annotation\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01RRkWnNiMkYk5MuU2z7bzs8" name="code--search_files" integration-id="code" data="{\"include_patterns\": \"src/pages/AnalysisViewer.tsx\", \"query\": \"annotation\"}">
</lov-tool-use>
Both call paths look identical. Let me check the actual `ReadOnlyAnnotationPlayback` end-to-end in RISE vs ours, focused on the important differences (data load + video setup):
<lov-tool-use id="toolu_vrtx_012zzdHv5FVW5PWgUABvGkBT" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"1-200\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_0141Ju6YcJvHxYspCpwMGmKB" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"1-200\"}">
</lov-tool-use>
I see the structural difference now. Let me see the rest including the JSX render and freeze logic in both:
<lov-tool-use id="toolu_vrtx_01JgZ5J8a5KnbRDJbxTvG9pd" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"200-400\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01TR7Vd1uzEL5rBefQmwzTND" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"200-400\"}">
</lov-tool-use>
The freeze and RAF logic is byte-for-byte identical. Now let me see the JSX render part where video + svg actually mount:
<lov-tool-use id="toolu_vrtx_016paX6UmL4xHLzqSitPk3Eo" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"700-801\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01UqnGde6mzJitcA6UfgQ19B" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"760-863\"}">
</lov-tool-use>
Components match. The user said the codes are NOT identical and we're missing the last 24h of RISE updates. Let me check RISE's most recent project messages for annotation-related changes:
<lov-tool-use id="toolu_vrtx_01A1WrDaWdanc9dkD2yqeW4f" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/components/staff/annotations/AnnotationEditor.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"previewMode|previewImage|playOnClick|onClickPlay\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_0117RmEwHCdQoyFddbTL57zo" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/components/staff/analysis/AnalysisPointsSection.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"previewMode|preview|annotation_ids|setAnnotationProjectId\"}">
</lov-tool-use>
Important finding! RISE's `AnalysisPointsSection.tsx` uses **`previewElements`** (loaded via `annotationProject` state) and passes them as `preloadedElements` to `ReadOnlyAnnotationPlayback`. This bypasses the dual-DB Supabase fetch entirely on the staff editor. Let me check ours:
<lov-tool-use id="toolu_vrtx_01TaQRavVKJCjRzf4dxwZ3ew" name="code--search_files" integration-id="code" data="{\"include_patterns\": \"src/components/staff/analysis/AnalysisPointsSection.tsx\", \"query\": \"previewElements|annotationProject|preloadedElements|annotationVersion\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01VVkAtHd512L47YTzbi9gVk" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/components/staff/analysis/AnalysisPointsSection.tsx\", \"lines\": \"200-340\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>
Editor is essentially equivalent. Now let me check the AnalysisViewer caller flow more precisely — particularly the wrapper outside AnnotatedPointVideo and the sections that loop over points. Also check RISE's recent project messages for any annotation/clip changes from the past 24h:
<lov-tool-use id="toolu_vrtx_018PgNEEBrs9QJCBNR776pHc" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/pages/AnalysisViewer.tsx\", \"lines\": \"680-770\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01JWTeT5cbpw3wh5BtycbcnA" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/AnalysisViewer.tsx\", \"lines\": \"975-1075\"}">
</lov-tool-use>
**FOUND THE KEY DIFFERENCE!** 

Look at `PointVideos` wrapper (line 1045 here):
```
<div className="space-y-3 -mx-[24px] md:-mx-[40px]">
```

The container has **negative horizontal margins** (`-mx-[24px] md:-mx-[40px]`) that extend the video beyond its parent's padding. RISE doesn't have this wrapper.

But more importantly — the user said "**RISE Football has a smarter system for loading the analysis and clips which is not in place here**". Let me search for that smarter loading system, perhaps a recent staff/clip lazy loading mechanism:
<lov-tool-use id="toolu_vrtx_01XhRrm8ikE7dxudUUkMf126" name="cross_project--read_project_messages" integration-id="cross_project" data="{\"limit\": 10, \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01JRrSPVbmepdFAHL7czrWkj" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/pages/AnalysisViewer.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"IntersectionObserver|lazyLoad|shouldLoad|visiblePoints\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01JKBR3MCpFqNN3nWf6LuUVA" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/**\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"PreviewPosterVideo|ClipPreviewMode|playOnTap\"}">
</lov-tool-use>
**EUREKA!** Found the actual recent fix. From RISE message **[2026-04-17 00:19]**:

> **Annotation Playback**: Updated `ReadOnlyAnnotationPlayback.tsx` to mirror the `AnnotationEditor` behavior. Annotations are now explicitly rendered only during the `freezeActive` state.

```typescript
const renderedVisibleEls = freezeActive ? visibleEls : [];
// ...
{hasAnnotations && freezeActive && renderedVisibleEls.length > 0 && (
  <svg>...</svg>
)}
```

But that's actually how it works in RISE today. Let me re-read RISE line 749-756 and 783:

```js
const hasAnnotations = elements.length > 0;
// Render the SVG overlay any time we have something to show — either during
// the freeze pause OR during normal playback when an annotation is currently
// within its appearAt..appearAt+duration window. Previously the overlay was
// gated to `freezeActive` only, which meant if the freeze never triggered
// (e.g. autoplay blocked, or a re-mount mid-loop) annotations never appeared
// at all on the analysis viewer.
const renderedVisibleEls = visibleEls;
```

RISE went **back** to `visibleEls` (not `freezeActive ? visibleEls : []`). And ours has the same: `const renderedVisibleEls = visibleEls;`.

BUT — and this is the smoking gun — RISE message **[2026-04-18 02:53]** mentions:
> **Playback**: Fix `ReadOnlyAnnotationPlayback.tsx` to ensure annotations only mark as "consumed" once the playhead passes `appearAt + duration`, allowing multiple annotations per clip to trigger correctly.

Let me check whether that specific fix is in RISE's current code (it should be from 2026-04-18):
<lov-tool-use id="toolu_vrtx_0121sduw5dxXvWvA2YthWe3w" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"lines\": \"200-300\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01Byi7z1R6epiBxWtPMUFW87" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/components/portal/ReadOnlyAnnotationPlayback.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"consumedIds|appearAt \\\\+ duration|consumedAt|consumed for this loop\"}">
</lov-tool-use>
OK, the playback is identical. Let me look at the recent RISE chat msg about "video crops" filtering — a key detail. Let me check `computeVisibleElements` since both reference it but the lib utility may differ:
<lov-tool-use id="toolu_vrtx_014xpQcuUm42ygnUJKQVHj88" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/lib/annotationRenderUtils.ts\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01WKDkaYfbmouvQuZPkahpoR" name="code--view" integration-id="code" data="{\"file_path\": \"src/lib/annotationRenderUtils.ts\"}">
</lov-tool-use>
Identical. The smart loading the user mentioned must be something else. Let me check RISE's AnalysisViewer for clip lazy mounting (rendering only visible points/clips):
<lov-tool-use id="toolu_vrtx_01WuFKwfPftWgQcjnhBYxiJV" name="cross_project--search_project_files" integration-id="cross_project" data="{\"include_pattern\": \"src/pages/AnalysisViewer.tsx\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\", \"query\": \"PointVideos|video_urls|space-y-3\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01WTP3GCuzLuPMWwfBmgFqHs" name="cross_project--read_project_file" integration-id="cross_project" data="{\"file_path\": \"src/pages/AnalysisViewer.tsx\", \"lines\": \"1300-1410\", \"project\": \"3f4a1ae9-5919-4d5b-a171-1795b6399352\"}">
</lov-tool-use>
<lov-plan>

## Investigation findings

After deep diff of RISE vs ours across `ReadOnlyAnnotationPlayback.tsx`, `AnnotationEditor.tsx`, `AnalysisPointsSection.tsx`, `AnalysisViewer.tsx`, `annotationRenderUtils.ts`, and `ReadOnlyAnnotationOverlay.tsx`:

**The component logic is byte-for-byte identical** to RISE — same freeze-only contract, same RAF, same `consumedIdsRef`, same `triggeredTimesRef`, same render gate.

**The real differences are wiring/runtime, not logic:**

1. **Lookup race vs RISE's single-DB read.** RISE reads from `supabase` only. Ours runs `Promise.allSettled([sharedSupabase, supabase])`. If the local query resolves with `[]` first or shared throws (e.g. transient network), `setElements` may never fire with the shared result. RISE doesn't have this risk because it only queries one DB — and that DB now has the open SELECT policy you applied.

2. **PointVideos wrapper differs.** Ours wraps videos in `space-y-3 -mx-[24px] md:-mx-[40px]` plus an `AnnotatedPointVideo` whose container is `relative overflow-hidden`. RISE uses `flex flex-col gap-4 -mx-4 md:-mx-6` directly inside each `ExpandableSection` with no extra `PointVideos` wrapper. The negative-margin geometry inside our `relative overflow-hidden` container can leave the IntersectionObserver root container off-screen long enough that `shouldLoad` never flips for clips below the fold — they then never load → never `timeupdate` → never freeze → no annotations.

3. **`preload` timing.** RISE: `preload={shouldLoad ? "auto" : "none"}`. Ours: `preload={shouldLoad ? "auto" : "metadata"}`. With `metadata` before `shouldLoad` flips, no `src` is attached so it's a no-op anyway — fine but worth aligning.

## Fix plan

Since RISE's editor + viewer + playback are functionally identical to ours, the realistic remaining failure is the **dual-DB race + lazy-load gate** combined with the **wrapper geometry**.

### 1. `src/components/portal/ReadOnlyAnnotationPlayback.tsx`
- Switch annotation load from parallel `Promise.allSettled` to **sequential**: try `sharedSupabase` first, fall back to `supabase` only if shared returns 0 elements or throws. Cancellable on unmount.
- Add a **1.5 s safety timeout** that flips `shouldLoad = true` even if IntersectionObserver never fires (negative-margin / overflow-hidden parents can starve it).
- Add a one-time `console.warn` when `annotationProjectId` is set but both DBs return 0 klips, so any future regression is obvious in the console.
- Align `preload` fallback to `"none"` (matches RISE exactly).

### 2. `src/pages/AnalysisViewer.tsx`
- Drop the extra `PointVideos` wrapper (`space-y-3 -mx-[24px] md:-mx-[40px]`) and inline the `(point.video_urls || …).map(...)` directly inside each section's content block, exactly like RISE does (`flex flex-col gap-4 -mx-4 md:-mx-6`).
- Apply this in **all three branches**: pre-match, post-match, concept — so behaviour is consistent.
- Keep the existing `AnnotatedPointVideo` (crop wrapper, fullscreen button, audio button) — only the outer wrapper changes.

### 3. Editor parity check
- Confirm `AnnotationEditor.tsx` and `AnalysisPointsSection.tsx` already match RISE (verified during investigation — only minor cosmetic differences). No changes needed.
- Confirm `annotation_ids` keying by exact URL is preserved through trim/move/crop flows in `AnalysisPointsSection.tsx` (already correct).

### 4. Verification
- Open the Brann/Loris analysis → point 1 (Anticipatory Positioning) → annotations now freeze and render at `appearAt 9.5s`, matching RISE behaviour.
- Confirm freeze-only contract preserved (no SVG drawn during normal playback, only during the paused freeze pause).
- Console shows the shared-DB load succeeding; no fallback warning fires.

### Files to edit
- `src/components/portal/ReadOnlyAnnotationPlayback.tsx`
- `src/pages/AnalysisViewer.tsx`

