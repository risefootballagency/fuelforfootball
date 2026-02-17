
# Sister Site (mitchfox/riseagency) Full Sync Plan

This plan covers all missing features and differences between the current project and the sister site repository at `github.com/mitchfox/riseagency`. The differences are extensive -- approximately **15+ new component files** and **4 major file rewrites**.

---

## Summary of All Differences

### A. Entirely Missing Components (new files to create)

**`src/components/report/` (new directory -- 4 files)**
1. **R90FlowChart.tsx** -- Line chart showing R90 score flow across the match timeline
2. **ActionHeatmap.tsx** -- Period-based "grade map" heatmap of action scores
3. **ChanceCreationFlow.tsx** -- Visualizes xC (chance creation) data by movement type
4. **RankedActionsPlayer.tsx** -- Video player that plays action clips ranked by score or chronologically

**`src/components/portal/` (10 missing files)**
5. **ParallaxHero.tsx** -- Fullscreen parallax image hero with player name/club overlay and next fixture countdown
6. **NextFixtureCountdown.tsx** -- Countdown timer to next match
7. **AnalysisComparisons.tsx** -- Side-by-side stat comparison between matches
8. **AnalysisDataTab.tsx** -- Dedicated analysis data tab for the portal
9. **AnalysisVideoReports.tsx** -- Video-based analysis reports display
10. **GoalTracking.tsx** -- Goal/target tracking for players
11. **InjuryLog.tsx** -- Injury tracking and history log
12. **NutritionProgramDisplay.tsx** -- Portal view for nutrition programmes
13. **PlayerMatchClipper.tsx** -- Match video clipping tool for players
14. **RadarChart3D.tsx** -- 3D radar chart for stat visualization
15. **ScoutingComparisonMatrix.tsx** -- Scouting data comparison matrix

**`src/components/` (2 missing files)**
16. **ActionVideoPopup.tsx** -- Fullscreen video popup for individual action clips (auto-opens fullscreen, iOS Safari support)
17. **ClippedActionsPlayer.tsx** -- Sequential clip player with prev/next/play/pause controls

**`src/components/dashboard/` (2 missing files)**
18. **NewsFeed.tsx** -- Player inbox/news feed component shown below schedule on Hub
19. **QuickStatsComparison.tsx** -- Quick stat comparison widget at bottom of Hub

**`src/lib/` (1 missing file)**
20. **confetti.ts** -- Gold-themed confetti effect fired on personal best R90 score

**`src/components/staff/` (1 missing file)**
21. **NutritionProgramManagement.tsx** -- Separate nutrition program management (imported by PlayerManagement in sister site)

---

### B. Major File Differences (files that exist but need significant updates)

**1. Hub.tsx (804 lines -> 924 lines)**
- Replace infinite-scroll image carousel with `ParallaxHero` component (parallax hero with fixture countdown)
- Add `NewsFeed` component below schedule
- Add `QuickStatsComparison` section before aphorism
- Add confetti effect on personal best R90
- Add post-match analysis fetching and PRE/POST buttons on performance items
- Add `onNavigateToComparisons` and `onNavigateToSchedule` props
- Add `imageFocalPoints` state for focal point-aware image display
- Add `teamSessionValue` display in schedule cells (bottom 1/4 with team training label)
- Restructure schedule cell layout to 3-tier (date top, session middle, team bottom)
- Simplified image fetching (no category filter, no name-based fallback)
- Remove `localSupabase` -- use regular `supabase`
- Color adjustments (gold references use `hsl(43,49%,61%)` instead of CSS vars in some places)

**2. PerformanceReportDialog.tsx (393 lines -> 883 lines)**
- Add `formatMinute` helper (MM.SS format)
- Add `video_url` field to PerformanceAction interface
- Add `html2canvas` image export (Save as WebP on desktop, PNG on mobile with long-press)
- Add video clip playback per action (ActionVideoPopup integration)
- Add ClippedActionsPlayer for sequential clip playback
- Add graphics buttons row: R90 Flow, Period Grade Map, Chance Creation Flow, Full Match Video, Ranked Actions
- Add R90FlowChart, ActionHeatmap, ChanceCreationFlow toggle panels
- Add RankedActionsPlayer dialog (chronological and ranked modes)
- Add auto-calculated ratios section (Recovery/Turnover, PP/Turnovers, Aerial Win %, Pass Completion %, Dribble Success %, Tackle Success %, xG per Shot)
- Enhanced `getAdvancedStats` with paired stat patterns (success/attempted with percentage display)
- Use STAT_TYPE_CONFIGS for label formatting
- Show per90 values only for rate-based stats (xG, xA, xC types)
- Enhanced mobile layout (compact action cards with video buttons)
- Remove PDF save button, replace with image save
- Use `useRef` for contentRef (html2canvas capture area)

**3. PlayerManagement.tsx (4248 lines -> 4302 lines)**
- Add `NutritionProgramManagement` import and integration
- Add `ChevronUp` and `FileDown` icons
- Various data tracking and display updates

**4. Dashboard.tsx (4551 lines -> 4792 lines)**
- Add `framer-motion` imports (motion, AnimatePresence)
- Add `PageLoading`, `LoadingSpinner` components
- Various portal section updates to match new components

---

### C. Dependencies to Add

- `canvas-confetti` -- for the confetti celebration effect

---

## Implementation Sequence

Due to the massive scope (~20 new files + 4 major rewrites), this should be done in phases:

### Phase 1: Foundation Components
Create the utility and shared components first:
- `src/lib/confetti.ts`
- `src/components/ActionVideoPopup.tsx`
- `src/components/ClippedActionsPlayer.tsx`
- `src/components/report/R90FlowChart.tsx`
- `src/components/report/ActionHeatmap.tsx`
- `src/components/report/ChanceCreationFlow.tsx`
- `src/components/report/RankedActionsPlayer.tsx`

### Phase 2: Performance Reports Rewrite
Update `PerformanceReportDialog.tsx` with all new graphics, video playback, image export, calculated ratios, and paired stats.

### Phase 3: Portal Components
Create all new portal components:
- `ParallaxHero.tsx`, `NextFixtureCountdown.tsx`, `NewsFeed.tsx`, `QuickStatsComparison.tsx`
- `AnalysisComparisons.tsx`, `AnalysisDataTab.tsx`, `AnalysisVideoReports.tsx`
- `GoalTracking.tsx`, `InjuryLog.tsx`, `NutritionProgramDisplay.tsx`
- `PlayerMatchClipper.tsx`, `RadarChart3D.tsx`, `ScoutingComparisonMatrix.tsx`

### Phase 4: Hub Rewrite
Update `Hub.tsx` with ParallaxHero, NewsFeed, QuickStatsComparison, confetti, PRE/POST buttons, and schedule redesign.

### Phase 5: Dashboard & Player Management
Update `Dashboard.tsx` and `PlayerManagement.tsx` to integrate all new portal components and NutritionProgramManagement.

---

## Technical Notes

- The sister site uses `supabase` (single client) while this project uses `sharedSupabase` for cross-site data. All imports from the sister site code will need to be adapted to use the appropriate client (`sharedSupabase` for player/analysis data, `localSupabase` for local-only data).
- The sister site uses `hsl(43,49%,61%)` as its gold color in many places -- this project uses `hsl(47,100%,51%)` as the accent. Color references will need to be mapped appropriately.
- The `canvas-confetti` package needs to be installed as a dependency.
- Some sister site components reference a `fixtures` table -- verify this table exists in the current database or create it.
- The `LoadingSpinner` component referenced in Dashboard/Hub may need to be created or adapted from an existing loading pattern.
