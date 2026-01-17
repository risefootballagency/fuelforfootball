-- Create storage bucket for analysis PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('analyses', 'analyses', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to analysis PDFs
CREATE POLICY "Public read access for analyses"
ON storage.objects FOR SELECT
USING (bucket_id = 'analyses');

-- Allow authenticated users to upload analysis PDFs
CREATE POLICY "Authenticated users can upload analyses"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'analyses');

-- Allow authenticated users to update/overwrite their uploads
CREATE POLICY "Authenticated users can update analyses"
ON storage.objects FOR UPDATE
USING (bucket_id = 'analyses');

-- Allow authenticated users to delete analysis files
CREATE POLICY "Authenticated users can delete analyses"
ON storage.objects FOR DELETE
USING (bucket_id = 'analyses');