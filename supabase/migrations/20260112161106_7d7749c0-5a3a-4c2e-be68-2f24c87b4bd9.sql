-- Create staff_documents table for Docs and Sheets
CREATE TABLE public.staff_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  doc_type TEXT NOT NULL DEFAULT 'doc', -- 'doc' or 'sheet'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_documents ENABLE ROW LEVEL SECURITY;

-- Staff can view all documents
CREATE POLICY "Staff can view all documents"
  ON public.staff_documents
  FOR SELECT
  TO authenticated
  USING (true);

-- Staff can create documents
CREATE POLICY "Staff can create documents"
  ON public.staff_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Staff can update documents
CREATE POLICY "Staff can update documents"
  ON public.staff_documents
  FOR UPDATE
  TO authenticated
  USING (true);

-- Staff can delete documents
CREATE POLICY "Staff can delete documents"
  ON public.staff_documents
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_staff_documents_updated_at
  BEFORE UPDATE ON public.staff_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();