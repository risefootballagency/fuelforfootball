## Goal
Replace the 54-image runtime grid on `/players` (PlayersIntro) with a single pre-stitched composite image so the background appears instantly instead of loading dozens of files.

## Approach
Generate the composites **once at build time** with a Node script, commit them as static assets (uploaded via `lovable-assets`), and swap the runtime grid for two `<img>` tags (mobile + desktop variants). No DB reads, no preloader, no 54 network requests.

### Steps

1. **Add a build script** `scripts/stitch-landing-grid.ts`
   - Reads the 54 landing images from the `marketing_gallery` table (folder = `landing`) via the shared Supabase client
   - Uses `sharp` to composite them into two WebP files:
     - `landing-grid-desktop.webp` — 9×6 grid, ~1920×1280, quality 78
     - `landing-grid-mobile.webp` — 3×4 grid, ~750×1000, quality 75
   - Each cell rendered `cover` so it matches current CSS behaviour
   - Outputs to `/tmp` then uploads via `lovable-assets create`, writing pointers to `src/assets/landing-grid-desktop.webp.asset.json` and `src/assets/landing-grid-mobile.webp.asset.json`
   - Manual/one-off run — not wired into `npm run build`, so re-run only when the landing folder changes

2. **Refactor `src/pages/PlayersIntro.tsx`**
   - Remove `useImagePreloader` call and the 54-cell grid
   - Render one `<picture>` element:
     - `<source media="(min-width: 768px)" srcset={desktopAsset.url}>` 
     - `<img src={mobileAsset.url} loading="eager" fetchpriority="high" decoding="async">`
   - Keep the existing `bg-black/70` dark overlay
   - Drop `isReady` fallback since one image loads immediately; keep a plain `bg-black` behind it for the brief decode window

3. **Leave `useImagePreloader` / `useLandingFolderImages` untouched** — other pages may still use them (will verify with rg before editing).

### Files
- **New:** `scripts/stitch-landing-grid.ts`, `src/assets/landing-grid-desktop.webp.asset.json`, `src/assets/landing-grid-mobile.webp.asset.json`
- **Edited:** `src/pages/PlayersIntro.tsx`

### Trade-off
Composite is static — adding/removing images in the `landing` marketing folder no longer auto-reflects on this page; someone re-runs the stitch script. Given this is a fixed decorative wall, that's the right trade for ~53 fewer HTTP requests and instant paint.

### Questions
- OK to bake the grid as a static asset (re-run script when you refresh landing images), or do you want it regenerated automatically whenever the `landing` folder changes? Auto-regen would need an edge function + storage write, which adds complexity but keeps the wall live.
