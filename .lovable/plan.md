## Goal
Bring across the relevant work from RISE Football (Apr 25 – Apr 27, 2026, the most recent activity there) that has not yet been mirrored into Fuel For Football. Skipping anything tied to the **Representation page**, **page transitions / loaders**, **translations**, and **audio** since those are FFF-specific or already excluded.

## Audit summary (RISE → FFF)
| RISE change | FFF status |
|---|---|
| Analysis duplicate button | ✅ already in FFF |
| Spellcheck off in analysis editors | ✅ done |
| Case-insensitive email lookups | ✅ done |
| Fixture-first portal Performance logic (player_fixtures primary) | ✅ done |
| Background video export — no full-match fallback on trim failure | ✅ done |
| **Programming duplicate button** | ❌ missing |
| **Magnifier annotation read-only math fix** | ❌ missing (still `vw / zoom`) |
| **VideoAnalysis ↔ AnalysisPoints clip pipeline parity** (attach to point with trim, multi-link, "Currently linked" + unlink in export dialog) | ❌ missing |
| **AnalysisPoints atomic upsert (race-condition fix for `annotation_projects_pkey`)** | ❌ missing |
| **Annotation auto-persistence into `analyses.points` JSONB on save** | ❌ missing |
| **`annotation_projects` RLS allow any authenticated staff to update/delete** | ❌ missing |
| **Real-time subscriptions on portal extended** to `analysis_player_tags`, `analyses`, `player_fixtures`, `fixtures` | partial — verify |
| **`AnalysisQuickLink` always saves `fixture_id`** when linking from a fixture | needs verify |
| **Press Releases premium redesign** (denser 4-col grid, smaller logo placeholders, gold accents, 12/page) | ❌ missing — applies to `PressReleasesSection.tsx` / `Media.tsx` |
| **Weekly content schedule recurring-task logic** (treat scheduled items as recurring, not "done forever") | ❌ to investigate in `StaffSchedulesManagement.tsx` |

## Implementation plan

### 1. Magnifier read-only fix
- File: `src/components/portal/ReadOnlyAnnotationPlayback.tsx` (and `ReadOnlyAnnotationOverlay.tsx`)
- Replace `regionW = vw / zoom` with lens-diameter math: `regionW = Math.max(8, (radiusPxW * 2) / zoom)` (and `regionH` similarly), mirroring the editor.
- Honour `panX` / `panY` offsets.

### 2. Annotation persistence + RLS
- DB migration: relax `annotation_projects` UPDATE/DELETE RLS so any authenticated staff (not only the creator) can modify.
- `src/components/staff/analysis/AnalysisPointsSection.tsx`:
  - Replace select-then-insert save flow with atomic upsert (`onConflict: 'id'`) and fall back to `update` on `23505`.
  - On annotation save, also patch the parent `analyses.points` JSONB so the link survives reloads. Drill `analysisId` through `SortablePointCard` → `VideoItem`.

### 3. Programming duplicate
- File: `src/components/staff/ProgrammingManagement.tsx`
- Add `Duplicate` button per program card; deep-clone `player_programs` row (sessions A–H, weekly schedules, notes), set `is_current = false`, increment `display_order`, append " (Copy)" to title.

### 4. Video Analysis clip pipeline parity
- File: `src/components/staff/coaching/VideoAnalysis.tsx`
- Show paperclip when linked to either a Performance Report **or** an Analysis.
- Attach-to-point flow: list analysis points; on attach, run `trimAndUploadClip` and push the trimmed URL into the point's `video_urls` array (no `#t=` fragments).
- Export dialog: add "Currently linked" section listing both report and analysis links with individual unlink buttons.
- Mirror in `AnalysisPointsSection.tsx` so adding a VA clip to a point uses `trimAndUploadClip`.

### 5. Portal real-time + fixture linking
- Verify `src/pages/Dashboard.tsx` already subscribes to `analysis_player_tags`, `analyses`, `player_fixtures`, `fixtures`. Add any missing channels.
- `src/components/staff/analysis/AnalysisQuickLink.tsx`: ensure `fixture_id` is saved when creating a link from the fixture list (not only date/opponent).

### 6. Press Releases premium redesign
- File: `src/components/PressReleasesSection.tsx` (and any list view in `Media.tsx`).
- Move to denser 4-column layout, reduce logo placeholder height to `h-10`–`h-12` to avoid pixelation, add gold-accented borders/dividers, raise items per page from 9 → 12.

### 7. Recurring weekly content schedule
- Audit `src/components/staff/StaffSchedulesManagement.tsx` (and the "My Tasks" view) so weekly schedule items are treated as recurring instances per week instead of one-time completions. Completion state should be keyed by `task_id + week_start` rather than the underlying schedule row.

## Out of scope
- Representation page, intro sequence, audio, smoke overlays, page transitions, loaders, language map selector, translations migrations, 3D player effects.

## Files likely touched
- `src/components/portal/ReadOnlyAnnotationPlayback.tsx`, `ReadOnlyAnnotationOverlay.tsx`
- `src/components/staff/analysis/AnalysisPointsSection.tsx`, `AnalysisQuickLink.tsx`
- `src/components/staff/ProgrammingManagement.tsx`
- `src/components/staff/coaching/VideoAnalysis.tsx`
- `src/components/PressReleasesSection.tsx` (+ `Media.tsx`)
- `src/components/staff/StaffSchedulesManagement.tsx`
- `src/pages/Dashboard.tsx`
- One Supabase migration for `annotation_projects` RLS

Reply **"approve"** (or edit which numbered items to keep) and I'll execute.