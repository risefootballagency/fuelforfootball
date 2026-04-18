
Plan

1. Re-check the full annotation chain against RISE, not just the playback component
- Diff these pairs thoroughly and sync the working behaviour over:
  - `src/components/portal/ReadOnlyAnnotationPlayback.tsx`
  - `src/components/staff/annotations/AnnotationEditor.tsx`
  - `src/components/staff/analysis/AnalysisPointsSection.tsx`
  - `src/pages/AnalysisViewer.tsx`
- The first pass only copied part of the RISE setup. The editor, viewer wiring, and URL/id lookup path still differ here.

2. Fix the most likely data-wiring break: annotation id lookup on analysis points
- RISE viewer uses the direct mapping:
  - `point.annotation_ids?.[url]`
  - `point.video_crops?.[url]`
- This project now uses `resolveMappedValue()` / `resolveAnnotationProjectId()` in the viewer, while the editor still saves annotation ids by exact video URL key.
- I will align the viewer back to the same direct key contract used by the editor and RISE, then only add minimal fallback handling for older data if needed.
- I will also audit trim/move/update flows in `AnalysisPointsSection.tsx` so annotation id and crop mappings stay attached when URLs change.

3. Sync the annotation editor to the current RISE implementation
- The local `AnnotationEditor.tsx` is behind RISE in several important places:
  - frame-accurate freeze capture
  - loop/reset handling for triggered annotations
  - video sizing/object-fit behaviour
  - autoplay/seek handling
- I will bring those RISE updates across so saved annotation timing and playback state match the working source project.

4. Sync the read-only playback logic end-to-end
- Keep the dual-database lookup needed in this project, but otherwise mirror the working RISE playback path.
- Specifically verify:
  - annotation project loads correctly
  - `klips -> elements` extraction matches the saved editor structure
  - rel-time vs clip-fragment timing matches editor `appearAt` values
  - freeze/render state is not suppressing annotations on mobile viewer playback
- If needed, I will also restore the exact RISE viewer usage pattern instead of the current custom mapping wrapper.

5. Verify analysis viewer point rendering against RISE
- Rework `AnalysisViewer.tsx` point video usage so it matches RISE’s proven annotation path.
- Check all analysis sections that render point videos, not just one branch, so pre-match, post-match, and concept flows all behave the same.

6. Audio button styling update
- Update `AudioPlaybackButton` so the analysis viewer version matches the fullscreen control scale:
  - same 36px circle as the fullscreen button (`w-9 h-9`)
  - smaller icon size to match
  - white icon/bars instead of dark green
- I will likely make this configurable via props so only the analysis viewer styling changes cleanly without risking other audio placements.

Files to update
- `src/components/portal/ReadOnlyAnnotationPlayback.tsx`
- `src/components/staff/annotations/AnnotationEditor.tsx`
- `src/components/staff/analysis/AnalysisPointsSection.tsx`
- `src/pages/AnalysisViewer.tsx`
- `src/components/AudioPlaybackButton.tsx`

Expected result
- Analysis annotations appear again in the viewer, matching the working RISE behaviour.
- Annotation timing and freeze display stay consistent with what was created in the editor.
- Audio button becomes white and the same size scale as the fullscreen button.

Technical note
- The strongest remaining mismatch I found is that this project’s viewer now resolves annotation ids through a generic mapping helper, while the editor still persists them by exact video URL key like RISE. That mismatch, combined with the local editor being behind the current RISE annotation stack, is the main area I would correct first before changing anything else.
