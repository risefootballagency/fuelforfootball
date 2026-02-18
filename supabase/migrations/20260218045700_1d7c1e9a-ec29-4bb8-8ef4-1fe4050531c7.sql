
-- Create flashcard_progress table for SM-2 spaced repetition tracking
CREATE TABLE public.flashcard_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  card_key TEXT NOT NULL,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, card_key)
);

-- Enable RLS
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Open RLS for cross-site access (matches existing pattern)
CREATE POLICY "Allow all access to flashcard_progress"
  ON public.flashcard_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Timestamp trigger
CREATE TRIGGER update_flashcard_progress_updated_at
  BEFORE UPDATE ON public.flashcard_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
