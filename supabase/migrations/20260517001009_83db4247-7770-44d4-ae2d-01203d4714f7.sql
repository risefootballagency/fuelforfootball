ALTER TABLE public.pay_links
  ADD COLUMN IF NOT EXISTS invoice_kind text NOT NULL DEFAULT 'agreed',
  ADD COLUMN IF NOT EXISTS line_items jsonb;

ALTER TABLE public.pay_links
  DROP CONSTRAINT IF EXISTS pay_links_invoice_kind_check;

ALTER TABLE public.pay_links
  ADD CONSTRAINT pay_links_invoice_kind_check
  CHECK (invoice_kind IN ('agreed', 'suggestion'));