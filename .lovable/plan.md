

## Recent RISE updates → Apply here

I diffed RISE (project 3f4a1ae9…) against this project. Recent RISE changes from 16–20 Apr that are not yet here, grouped by area.

### 1. Searchable PlayerCombobox + roll-out
- **Missing entirely.** No `PlayerCombobox.tsx` exists in this project. Build the shared component (cmdk inside Popover, type-to-filter on name/position/club, grouped headers by status, Enter to select when one match remains, avatars).
- Roll out the combobox replacing standard `Select` player pickers in: `AthleteCentre.tsx`, `PortalManagementAdmin.tsx`, `coaching/VideoAnalysis.tsx`, `programming/StrengthPowerSpeedSection.tsx`, `programming/NutritionSection.tsx`, `CoachingDataSection.tsx`, `analysis/AnalysisQuickLink.tsx`, `MarketingManagement.tsx`, `HighlightMaker.tsx`, `ProgrammingManagement.tsx` fixture-player select.
- **HighlightCompiler exception** — RISE found Radix Popover focus-trap fights its dialog, so it uses an inline `Input` + `ScrollArea` results list with avatars and a Change button. Apply the same inline pattern there.

### 2. Annotation editor — AI player tracker tool
- Missing. Add new `'ai-track'` tool in `AnnotationEditor.tsx` with hotkey **A**.
- On click on the canvas (`onAiTrack` callback in `AnnotationCanvas.tsx`), sample up to 30 frames across the active clip duration, JPEG dataURL them, and send (with click coords) to a new `ai-track-player` Supabase edge function backed by Lovable AI Gateway (Gemini Vision).
- Map the returned coordinate keyframes to a `player-marker` element with animated keyframes. Show a persistent "Tracking player…" overlay during the request.
- New file: `supabase/functions/ai-track-player/index.ts` (frames + initial click → keyframes JSON). No new secret needed — uses `LOVABLE_API_KEY`.

### 3. Annotation editor refinements
- **Per-tool last colour persistence** — replace the single `annotation-last-colour` localStorage key with a JSON map `annotation-last-colour-by-tool`, restored when `activeTool` changes.
- **Clear stale freeze refs on entering draw mode and on manual seek** so old annotations don't bleed when scrubbing or starting a new drawing.

### 4. Portal Video Reports refactor
- `AnalysisVideoReports.tsx` still uses raw `<video>` + manual `#t=` parsing. Replace with `ClippedActionsPlayer` for parity with match reports.
- Extend `ClippedActionsPlayer.tsx` with optional props: `showDownloads`, `onDownloadCurrent`, `onDownloadAll`, `onSaveToBest`, `savingClipId`. Keep behaviour off by default so existing uses don't change.
- Wire the portal Video Reports to use those props (download this clip, download all staggered, save to best).
- Annotations are dropped on this view to match RISE's parity decision (matches the match-report player).

### 5. ClippedActionsPlayer UI cleanup
- Move `action_description` and `notes` from the absolute-positioned bottom overlay (covering video) into the header block, directly below minute · action type. Use `line-clamp-2`.
- Remove the legacy bottom description overlay.
- Use `Download` icon for "This clip" and `DownloadCloud` for "All (n)" with clearer text labels.

### 6. My Tasks — leaderboard sort + history dialog
- `StaffAccountabilityOverview.tsx` leaderboard: sort by **lastWeek** (current week) descending by default.
- Make leaderboard rows clickable to open a Dialog showing that staff member's recent activity (task completions + scheduled posts + activity log entries). Hoist `historyStaffId` state and `historyEntries` useMemo above any early returns to avoid hook-order errors.

### 7. Toast duration in coaching VideoAnalysis
- "New action created with clip attached" success toast — set `{ duration: 15000 }` so it persists 15 s.

### Files to edit / create
- New: `src/components/staff/PlayerCombobox.tsx`
- New: `supabase/functions/ai-track-player/index.ts`
- `src/components/staff/annotations/AnnotationEditor.tsx` — AI tool, per-tool colour map, ref clears
- `src/components/staff/annotations/AnnotationCanvas.tsx` — `onAiTrack` callback
- `src/components/staff/annotations/AnnotationToolbar.tsx` — AI tool entry + hotkey A
- `src/components/portal/AnalysisVideoReports.tsx` — switch to ClippedActionsPlayer
- `src/components/ClippedActionsPlayer.tsx` — new optional props, header layout, download icons, drop bottom overlay
- `src/components/staff/StaffAccountabilityOverview.tsx` — leaderboard sort, clickable rows + history Dialog
- `src/components/staff/coaching/VideoAnalysis.tsx` — toast duration 15 s
- Roll-out: `AthleteCentre.tsx`, `PortalManagementAdmin.tsx`, `coaching/VideoAnalysis.tsx`, `programming/StrengthPowerSpeedSection.tsx`, `programming/NutritionSection.tsx`, `CoachingDataSection.tsx`, `analysis/AnalysisQuickLink.tsx`, `MarketingManagement.tsx`, `HighlightMaker.tsx`, `ProgrammingManagement.tsx` (Select → PlayerCombobox)
- `HighlightCompiler.tsx` — inline search + ScrollArea pattern

### Already in this project (no action)
- `FFFPackageHeader` mounted in analysis + report editors ✓
- `ReadOnlyAnnotationPlayback` freeze-only contract + per-annotation triggering ✓
- Sequential dual-DB annotation lookup + lazy-load safety ✓
- Fullscreen container fix in `AnalysisViewer` ✓
- `ActionVideoPopup` annotation rendering ✓
- Service worker cache version bump ✓

### Validation
- Type-to-filter players from any staff dropdown; Enter selects when one remains.
- AI track: click on a player on the canvas → tracker draws a numbered marker that follows them for the clip.
- Per-tool colours restore correctly when switching tool.
- Portal Video Reports plays clips with shared player, download buttons work, "Save to Best" appends to highlights.
- Leaderboard defaults to current-week ranking; clicking a row opens the activity dialog with no hook errors.
- Toast in Video Analysis "new action created" stays for 15 s.

