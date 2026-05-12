
-- Saved SPQ reports
CREATE TABLE IF NOT EXISTS public.psychology_spq_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES public.players(id) ON DELETE SET NULL,
  player_name text NOT NULL,
  gender_norm text NOT NULL,
  age_band text,
  pasted_answers text,
  parsed_answers jsonb,
  scale_scores jsonb,
  factor_scores jsonb,
  report_summary text,
  recommendations text,
  visual_one_url text,
  visual_two_url text,
  visual_three_url text,
  share_slug text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  is_shared boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.psychology_spq_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view SPQ reports" ON public.psychology_spq_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert SPQ reports" ON public.psychology_spq_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update SPQ reports" ON public.psychology_spq_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete SPQ reports" ON public.psychology_spq_reports FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_psychology_spq_reports_player_id ON public.psychology_spq_reports(player_id);
CREATE INDEX IF NOT EXISTS idx_psychology_spq_reports_share_slug ON public.psychology_spq_reports(share_slug);

DROP TRIGGER IF EXISTS update_psychology_spq_reports_updated_at ON public.psychology_spq_reports;
CREATE TRIGGER update_psychology_spq_reports_updated_at
BEFORE UPDATE ON public.psychology_spq_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public SPQ test submissions
CREATE TABLE IF NOT EXISTS public.spq_test_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_name text,
  submitter_email text,
  age_band text NOT NULL,
  gender_norm text NOT NULL,
  responses jsonb NOT NULL,
  scale_scores jsonb NOT NULL,
  factor_scores jsonb NOT NULL,
  visitor_ip text,
  visitor_country text,
  visitor_city text,
  visitor_user_agent text,
  matched_player_id uuid REFERENCES public.players(id) ON DELETE SET NULL,
  saved_report_id uuid REFERENCES public.psychology_spq_reports(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spq_test_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit SPQ test" ON public.spq_test_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated view SPQ submissions" ON public.spq_test_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated update SPQ submissions" ON public.spq_test_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete SPQ submissions" ON public.spq_test_submissions FOR DELETE TO authenticated USING (true);

-- Public RPC for shared SPQ reports
CREATE OR REPLACE FUNCTION public.get_shared_spq_report(_share_slug text)
RETURNS TABLE (
  id uuid,
  player_name text,
  gender_norm text,
  age_band text,
  scale_scores jsonb,
  factor_scores jsonb,
  report_summary text,
  recommendations text,
  visual_one_url text,
  visual_two_url text,
  visual_three_url text,
  created_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.player_name, r.gender_norm, r.age_band,
         r.scale_scores, r.factor_scores, r.report_summary, r.recommendations,
         r.visual_one_url, r.visual_two_url, r.visual_three_url, r.created_at
  FROM public.psychology_spq_reports r
  WHERE r.share_slug = _share_slug AND r.is_shared = true
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_spq_report(text) TO anon, authenticated;
