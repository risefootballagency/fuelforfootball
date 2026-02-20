
-- Video clip tracking columns
ALTER TABLE performance_report_actions ADD COLUMN IF NOT EXISTS video_analysis_id text;
ALTER TABLE performance_report_actions ADD COLUMN IF NOT EXISTS clip_id text;

-- Video analysis linking to reports
ALTER TABLE player_analysis ADD COLUMN IF NOT EXISTS linked_video_analysis_ids text[] DEFAULT '{}';
