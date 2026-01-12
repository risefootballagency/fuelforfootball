-- Vision Board Items table for strategic goal tracking
CREATE TABLE public.vision_board_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('scouting', 'recruitment', 'networking', 'marketing', 'performance')),
  vision TEXT NOT NULL,
  action_plan TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  assigned_to UUID[],
  notes TEXT,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vision_board_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Staff can view all, modify their own or if admin
CREATE POLICY "Staff can view all vision board items"
ON public.vision_board_items FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can create vision board items"
ON public.vision_board_items FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update vision board items"
ON public.vision_board_items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can delete vision board items"
ON public.vision_board_items FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Focused Tasks table for pomodoro-style focus sessions
CREATE TABLE public.focused_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER DEFAULT 25,
  actual_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  assigned_to UUID,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.focused_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Staff can view all focused tasks"
ON public.focused_tasks FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can create focused tasks"
ON public.focused_tasks FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update focused tasks"
ON public.focused_tasks FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can delete focused tasks"
ON public.focused_tasks FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Press Releases table
CREATE TABLE public.press_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  publish_date TIMESTAMPTZ,
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published press releases"
ON public.press_releases FOR SELECT
USING (published = TRUE OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can manage press releases"
ON public.press_releases FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Partners table
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('sponsor', 'affiliate', 'media', 'technology', 'other')),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view partners"
ON public.partners FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage partners"
ON public.partners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Marketing Tips table
CREATE TABLE public.marketing_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  image_url TEXT,
  video_url TEXT,
  is_lesson BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.marketing_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view marketing tips"
ON public.marketing_tips FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'marketeer'));

CREATE POLICY "Admin can manage marketing tips"
ON public.marketing_tips FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Jobs table for job listings
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  department TEXT,
  salary_range TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs"
ON public.jobs FOR SELECT
USING (is_active = TRUE OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage jobs"
ON public.jobs FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update triggers for updated_at
CREATE TRIGGER update_vision_board_items_updated_at
BEFORE UPDATE ON public.vision_board_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_focused_tasks_updated_at
BEFORE UPDATE ON public.focused_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_press_releases_updated_at
BEFORE UPDATE ON public.press_releases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketing_tips_updated_at
BEFORE UPDATE ON public.marketing_tips
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();