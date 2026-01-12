-- Add folder column to marketing_gallery table
ALTER TABLE public.marketing_gallery 
ADD COLUMN folder text DEFAULT NULL;

-- Create index for folder lookups
CREATE INDEX idx_marketing_gallery_folder ON public.marketing_gallery(folder);

-- Create gallery_folders table to store folder metadata
CREATE TABLE public.gallery_folders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on gallery_folders
ALTER TABLE public.gallery_folders ENABLE ROW LEVEL SECURITY;

-- Policy: All users can view folders (public read)
CREATE POLICY "Anyone can view gallery folders"
ON public.gallery_folders
FOR SELECT
USING (true);

-- Policy: Only authenticated users can insert/update/delete (staff only)
CREATE POLICY "Authenticated users can manage folders"
ON public.gallery_folders
FOR ALL
USING (auth.role() = 'authenticated');

-- Insert initial "landing" folder
INSERT INTO public.gallery_folders (name, description) 
VALUES ('landing', 'Images for the landing page background wall visible through X-ray effect');