ALTER TABLE public.video_analyses
ADD COLUMN IF NOT EXISTS part_number INTEGER,
ADD COLUMN IF NOT EXISTS group_id UUID,
ADD COLUMN IF NOT EXISTS total_parts INTEGER;

CREATE INDEX IF NOT EXISTS idx_video_analyses_group_id ON public.video_analyses(group_id);