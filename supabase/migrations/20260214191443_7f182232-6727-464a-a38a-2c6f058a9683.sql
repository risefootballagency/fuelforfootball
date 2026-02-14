
-- Fix sales_goals RLS
DROP POLICY IF EXISTS "Staff can manage sales_goals" ON public.sales_goals;
CREATE POLICY "Allow sales_goals access"
  ON public.sales_goals FOR ALL
  USING (true) WITH CHECK (true);

-- Fix outreach_prospects RLS  
DROP POLICY IF EXISTS "Staff can manage outreach_prospects" ON public.outreach_prospects;
CREATE POLICY "Allow outreach_prospects access"
  ON public.outreach_prospects FOR ALL
  USING (true) WITH CHECK (true);

-- Fix outreach_targets RLS
DROP POLICY IF EXISTS "Staff can manage outreach_targets" ON public.outreach_targets;
CREATE POLICY "Allow outreach_targets access"
  ON public.outreach_targets FOR ALL
  USING (true) WITH CHECK (true);
