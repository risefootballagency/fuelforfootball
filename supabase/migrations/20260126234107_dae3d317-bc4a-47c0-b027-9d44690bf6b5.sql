-- Add achievement_images column to case_studies table for storing image URLs per achievement
-- This allows each key achievement to have an optional background image

ALTER TABLE public.case_studies 
ADD COLUMN IF NOT EXISTS achievement_images text[];

-- Add comment for documentation
COMMENT ON COLUMN public.case_studies.achievement_images IS 'Array of image URLs corresponding to each achievement in the achievements array';