
-- Add tags to marketing_gallery
ALTER TABLE marketing_gallery ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create service_page_stats table for staff-controlled counters
CREATE TABLE IF NOT EXISTS service_page_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  stats jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_page_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" ON service_page_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON service_page_stats FOR SELECT TO anon USING (true);
CREATE POLICY "Allow staff write" ON service_page_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_service_page_stats_updated_at
BEFORE UPDATE ON service_page_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
