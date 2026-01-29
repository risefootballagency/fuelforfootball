-- Add folder column to coaching_analysis for organization
ALTER TABLE public.coaching_analysis ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT NULL;

-- Create index for folder filtering
CREATE INDEX IF NOT EXISTS idx_coaching_analysis_folder ON public.coaching_analysis(folder);