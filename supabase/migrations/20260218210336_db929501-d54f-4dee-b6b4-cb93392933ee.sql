
ALTER TABLE public.pay_links ADD COLUMN IF NOT EXISTS player_id UUID REFERENCES public.players(id);
CREATE INDEX IF NOT EXISTS idx_pay_links_player_id ON public.pay_links(player_id);
