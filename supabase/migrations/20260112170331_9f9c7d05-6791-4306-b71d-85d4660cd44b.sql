-- Create service_audit table for tracking services, pricing, and time value
CREATE TABLE public.service_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'GBP',
  average_duration_minutes INTEGER NOT NULL DEFAULT 60,
  hourly_value NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE WHEN average_duration_minutes > 0 
    THEN (price / average_duration_minutes) * 60 
    ELSE 0 END
  ) STORED,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_audit ENABLE ROW LEVEL SECURITY;

-- Staff can view all services
CREATE POLICY "Staff can view services" ON public.service_audit
FOR SELECT USING (true);

-- Staff can manage services
CREATE POLICY "Staff can insert services" ON public.service_audit
FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can update services" ON public.service_audit
FOR UPDATE USING (true);

CREATE POLICY "Staff can delete services" ON public.service_audit
FOR DELETE USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_service_audit_updated_at
  BEFORE UPDATE ON public.service_audit
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();