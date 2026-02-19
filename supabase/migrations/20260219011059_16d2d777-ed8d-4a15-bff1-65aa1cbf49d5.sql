-- Add quick_stats JSONB column to service_catalog for staff-controlled stats/tags on service cards
ALTER TABLE public.service_catalog ADD COLUMN IF NOT EXISTS quick_stats jsonb DEFAULT '[]';

-- quick_stats format: [{"label": "24% Physical Improvement", "icon": "trending-up"}, ...]
COMMENT ON COLUMN public.service_catalog.quick_stats IS 'Array of quick stat tags displayed on service cards, managed by staff';