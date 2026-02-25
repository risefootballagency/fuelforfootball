

# Full Audit: FFF vs RISE — Complete Differences

---

## STAFF COMPONENTS — Missing from FFF

| File | What it does | Priority |
|------|-------------|----------|
| `PortalManagement.tsx` (staff root) | Staff-side portal admin — player email lookup, feature toggles, hero management. FFF has a `sales/PortalManagement.tsx` which is the sales version, NOT the same component. RISE imports from `@/components/staff/PortalManagement` at root level. | HIGH |
| `SportscodeActionTypes.tsx` | 304-line action type CRUD manager for Sportscode XML integration | HIGH |
| `HighlightCompiler.tsx` | Highlight reel compilation tool — batch compiling clips into reels | HIGH |
| `RecruitmentRulesTab.tsx` | Recruitment rules configuration tab | MEDIUM |
| `StreamsSection.tsx` | RISE uses `StreamsSection.tsx`, FFF has `StreamsManagement.tsx` — different file, needs sync check | MEDIUM |
| `DocsSection.tsx` / `SheetsSection.tsx` | RISE has these at staff root level; FFF moved them to `staff/sections/` subdirectory. FFF Staff.tsx imports from `sections/` which is correct for FFF. | LOW (just path difference) |

## STAFF SUB-DIRECTORIES — Missing Files

### `coaching/`
| File | Notes |
|------|-------|
| `AIPlayerDetection.tsx` | AI-powered player detection from video. FFF has `ServiceAudit.tsx` instead (FFF-specific). | 

### `marketing/`
| File | Notes |
|------|-------|
| `CustomResourcesManager.tsx` | Custom marketing resource management |
| `ScheduleManager.tsx` | Post scheduling. FFF has `ContentCalendar.tsx` and `AIWriter.tsx` instead (FFF-specific additions). |

### `widgets/`
| File | Notes |
|------|-------|
| `FinancialOverviewWidget.tsx` | Dashboard financial overview widget |
| `VisionBoardWidget.tsx` | Vision board widget for dashboard |

### `design/`
| File | Notes |
|------|-------|
| `DesignStudio.tsx` | RISE has this in `design/` subdirectory. FFF has `DesignCanvas.tsx` in `design/` plus a wrapper `DesignStudio.tsx` at staff root that just renders `DesignProjects`. The RISE `design/DesignStudio.tsx` is the actual canvas component. Need to check if FFF's `DesignCanvas.tsx` is equivalent. |

---

## PORTAL COMPONENTS — Missing from FFF

| File | What it does |
|------|-------------|
| `AnimatedCounter.tsx` | Animated number counter for stats display |
| `MobileBottomNav.tsx` | Mobile bottom navigation bar for portal |
| `PortalEmptyState.tsx` | Empty state UI placeholder |
| `PortalSkeleton.tsx` | Loading skeleton for portal sections |
| `SectionDivider.tsx` | Visual section divider |

FFF has extra portal components RISE doesn't: `AllReportsSection.tsx`, `ProgressSummary.tsx`, `RadarChart3D.tsx`, `ReadOnlyAnnotationOverlay.tsx`, `ScatterComparisonChart.tsx`, `ScoutingComparisonMatrix.tsx`, `GoalTracking.tsx` — these are FFF-specific and should stay.

---

## PLAYER COMPONENTS — Missing from FFF

| File | What it does |
|------|-------------|
| `PlayerProgrammingNotes.tsx` | Player programming notes display |

---

## TOP-LEVEL COMPONENTS — Missing from FFF

| File | What it does |
|------|-------------|
| `HeroVideoPlayer.tsx` | Hero video player component |
| `MarketingGallery.tsx` | Marketing gallery browser (FFF has `MediaGallery.tsx` — may overlap) |
| `PlayerReportDialog.tsx` | Player report dialog |
| `ScrollProgressBar.tsx` | Scroll progress indicator bar |
| `SequentialLazyVideo.tsx` | Sequential video lazy loading |
| `PageLoading.tsx` | RISE imports `PageLoading` from `LoadingSpinner`. FFF has a separate `PageLoading.tsx` component. Need sync check. |

---

## RADIAL MENU — Missing from FFF

| File | Notes |
|------|-------|
| `StarsQuadrantCard.tsx` | RISE-specific "Stars" page quadrant. Skip unless FFF has equivalent. |

---

