-- Add services tracking columns to retention_clients
ALTER TABLE public.retention_clients 
ADD COLUMN IF NOT EXISTS services_worked text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_dates jsonb DEFAULT '[]';

-- Add comment explaining the columns
COMMENT ON COLUMN public.retention_clients.services_worked IS 'Array of service names we have worked on with this client';
COMMENT ON COLUMN public.retention_clients.service_dates IS 'JSON array of objects with service name and dates: [{service: string, start_date: date, end_date: date}]';