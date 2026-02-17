
-- Add recorded_stat column to performance_report_actions for per-action stat recording
ALTER TABLE public.performance_report_actions 
ADD COLUMN IF NOT EXISTS recorded_stat jsonb DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.performance_report_actions.recorded_stat IS 'JSON array of recorded stats per action (dribbles, passes, etc.)';
