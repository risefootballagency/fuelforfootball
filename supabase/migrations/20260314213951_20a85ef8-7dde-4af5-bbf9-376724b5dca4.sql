ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS estimated_ready_at TIMESTAMPTZ;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS translated_content JSONB;