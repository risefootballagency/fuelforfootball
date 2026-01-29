-- Add additional fields to pay_links for enhanced pay link functionality
ALTER TABLE public.pay_links 
ADD COLUMN IF NOT EXISTS payment_type text DEFAULT 'one_off',
ADD COLUMN IF NOT EXISTS installment_count integer,
ADD COLUMN IF NOT EXISTS recurring_interval text,
ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.service_catalog(id),
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS invoice_notes text;