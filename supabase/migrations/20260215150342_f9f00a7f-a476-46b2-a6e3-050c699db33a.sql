
-- Add 'analyst' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'analyst';

-- Add writer_user_id to analyses table so analysts can be assigned
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS writer_user_id uuid REFERENCES auth.users(id);

-- Create index for fast lookups by writer
CREATE INDEX IF NOT EXISTS idx_analyses_writer_user_id ON public.analyses(writer_user_id);

-- Create storage bucket for catalog images (service + shop)
INSERT INTO storage.buckets (id, name, public) VALUES ('catalog-images', 'catalog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: staff/admin can upload catalog images
CREATE POLICY "Staff can upload catalog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'catalog-images');

CREATE POLICY "Anyone can view catalog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalog-images');

CREATE POLICY "Staff can update catalog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'catalog-images');

CREATE POLICY "Staff can delete catalog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'catalog-images');
