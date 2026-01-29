-- Create junction table for pay link items (multiple products per pay link)
CREATE TABLE public.pay_link_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pay_link_id UUID NOT NULL REFERENCES public.pay_links(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.service_catalog(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_pay_link_items_pay_link_id ON public.pay_link_items(pay_link_id);

-- Grant access (no RLS for staff management)
ALTER TABLE public.pay_link_items DISABLE ROW LEVEL SECURITY;