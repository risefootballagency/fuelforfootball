-- Retention Clients Table
CREATE TABLE public.retention_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_type TEXT NOT NULL DEFAULT 'existing', -- existing, previous
  contact_email TEXT,
  contact_phone TEXT,
  player_id UUID REFERENCES public.players(id),
  last_contact_date DATE,
  next_contact_date DATE,
  status TEXT NOT NULL DEFAULT 'active', -- active, churned, re-engaged
  notes TEXT,
  total_revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Retention Targets Table (monthly)
CREATE TABLE public.retention_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL, -- format: YYYY-MM
  outreach_target INTEGER DEFAULT 0,
  conversion_target INTEGER DEFAULT 0,
  sales_target NUMERIC DEFAULT 0,
  outreach_actual INTEGER DEFAULT 0,
  conversion_actual INTEGER DEFAULT 0,
  sales_actual NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month)
);

-- Sales Goals Table
CREATE TABLE public.sales_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL, -- format: YYYY-MM
  packages_target INTEGER DEFAULT 0,
  revenue_target NUMERIC DEFAULT 0,
  packages_actual INTEGER DEFAULT 0,
  revenue_actual NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month)
);

-- Sales Hub Content Table
CREATE TABLE public.sales_hub_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- process, script, pitch, resource
  content TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Outreach Prospects Table
CREATE TABLE public.outreach_prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  source TEXT, -- instagram, referral, website, etc.
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, follow_up, meeting_scheduled, converted, lost
  last_contact_date DATE,
  next_follow_up DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Outreach Targets Table (monthly)
CREATE TABLE public.outreach_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL, -- format: YYYY-MM
  new_prospects_target INTEGER DEFAULT 0,
  follow_ups_target INTEGER DEFAULT 0,
  conversions_target INTEGER DEFAULT 0,
  new_prospects_actual INTEGER DEFAULT 0,
  follow_ups_actual INTEGER DEFAULT 0,
  conversions_actual INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month)
);

-- Time Tracking Table for coaching services
CREATE TABLE public.service_time_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL, -- analysis, coaching, programme, highlights, etc.
  player_id UUID REFERENCES public.players(id),
  player_name TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  fee_received NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'GBP',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.retention_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_hub_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_time_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff access
CREATE POLICY "Staff can manage retention_clients" ON public.retention_clients
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage retention_targets" ON public.retention_targets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage sales_goals" ON public.sales_goals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage sales_hub_content" ON public.sales_hub_content
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage outreach_prospects" ON public.outreach_prospects
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage outreach_targets" ON public.outreach_targets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can manage service_time_tracking" ON public.service_time_tracking
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_retention_clients_updated_at
  BEFORE UPDATE ON public.retention_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_retention_targets_updated_at
  BEFORE UPDATE ON public.retention_targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_goals_updated_at
  BEFORE UPDATE ON public.sales_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_hub_content_updated_at
  BEFORE UPDATE ON public.sales_hub_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outreach_prospects_updated_at
  BEFORE UPDATE ON public.outreach_prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outreach_targets_updated_at
  BEFORE UPDATE ON public.outreach_targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_time_tracking_updated_at
  BEFORE UPDATE ON public.service_time_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();