-- Create case_studies table for storing player case studies
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  player_image_url TEXT,
  duration TEXT,
  summary TEXT,
  full_story TEXT,
  services_used TEXT[],
  achievements TEXT[],
  testimonial TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (case studies are public content)
CREATE POLICY "Case studies are viewable by everyone" 
ON public.case_studies 
FOR SELECT 
USING (is_visible = true);

-- Create policy for authenticated users to manage (staff only via app logic)
CREATE POLICY "Authenticated users can manage case studies" 
ON public.case_studies 
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_case_studies_updated_at
BEFORE UPDATE ON public.case_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();