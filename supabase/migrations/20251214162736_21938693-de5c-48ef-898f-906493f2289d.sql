-- Create pay_links table
CREATE TABLE public.pay_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pay_link_id UUID REFERENCES public.pay_links(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.pay_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Pay links are publicly viewable (for customers)
CREATE POLICY "Pay links are publicly viewable" 
ON public.pay_links 
FOR SELECT 
USING (true);

-- Sales viewable by authenticated users (staff)
CREATE POLICY "Sales viewable by authenticated users" 
ON public.sales 
FOR SELECT 
TO authenticated
USING (true);

-- Staff can manage pay links (using authenticated)
CREATE POLICY "Authenticated users can manage pay links" 
ON public.pay_links 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Staff can manage sales
CREATE POLICY "Authenticated users can manage sales" 
ON public.sales 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at on pay_links
CREATE TRIGGER update_pay_links_updated_at
BEFORE UPDATE ON public.pay_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();