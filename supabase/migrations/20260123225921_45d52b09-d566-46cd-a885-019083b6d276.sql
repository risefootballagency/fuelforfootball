-- Enable RLS on service_audit table
ALTER TABLE public.service_audit ENABLE ROW LEVEL SECURITY;

-- Enable RLS on staff_documents table  
ALTER TABLE public.staff_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_audit (staff/admin only)
CREATE POLICY "Staff can view service audit" ON public.service_audit
  FOR SELECT USING (
    public.has_role(auth.uid(), 'staff') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Staff can manage service audit" ON public.service_audit
  FOR ALL USING (
    public.has_role(auth.uid(), 'staff') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Create RLS policies for staff_documents (staff/admin/marketeer only)
CREATE POLICY "Staff can view staff documents" ON public.staff_documents
  FOR SELECT USING (
    public.has_role(auth.uid(), 'staff') OR 
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'marketeer')
  );

CREATE POLICY "Staff can manage staff documents" ON public.staff_documents
  FOR ALL USING (
    public.has_role(auth.uid(), 'staff') OR 
    public.has_role(auth.uid(), 'admin')
  );