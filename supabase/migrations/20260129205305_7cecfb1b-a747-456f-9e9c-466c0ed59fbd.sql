-- Create shop_products table for e-books and digital products
CREATE TABLE public.shop_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'E-Books',
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  badge TEXT,
  ribbon TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  file_url TEXT,
  product_type TEXT NOT NULL DEFAULT 'digital',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Disable RLS for shop_products (admin-only table)
ALTER TABLE public.shop_products DISABLE ROW LEVEL SECURITY;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shop_products_updated_at
BEFORE UPDATE ON public.shop_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_purchases table to track purchases and grant access
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  product_id UUID REFERENCES public.shop_products(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'completed',
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Disable RLS for user_purchases (managed by staff)
ALTER TABLE public.user_purchases DISABLE ROW LEVEL SECURITY;