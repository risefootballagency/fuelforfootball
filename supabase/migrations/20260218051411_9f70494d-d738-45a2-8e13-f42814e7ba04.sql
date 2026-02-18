
-- Create club_ratings table for ClubRatings component
CREATE TABLE public.club_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  club_name TEXT NOT NULL,
  first_team_rating TEXT DEFAULT '',
  academy_rating TEXT DEFAULT '',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.club_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to club_ratings"
  ON public.club_ratings FOR ALL
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_club_ratings_updated_at
  BEFORE UPDATE ON public.club_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create form_grade_configs table for FormGradesManagement component
CREATE TABLE public.form_grade_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  grade TEXT NOT NULL,
  criteria TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.form_grade_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to form_grade_configs"
  ON public.form_grade_configs FOR ALL
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_form_grade_configs_updated_at
  BEFORE UPDATE ON public.form_grade_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
