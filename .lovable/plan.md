

## Performance Optimization Plan

### Current Bottlenecks Identified

**Landing Page (biggest target):**
1. **Player3DEffect.tsx** (1422 lines) -- Heavy Three.js shader with simplex noise, 5-octave FBM, multiple SDF blob calculations, all running per-frame on a full-viewport WebGL canvas. This is the single heaviest asset.
2. **LandingImageWall.tsx** -- Fetches 100 images from the database on mount (even though they only show during X-ray hover). Loads all 100 `<img>` tags into the DOM immediately.
3. **usePerformanceCheck** -- Runs a 500ms frame-rate test before showing anything, causing a spinner delay on every visit (even on fast machines).
4. **FluidCursor** -- Global WebGL canvas running on every page (except landing). Adds overhead even when not visually needed on most pages.
5. **LandingImageWall positions** -- Recalculates masonry layout with `Math.random()` on every image count change, and updates container size on resize.

**PlayersIntro page:**
6. **useImagePreloader** -- Preloads up to 54 images in parallel before showing the page. On slow connections this blocks the entire view.

**Global:**
7. **All lazy pages use `Suspense fallback={<PageLoader />}`** which is fine, but `FluidCursor` is loaded globally on every route with its own WebGL canvas.

---

### Optimizations (no features removed)

#### 1. Skip the performance check spinner for fast devices
Currently `usePerformanceCheck` shows a loading spinner for 500ms while measuring FPS. Instead, run the cheap checks (WebGL, memory, cores, mobile, reduced-motion) synchronously and only fall back to the FPS test if all cheap checks pass. If cheap checks pass, show the full landing immediately and run the FPS test in the background -- if it fails, swap to static fallback after.

#### 2. Defer LandingImageWall fetch until X-ray activates
The image wall is invisible until the user moves their mouse (X-ray effect). Delay the database fetch and image loading until `xrayState.isActive` becomes true for the first time. This removes 100 image loads from initial page load.

#### 3. Reduce Player3DEffect shader complexity
- Reduce FBM octaves from 5 to 3 (the visual difference at these scales is minimal)
- Reduce `waterLobes` iterations from 4 to 3
- Reduce `splashDroplets` iterations from 4 to 3
- These halve the per-pixel computation cost with negligible visual difference

#### 4. Add `will-change` and GPU hints to key layers
Add `will-change: transform` to the player 3D container and light cone SVGs to promote them to compositor layers, reducing repaint cost.

#### 5. PlayersIntro: Lower preload threshold and show content faster
Reduce the threshold from 0.8 to 0.5 (show when 50% loaded instead of 80%), and batch-load in groups of 12 instead of all 54 at once. Show a CSS blur placeholder grid while remaining images load.

#### 6. Lazy-load FluidCursor only on non-landing routes where mouse is detected
Currently FluidCursor loads on every route. Add a check so it only initializes after the first `mousemove` event (not on touch devices at all), saving the WebGL setup cost on mobile entirely.

#### 7. Add `loading="lazy"` and `decoding="async"` to LandingImageWall images
When the image wall does load, use native lazy loading and async decoding so the browser doesn't block the main thread.

---

### Technical Details

**Files to modify:**
- `src/hooks/usePerformanceCheck.ts` -- Make cheap checks synchronous, defer FPS test
- `src/components/LandingImageWall.tsx` -- Defer fetch until first X-ray activation
- `src/components/Player3DEffect.tsx` -- Reduce shader loop iterations (lines ~193, ~251, ~311)
- `src/pages/PlayersIntro.tsx` -- Lower threshold to 0.5
- `src/hooks/useImagePreloader.ts` -- Batch loading in groups
- `src/components/LazyPlayer3D.tsx` -- Add `will-change: transform` to container
- `src/components/FluidCursor.tsx` -- Gate on first mousemove, skip on touch devices

**No files created or deleted. No features removed.**

