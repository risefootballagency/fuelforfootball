-- Add annotation_id to performance_report_actions so each action clip can have annotations
ALTER TABLE public.performance_report_actions
ADD COLUMN IF NOT EXISTS annotation_id uuid;

CREATE INDEX IF NOT EXISTS idx_perf_report_actions_annotation
ON public.performance_report_actions(annotation_id);

-- Add notes/title to fff_packages so packages can be edited and named
ALTER TABLE public.fff_packages
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS service_id uuid;

-- Ensure annotation_projects RLS allows the same broad access as analyses:
-- the report viewer (and shared link) reads annotations anonymously.
DROP POLICY IF EXISTS "Public can view annotation projects" ON public.annotation_projects;
CREATE POLICY "Public can view annotation projects"
ON public.annotation_projects
FOR SELECT
USING (true);
