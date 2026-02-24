

# Phase 1 Completion + Analysis Viewer Sync (No flipBackground)

## Summary

Completes remaining Phase 1 items and syncs the Analysis Viewer with RISE, excluding the `flipBackground` alternating black section backgrounds which are RISE-specific branding and don't fit the FFF visual identity.

---

## 1. AnnotationEditor -- Complete autoPlay and clipConstraint ✅

### A. autoPlay Effect
Add a `useEffect` that auto-starts playback once video metadata loads. If `clipConstraint` is provided, seek to the start time before playing.

### B. Video src with clipConstraint fragment URL
Append `#t=start,end` media fragment to the video src when `clipConstraint` is provided so the browser restricts playback range.

---

## 2. Staff.tsx -- Hidden Class Pattern ✅

Switch 4 sections from conditional rendering (`&&`) to `hidden` class pattern to preserve component state (video position, popups, etc.) when switching tabs:
- `videoanalysis`
- `annotations`
- `players`
- `analysis`

---

## 3. Analysis Viewer Sync with RISE (excluding flipBackground) ✅

### A. `video_urls` array support ✅
Add support for `point.video_urls` (array) alongside the existing singular `point.video_url`. Render multiple videos when the array is present.

### B. Post-match Strengths/Improvements -- colour-coded cards ✅
Parse `strengths_improvements` text for colour markers (`[green]`, `[amber]`, `[red]`). Render in 3 categorised cards:
- "Strengths" (green border/header)
- "Areas for Consistency" (amber)
- "Areas for Improvement" (red)

### C. Fix TextReveal animation ✅
Switch from `whileInView` to `animate` so animations trigger correctly inside collapsed/expandable sections.

### D. Add `showNumber` guard to PlayerKit ✅
Only render the shirt number when it is non-empty and not '0'.

### E. Add `pageLoaded` state ✅
Delayed state (1.5s) for future video loading optimisation.

### F. AudioPlaybackButton integration ✅
Render a play/stop button with animated audio bars for any point that has an `audio_url`.

---

## 4. New Component: AudioPlaybackButton ✅

### `src/components/AudioPlaybackButton.tsx`
- Floating play/stop button with animated audio bars using framer-motion
- Uses the browser `Audio` API
- Styled with FFF gold accent (not RISE blue)
- Continues playing when user scrolls away

---

## Technical Details

### New Files
- `src/components/AudioPlaybackButton.tsx`

### Modified Files
- `src/components/staff/annotations/AnnotationEditor.tsx` -- autoPlay effect, clipConstraint fragment URL
- `src/pages/Staff.tsx` -- hidden class pattern for 4 sections
- `src/pages/AnalysisViewer.tsx` -- video_urls array, colour-coded improvements, TextReveal fix, showNumber guard, AudioPlaybackButton, pageLoaded state

### No Database Changes
### No New Dependencies
