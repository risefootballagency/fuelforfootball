-- Create annotation_projects table
CREATE TABLE IF NOT EXISTS public.annotation_projects (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_name TEXT NOT NULL,
  klips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.annotation_projects ENABLE ROW LEVEL SECURITY;

-- Create policy for full access (local app style)
CREATE POLICY "Enable all access for annotation_projects" 
ON public.annotation_projects 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create video_analyses table
CREATE TABLE IF NOT EXISTS public.video_analyses (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  match_date TEXT,
  home_team TEXT,
  away_team TEXT,
  clips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for full access
CREATE POLICY "Enable all access for video_analyses" 
ON public.video_analyses 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert annotation-videos bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('annotation-videos', 'annotation-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for annotation-videos
CREATE POLICY "Public Access for annotation-videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'annotation-videos');

CREATE POLICY "Authenticated Upload for annotation-videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'annotation-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update for annotation-videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'annotation-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete for annotation-videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'annotation-videos' AND auth.role() = 'authenticated');
