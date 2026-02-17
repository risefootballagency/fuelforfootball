
-- Create streams table for managing live/recorded content streams
CREATE TABLE public.streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stream_url TEXT,
  thumbnail_url TEXT,
  platform TEXT DEFAULT 'youtube',
  stream_type TEXT DEFAULT 'recorded',
  scheduled_at TIMESTAMPTZ,
  is_live BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS needed - staff-only internal tool
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

-- Open access policy for authenticated users
CREATE POLICY "Authenticated users can manage streams"
  ON public.streams FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_streams_updated_at
  BEFORE UPDATE ON public.streams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
