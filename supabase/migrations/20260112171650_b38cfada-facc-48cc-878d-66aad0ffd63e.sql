-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view documents" ON public.staff_documents;
DROP POLICY IF EXISTS "Authenticated users can create documents" ON public.staff_documents;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON public.staff_documents;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON public.staff_documents;

-- Create public access policies (access controlled at app level via Staff portal auth)
CREATE POLICY "Allow public read for staff_documents"
ON public.staff_documents
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert for staff_documents"
ON public.staff_documents
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update for staff_documents"
ON public.staff_documents
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete for staff_documents"
ON public.staff_documents
FOR DELETE
USING (true);