## HOOKS — Missing from FFF

| Hook | What it does |
|------|-------------|
| `useFormGradeConfigs.ts` | 256-line form grade threshold configs. RISE Dashboard.tsx imports this; FFF Dashboard.tsx does NOT. |
| `useImagePreloader.ts` | FFF has this, RISE does not — FFF-specific, keep. |
| `useMarketingGalleryImages.ts` | FFF-specific, keep. |
| `useArticleServiceRecommendation.ts` | FFF-specific, keep. |

---

## PAGES — Missing from FFF

### Worth copying (functional, not RISE-branding):
| Page | Notes |
|------|-------|
| `AgentRequests.tsx` | Agent request management |
| `AuthCallback.tsx` | OAuth callback handler |
| `BetweenTheLines.tsx` | BTL content page |
| `LearnMorePage.tsx` | Learn more info page |
| `OpenAccess.tsx` | Open access content |
| `Packages.tsx` | Packages/pricing display |
| `PerformancePage.tsx` | Performance data page |
| `PlayerJourney.tsx` | Player journey visualization |
| `PlayersList.tsx` | Players list (FFF has `Players.tsx` — need sync) |
| `PlayersPage.tsx` | Players page variant |
| `Potential.tsx` | Potential assessment |
| `PressReleases.tsx` | Press releases page |
| `ScoutLogin.tsx` | Scout login page |
| `UpdatePassword.tsx` | Password update page |
| `YouthPlayers.tsx` | Youth players page |

### Skip (RISE-branding only):
`HowWeRise.tsx`, `Stars.tsx`, `ClubDirection.tsx`

FFF has pages RISE doesn't: `Cart.tsx`, `Customisation.tsx`, `DailyFuel.tsx`, `Home.tsx`, `PayLink.tsx`, `Players.tsx`, `PlayersIntro.tsx`, `PortalExample.tsx`, `PublicHub.tsx`, `ServiceDetail.tsx`, `Services.tsx`, `Shop.tsx` — FFF-specific, keep.

---

## EDGE FUNCTIONS — Missing from FFF

| Function | What it does |
|----------|-------------|
| `check-player-milestones/` | Player milestone detection |
| `contract-cross-reference/` | Contract cross-referencing |
| `detect-club-countries/` | Auto-detect club countries |
| `detect-player-actions/` | AI player action detection from video |
| `extract-player-stats/` | Extract player statistics |
| `generate-ai-response/` | General AI response generator |
| `generate-cognisance-question/` | Cognisance quiz question AI |
| `manage-roles/` | Role management backend |
| `parse-case-study-images/` | Case study image parser |
| `player-match-clipper/` | Match clipping backend |
| `suggest-fixture-stats/` | AI fixture stat suggestions |

Skip: `notificationapi-rise_staff/` (RISE-branding specific)

FFF has functions RISE doesn't: `ai-chat/`, `ai-image-tagger/`, `ai-session-suggest/`, `ai-writer/`, `create-pay-link/`, `create-service-checkout/`, `duplicate-records/`, `extract-video-links/`, `import-players-to-shared/`, `init-web-push/`, `insert-shared-programme/`, `notify-staff/`, `og-image/`, `og-player/`, `proxy-pdf/`, `save-playlist/`, `send-content-notification/`, `split-r90-ratings/`, `stripe-webhook/`, `subscribe-staff-push/`, `update-playlist/`, `upload-player-highlight/`, `verify-contracts-access/`, `weekly-instagram-report/` — FFF-specific, keep.

---

## LIB — Missing from FFF

| File | Notes |
|------|-------|
| `normalizeText.ts` | FFF has this, RISE does not — FFF-specific |
| `analysisPdfExport.ts` | FFF has this, RISE does not — FFF-specific |

RISE lib files are all present in FFF. No missing lib files.

---

## STAFF.TSX SYNC ISSUES

FFF Staff.tsx (1280 lines) vs RISE Staff.tsx (1721 lines). Key differences:

