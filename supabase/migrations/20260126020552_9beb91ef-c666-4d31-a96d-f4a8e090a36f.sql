-- Create storage bucket for case study images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-studies', 'case-studies', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to case-studies bucket
CREATE POLICY "Public read access for case-studies"
ON storage.objects FOR SELECT
USING (bucket_id = 'case-studies');

-- Allow authenticated users to upload to case-studies bucket
CREATE POLICY "Authenticated users can upload case-studies"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'case-studies');

-- Allow authenticated users to update case-studies
CREATE POLICY "Authenticated users can update case-studies"
ON storage.objects FOR UPDATE
USING (bucket_id = 'case-studies');

-- Allow authenticated users to delete case-studies
CREATE POLICY "Authenticated users can delete case-studies"
ON storage.objects FOR DELETE
USING (bucket_id = 'case-studies');