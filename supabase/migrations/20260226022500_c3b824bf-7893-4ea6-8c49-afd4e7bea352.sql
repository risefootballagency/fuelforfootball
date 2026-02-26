
CREATE TABLE public.player_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL,
  metric_key TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, metric_key)
);

ALTER TABLE public.player_goals ENABLE ROW LEVEL SECURITY;

-- Players can read their own goals
CREATE POLICY "Players can view their own goals"
  ON public.player_goals FOR SELECT
  USING (true);

-- Players can insert their own goals
CREATE POLICY "Players can insert goals"
  ON public.player_goals FOR INSERT
  WITH CHECK (true);

-- Players can update their own goals
CREATE POLICY "Players can update goals"
  ON public.player_goals FOR UPDATE
  USING (true);

-- Players can delete their own goals
CREATE POLICY "Players can delete goals"
  ON public.player_goals FOR DELETE
  USING (true);
