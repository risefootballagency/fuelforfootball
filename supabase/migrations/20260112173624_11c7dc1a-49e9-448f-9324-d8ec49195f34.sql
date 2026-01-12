-- Disable RLS on staff_documents
ALTER TABLE public.staff_documents DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on staff_documents
DROP POLICY IF EXISTS "Allow public read for staff_documents" ON public.staff_documents;
DROP POLICY IF EXISTS "Allow public insert for staff_documents" ON public.staff_documents;
DROP POLICY IF EXISTS "Allow public update for staff_documents" ON public.staff_documents;
DROP POLICY IF EXISTS "Allow public delete for staff_documents" ON public.staff_documents;

-- Create fully permissive storage policies for the analysis-files bucket
-- First drop any existing policies
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for all files" ON storage.objects;
DROP POLICY IF EXISTS "Public insert access for all files" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for all files" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for all files" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_select" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_insert" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_update" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_delete" ON storage.objects;

-- Create new fully permissive policies for ALL storage operations
CREATE POLICY "allow_all_select" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON storage.objects FOR DELETE USING (true);