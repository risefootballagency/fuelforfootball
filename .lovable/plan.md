

# Fix PER and SR Grades to Use Database Form Grade Configs

## Problem
`getPERGrade` and `getSRGrade` in `gradeCalculations.ts` use hardcoded thresholds on completely wrong scales (PER expects 0-2, SR expects 0-100). The correct thresholds already exist in the shared database's `form_grade_configs` table, managed via the Coaching Database "Form Grades" UI. The `useFormGradeConfigs` hook already reads these and provides `getGradeForScore(metricKey, score)`.

## Fix

### 1. `HiddenScoresGrid.tsx` — Use `useFormGradeConfigs` hook
- Import and call `useFormGradeConfigs()` to get `getGradeForScore`
- Replace `getPERGrade(placeholderPer)` with `getGradeForScore('per', placeholderPer)`
- Replace `getSRGrade(placeholderSr)` with `getGradeForScore('sr', placeholderSr)`
- Replace `getR90Grade(r90Num)` with `getGradeForScore('r90', r90Num)`
- Remove the import of `getPERGrade`, `getSRGrade`, `getR90Grade` from `gradeCalculations.ts`

### 2. `PerformanceReport.tsx` — Use `useFormGradeConfigs` hook
- Import and call `useFormGradeConfigs()` to get `getGradeForScore`
- Replace `getPERGrade(analysis.placeholder_per)` with `getGradeForScore('per', analysis.placeholder_per)`
- Replace `getSRGrade(analysis.placeholder_sr)` with `getGradeForScore('sr', analysis.placeholder_sr)`
- Also replace all other hardcoded grade function calls (`getR90Grade`, `getXGGrade`, etc.) with `getGradeForScore(metricKey, score)` so every metric uses the DB config — consistent with RISE

### 3. Clean up `gradeCalculations.ts`
- Remove `getPERGrade` and `getSRGrade` (wrong scales, now unused)
- Keep other grade functions only if they're still imported elsewhere as fallbacks — but ideally all callers should migrate to the hook

This means PER 25.60 and SR 7.71 will grade correctly based on whatever thresholds are set in the Coaching Database Form Grades config, and any future threshold changes made in the UI will take effect immediately without code changes.

