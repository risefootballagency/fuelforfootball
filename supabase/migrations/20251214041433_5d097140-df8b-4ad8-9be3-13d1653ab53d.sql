-- Create service_catalog table for managing services that display on the Services page
CREATE TABLE public.service_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  badge TEXT,
  ribbon TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  discount_mode TEXT,
  discount_value NUMERIC,
  display_order INTEGER DEFAULT 0,
  options JSONB DEFAULT '[]'::jsonb,
  collection TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible services
CREATE POLICY "Anyone can view visible services"
  ON public.service_catalog
  FOR SELECT
  USING (visible = true);

-- Staff can view all services
CREATE POLICY "Staff can view all services"
  ON public.service_catalog
  FOR SELECT
  USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Staff can manage services
CREATE POLICY "Staff can manage service_catalog"
  ON public.service_catalog
  FOR ALL
  USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_service_catalog_updated_at
  BEFORE UPDATE ON public.service_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();