-- Add stripe_price_id column to service_catalog for linking to Stripe products
ALTER TABLE service_catalog ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Add stripe_product_id column for reference
ALTER TABLE service_catalog ADD COLUMN IF NOT EXISTS stripe_product_id text;

-- Create orders table to track purchases
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id uuid REFERENCES service_catalog(id),
  customer_email text NOT NULL,
  customer_name text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  selected_option text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on service_orders
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- Public can create orders (for guest checkout)
CREATE POLICY "Anyone can create orders" ON service_orders FOR INSERT WITH CHECK (true);

-- Staff can view and manage all orders
CREATE POLICY "Staff can manage service_orders" ON service_orders FOR ALL 
  USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Customers can view their own orders by email
CREATE POLICY "Customers can view own orders" ON service_orders FOR SELECT 
  USING (customer_email = (auth.jwt() ->> 'email'));

-- Update pay_links to add Stripe integration columns
ALTER TABLE pay_links ADD COLUMN IF NOT EXISTS stripe_payment_link_url text;
ALTER TABLE pay_links ADD COLUMN IF NOT EXISTS stripe_payment_link_id text;