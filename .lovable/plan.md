

## Plan: Fix Post-Match Image Display and Staff Tab Text Color

### Issue 1: Post-Match Analysis Missing Match Image and Player Name

**Root Cause**: In `src/pages/AnalysisViewer.tsx` line 1551, the post-match section only checks `analysis.player_image_url`, completely ignoring `match_image_url`. The RISE project checks both and prioritizes `match_image_url` for post-match.

**Fix**: Update the post-match image section (lines ~1551-1615) to:
- Check `(analysis.player_image_url || analysis.match_image_url)` instead of just `analysis.player_image_url`
- Use `analysis.match_image_url || analysis.player_image_url` as the image source (prioritize match image)
- Match the RISE project's post-match layout structure (gold arch with player name oval, same as pre-match)

### Issue 2: Staff Header Tab Text Invisible (White on Gold)

**Root Cause**: In `src/pages/Staff.tsx` line 848-852, the active tab uses `text-fff-green-dark`. However, `fff-green-dark` is **not registered as a Tailwind color** in `tailwind.config.ts` — only `fff-gold` and `fff-orange` are registered. So `text-fff-green-dark` is silently ignored, and the text inherits the default light color.

The CSS variable `--fff-green-dark` exists in `index.css`, but there's no Tailwind color mapping.

**Fix** (two options, will use the simpler one):
- Replace `text-fff-green-dark` with `text-[hsl(var(--fff-green-dark))]` in the header tab classes (lines 848-860 of Staff.tsx)
- This applies to both the parent div class and the icon class on line 859

### Files to Change

1. **`src/pages/AnalysisViewer.tsx`** — Update post-match section (~line 1551) to check both image URLs and use the RISE-style layout with gold arch and player name oval
2. **`src/pages/Staff.tsx`** — Replace `text-fff-green-dark` with `text-[hsl(var(--fff-green-dark))]` on lines 850 and 859

