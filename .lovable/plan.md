

## Plan

### Issue 1 — Annotations not rendering on Analysis Viewer (CRITICAL)

**Root cause** (verified by diffing `src/components/portal/ReadOnlyAnnotationPlayback.tsx` against the working RISE Football version):

Our local file has two mechanisms that RISE does not have, and together they completely suppress annotation rendering:

1. **`overlayBox` measurement gate** — our overlay only renders if `overlayStyle` (computed from `getBoundingClientRect()` on the video) is non-null. On first render, during cropped layout, or when the video is not yet measured, `overlayStyle` is `null` and the entire SVG is hidden. RISE simply uses `absolute inset-0 w-full h-full` with `aspect-video` and never measures.

2. **Freeze-only contract** — our RAF tick does `setVisibleEls([])` outside a freeze (line 283). Combined with `AnalysisViewer` passing `disableFreeze={true}`, the freeze branch never runs either, so `visibleEls` is always empty and nothing is ever rendered. RISE's RAF does `setVisibleEls(computed)` outside freeze, so annotations show during normal playback whenever they fall within their `appearAt..appearAt+duration` window.

Additional smaller deltas:
- RISE passes the video `src` lazily (IntersectionObserver gate via `shouldLoad`) — keeps many embedded clips performant. We don't have this.
- RISE uses `aspect-video` + `objectFit: fill` on both `<video>` and overlay so SVG always matches the video box geometry without measurement.
- RISE's freeze frame `<img>` is `absolute inset-0` (not positioned by measured overlayBox).

`AnalysisViewer.tsx` `AnnotatedPointVideo` currently passes `disableFreeze` and `visibilityTargetRef` — props that don't exist on RISE and that interact badly with our broken local logic. RISE's caller is much simpler.

**Fix** — replace `src/components/portal/ReadOnlyAnnotationPlayback.tsx` with the RISE implementation (preserving our shared-DB fallback for `annotation_projects` lookup, since this project uses dual-DB and RISE doesn't):

- Remove `overlayBox` / `updateOverlayBox` / ResizeObserver geometry measurement entirely.
- Remove `disableFreeze` and `visibilityTargetRef` props from the component signature.
- Restore RISE's RAF: `setVisibleEls(computed)` outside freeze (so annotations render during normal playback).
- Restore RISE's lazy `shouldLoad` IntersectionObserver gate for the video `src` (helps the analysis viewer with many clips).
- Restore RISE's `aspect-video` + `objectFit: fill` styling on `<video>`, `<svg>` and freeze `<img>` so SVG geometry trivially matches the video.
- Keep our dual-DB lookup: try `sharedSupabase` then `supabase` for `annotation_projects.klips`.
- Update `AnalysisViewer.tsx` `AnnotatedPointVideo` to drop `disableFreeze` and `visibilityTargetRef` (they no longer exist), matching RISE's much simpler caller.

Audit any other callers of `ReadOnlyAnnotationPlayback` for removed props (likely none, but I'll grep before committing).

### Issue 2 — "Offensive (12)" sticky headers should be FFF Yellow, not dark green

The headers currently use `text-primary` (dark forest green) in three places:

1. `src/components/report/RankedActionsPlayer.tsx:316` — Noted Reports + Full Match + Ranked Actions all share this player; this is the visible offender.
2. `src/components/ClippedActionsPlayer.tsx:307` — same sticky header pattern in the clipped actions player.
3. `src/components/staff/ActionTypeEditor.tsx:859` — staff editor category headers (smaller `h3`, but mentioned as "etc.").

**Fix** — change `text-primary` → `text-accent` (FFF Yellow per project tokens) on those three header lines. Leaves the `border-b border-border/20` and bg untouched.

### Files to edit

- `src/components/portal/ReadOnlyAnnotationPlayback.tsx` — rewrite to RISE structure + dual-DB lookup
- `src/pages/AnalysisViewer.tsx` — drop `disableFreeze` / `visibilityTargetRef` from `AnnotatedPointVideo`
- `src/components/report/RankedActionsPlayer.tsx` — `text-primary` → `text-accent` on category sticky header
- `src/components/ClippedActionsPlayer.tsx` — `text-primary` → `text-accent` on category sticky header
- `src/components/staff/ActionTypeEditor.tsx` — `text-primary` → `text-accent` on category h3

### Verification (after switch to default mode)

- Open an analysis viewer page with at least one point that has annotations on its clip → annotations now appear synced with playback (lines, arrows, circles, etc.).
- Open noted/full-match/ranked player from a performance report → category headers ("Offensive (12)", "Defensive (8)", etc.) render in FFF yellow.
- Open the staff Action Type Editor → category headers also render in FFF yellow.