| Feature | RISE | FFF | Action |
|---------|------|-----|--------|
| `PortalManagement` import | From `@/components/staff/PortalManagement` (root) | From `@/components/staff/sales` (different component) | Need to add RISE's root PortalManagement |
| `HighlightCompiler` | Imported and registered as section | Missing entirely | Add |
| `VideoCompressor` section | Registered in sidebar | Registered in sidebar | OK |
| `StreamsSection` | Used | FFF uses `StreamsManagement` | Sync naming |
| `useRolePermissions` | Used with `currentRole` state | Not used in Staff.tsx | Add role-based permission gating |
| `useTheme` | Used for dark/light toggle | Not imported | Add |
| Header tabs (draggable) | Full implementation with `DraggableTabsList` | Full implementation | OK |
| `useFormGradeConfigs` | Used in Dashboard | Not imported in Dashboard | Add hook |
| `VersionManager` | Called on load | Not called in Staff | Add |
| Section type union | Full typed union of all section IDs | Uses string type | Sync |

## DASHBOARD.TSX SYNC ISSUES

FFF Dashboard.tsx (4822 lines) vs RISE Dashboard.tsx (4839 lines). Key differences:

| Feature | RISE | FFF | Action |
|---------|------|-----|--------|
| `useFormGradeConfigs` | Imported and used | Not imported | Add hook + import |
| `PortalEmptyState` | Imported | Not imported | Add component + import |
| `SectionDivider` | Imported | Not imported | Add component + import |
| `MobileBottomNav` | Imported | Not imported | Add component + import |
| `MarkdownContent` | Imported from utils | Not imported | Check if needed |
| `PageLoading`/`LoadingSpinner` | From `@/components/LoadingSpinner` | Separate `PageLoading` component | Already adapted |

---

## SUMMARY TABLE

```text
Category                    Missing   Priority
─────────────────────────────────────────────
Staff components               4     HIGH
  (PortalManagement, HighlightCompiler,
   SportscodeActionTypes, RecruitmentRulesTab)
Staff sub-dirs                 5     HIGH
  (AIPlayerDetection, CustomResourcesManager,
   ScheduleManager, FinancialOverviewWidget,
   VisionBoardWidget)
Portal components              5     MEDIUM
  (AnimatedCounter, MobileBottomNav,
   PortalEmptyState, PortalSkeleton,
   SectionDivider)
Edge functions                11     HIGH
Player components              1     LOW
  (PlayerProgrammingNotes)
Top-level components           5     LOW-MED
  (HeroVideoPlayer, MarketingGallery,
   PlayerReportDialog, ScrollProgressBar,
   SequentialLazyVideo)
Hooks                          1     MEDIUM
  (useFormGradeConfigs)
Pages                        ~15     LOW
Radial menu                    1     LOW
─────────────────────────────────────────────
TOTAL                        ~48     items
```

---

## IMPLEMENTATION PLAN (Batch Order)

### Batch 1 — HIGH priority staff components
1. Transfer `PortalManagement.tsx` (staff root version, not sales)
2. Transfer `HighlightCompiler.tsx`
3. Transfer `SportscodeActionTypes.tsx`
4. Transfer `RecruitmentRulesTab.tsx`
5. Register all 4 in Staff.tsx sidebar + section rendering

### Batch 2 — Staff sub-directory files
1. Transfer `coaching/AIPlayerDetection.tsx`
2. Transfer `marketing/CustomResourcesManager.tsx`
3. Transfer `marketing/ScheduleManager.tsx`
4. Transfer `widgets/FinancialOverviewWidget.tsx`
5. Transfer `widgets/VisionBoardWidget.tsx`

### Batch 3 — Portal components + hook
1. Transfer `AnimatedCounter.tsx`
2. Transfer `MobileBottomNav.tsx`
3. Transfer `PortalEmptyState.tsx`
4. Transfer `PortalSkeleton.tsx`
5. Transfer `SectionDivider.tsx`
6. Transfer `useFormGradeConfigs.ts` hook
7. Transfer `PlayerProgrammingNotes.tsx`

### Batch 4 — Edge functions
Transfer all 11 missing edge functions, adapting shared DB references.

### Batch 5 — Staff.tsx + Dashboard.tsx sync
1. Add `VersionManager` call, `useRolePermissions`, `useTheme` to Staff.tsx
2. Register missing sections in sidebar (portalmanagement root, highlightcompiler, sportscodeactiontypes)
3. Add `useFormGradeConfigs` import to Dashboard.tsx
4. Wire in portal components (MobileBottomNav, PortalEmptyState, SectionDivider)

### Batch 6 — Top-level components + pages
Transfer remaining components and pages as needed.

All transfers will adapt imports to use `sharedSupabase` where needed, and use `as any` casts for tables not in the local `types.ts`.

