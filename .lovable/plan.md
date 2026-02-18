

# Comprehensive Sync and Fix Plan

## 1. Coaching Database (CoachingDatabase.tsx) -- Missing Features

**Rise has (1957 lines) vs FFF (1807 lines):**
- Missing `ClubRatings` component import and tab
- Missing `FormGradesManagement` component and tab
- Missing `ComparisonPlayerData` full implementation (FFF has a stub)
- Missing `ActionReportsList` integration
- Missing `club_ratings`, `form_grade_configs`, `comparison_player_data`, `performance_data` table types
- Missing `downloadFile` utility import and file download actions
- Missing `Grid/List/SortAsc/FileText/FolderPlus/Building2/GraduationCap/UserCheck` icons
- Rise uses single `supabase` client; FFF uses a `getSupabaseClient()` helper -- this is correct for FFF's dual-DB architecture

**Action:** Port the missing tabs and components from Rise, creating `ClubRatings.tsx` and `FormGradesManagement.tsx` if they don't exist. Update `CoachingDatabase.tsx` to add the missing table types and sub-tabs.

## 2. Message Pathways

Message Pathways already exist in FFF at `src/components/staff/CaseStudyPathways.tsx`, rendered within `CaseStudyManagement.tsx`. Rise does NOT have a separate `MessagePathways.tsx` file either -- it's the same pattern. This feature is already present and working.

## 3. Recent Rise Commits (Feb 18)

Four commits to apply:
- **Reworked Analysis Grid**: Updated dashboard dropdown to 4x? grid for analysis submenu, wider columns, resized hub and tabs, grid uses 4x6 layout on sub-menu and 0.8/1.4/0.8 fractions for main view
- **Portal Dropdown 3x3 Grid Navigation**: Redesigned dropdown navigation to use a 3x3 grid layout
- **Auto-detect Club Country**: AI-based auto-detection for Player Database entries
- **Inline Fixture Creator with Keyboard Shortcuts**: Keyboard shortcut support for fixture creation in analysis

**Action:** Fetch the affected files from Rise and port the changes, adapting for FFF branding.

## 4. Portal Duplicate Analysis Bug (Analysis Tab)

The duplicate is happening because the merging logic in `Dashboard.tsx` runs three passes:
1. Opponent + date match (lines 1028-1074)
2. Fixture ID match (lines 1169-1226)
3. Club name match (lines 1260-1323)

The same analysis can be matched by multiple passes. While `attachedTacticalIds` prevents the same tactical analysis from attaching twice, the problem is when a tactical analysis matches via Pass 1 (opponent match) AND then the same fixture's action report also has the tactical analysis attached via `analysis_writer_id` from the DB. The `existingAnalysisWriterIds` check on line 1254 uses the writer IDs from merged analyses but doesn't account for IDs already in `attachedTacticalIds` from Pass 1 properly when the same analysis appears as both `analysis_writer_data` and in `tagged_analyses`.

**Fix:** Add a global deduplication at the end that removes any duplicate `analysis_writer_data` or `tagged_analyses` entries where the same analysis ID appears multiple times across different report items. Also ensure `attachedTacticalIds` is checked consistently in ALL three passes.

## 5. CognisanceSection -- Major Gap

**Rise (1337 lines) vs FFF (722 lines). Missing:**
- SM-2 spaced repetition algorithm with `flashcard_progress` DB persistence
- AI Quiz mode (`ai-quiz`) with generated multiple-choice questions
- Positional Guides section (4th game type)
- `flashcard_progress` table integration (progress tracking per card)
- Card progress indicators (ease factor, interval, next review)
- Session stats (reviewed, new cards, due cards)
- `coaching_analysis` table queries for concepts (Rise uses this table)

**Action:** Port the full Rise CognisanceSection, adapting the supabase client to use `sharedSupabase` for schemes/concepts and keeping AI quiz functionality. Create `flashcard_progress` table if missing.

## 6. Pre-Match Analysis Spacing

The `whitespace-pre-wrap` class on text paragraphs in `AnalysisViewer.tsx` preserves literal whitespace from the database. If the stored data has double newlines between words/sentences, `whitespace-pre-wrap` will render them. The fix needs to either:
- Clean the text before rendering by collapsing multiple spaces/newlines
- Or use a text normalizer utility that replaces `\n\n` with `\n` and multiple spaces with single spaces within paragraphs

**Action:** Add a `normalizeText()` utility applied to all `whitespace-pre-wrap` content fields in `AnalysisViewer.tsx` (key_details, scheme_paragraph_1, scheme_paragraph_2, point paragraphs, strengths_improvements, etc.) that collapses excess whitespace while preserving intentional paragraph breaks.

## 7. Design Studio -- Missing DesignProjects.tsx

Rise has 13 files in `design/`. FFF has 12 -- missing `DesignProjects.tsx` (21KB, 454 lines). This is the project management layer that wraps `DesignStudio.tsx`, providing:
- Project CRUD (create, rename, duplicate, delete)
- Folder organization with color-coded folders
- Grid/list view toggle
- Canvas preset selection (Instagram Post, Story, A4, etc.)
- LocalStorage persistence for projects and folders
- Thumbnail generation

**Action:** Port `DesignProjects.tsx` from Rise and update `DesignStudio.tsx` wrapper to use it as the entry point. Also compare file sizes of existing 12 files to ensure parity.

## 8. Notifications

**Already synced.** Both `StaffNotificationsDropdown.tsx` and `useStaffNotifications.ts` are byte-for-byte identical between Rise and FFF. No changes needed.

---

## Technical Implementation Order

1. **Pre-Match Spacing Fix** (quick win, affects user-facing content)
2. **Portal Duplicate Analysis Fix** (bug fix)
3. **CognisanceSection Full Port** (large, requires `flashcard_progress` table migration)
4. **CoachingDatabase Missing Tabs** (`ClubRatings`, `FormGradesManagement`, extra table types)
5. **DesignProjects.tsx** (missing file port)
6. **Recent Rise Commits** (Analysis Grid, Portal Dropdown, Auto-detect Country, Inline Fixture Creator)

## Database Changes Required

- Create `flashcard_progress` table (player_id, card_key, ease_factor, interval_days, repetitions, next_review)
- Possibly `club_ratings` and `form_grade_configs` tables if not already present
- Possibly `positional_guide_points` table if not already present

