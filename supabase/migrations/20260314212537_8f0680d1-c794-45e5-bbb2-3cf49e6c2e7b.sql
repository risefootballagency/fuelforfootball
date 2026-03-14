
ALTER TABLE public.pay_links ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Backfill existing pay links with slugs generated from title
UPDATE public.pay_links 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || LEFT(id::text, 8)
WHERE slug IS NULL;
