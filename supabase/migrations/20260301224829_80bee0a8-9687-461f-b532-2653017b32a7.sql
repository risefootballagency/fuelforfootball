
-- Create analysis_player_tags table for multi-player tagging
CREATE TABLE public.analysis_player_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  player_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate tags
CREATE UNIQUE INDEX idx_analysis_player_tags_unique ON public.analysis_player_tags(analysis_id, player_id);

-- Create index for lookups by analysis
CREATE INDEX idx_analysis_player_tags_analysis ON public.analysis_player_tags(analysis_id);

-- Create index for lookups by player
CREATE INDEX idx_analysis_player_tags_player ON public.analysis_player_tags(player_id);

-- Enable RLS
ALTER TABLE public.analysis_player_tags ENABLE ROW LEVEL SECURITY;

-- Public access policy (matches shared DB pattern)
CREATE POLICY "Public access to analysis_player_tags"
  ON public.analysis_player_tags
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
