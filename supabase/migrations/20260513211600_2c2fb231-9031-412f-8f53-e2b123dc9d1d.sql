CREATE TABLE IF NOT EXISTS public.staff_pay_identities (
  shared_user_id uuid PRIMARY KEY,
  local_user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  role app_role NOT NULL DEFAULT 'staff'::app_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_pay_identities_local ON public.staff_pay_identities(local_user_id);

ALTER TABLE public.staff_pay_identities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage staff pay identities" ON public.staff_pay_identities;
CREATE POLICY "Admins can manage staff pay identities"
ON public.staff_pay_identities
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Staff can view own staff pay identity" ON public.staff_pay_identities;
CREATE POLICY "Staff can view own staff pay identity"
ON public.staff_pay_identities
FOR SELECT
TO authenticated
USING (local_user_id = auth.uid());

CREATE TRIGGER trg_staff_pay_identities_updated_at
BEFORE UPDATE ON public.staff_pay_identities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_staff_pay_self(_staff_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = _staff_user_id
    OR EXISTS (
      SELECT 1
      FROM public.staff_pay_identities spi
      WHERE spi.shared_user_id = _staff_user_id
        AND spi.local_user_id = auth.uid()
    )
$$;

DROP POLICY IF EXISTS "Staff can view own earnings" ON public.staff_client_earnings;
DROP POLICY IF EXISTS "Staff or admin can insert earnings" ON public.staff_client_earnings;
DROP POLICY IF EXISTS "Staff can insert own earnings" ON public.staff_client_earnings;
DROP POLICY IF EXISTS "Staff can update own earnings or admin" ON public.staff_client_earnings;
DROP POLICY IF EXISTS "Staff can delete own earnings" ON public.staff_client_earnings;

CREATE POLICY "Staff can view own earnings"
ON public.staff_client_earnings FOR SELECT
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff or admin can insert earnings"
ON public.staff_client_earnings FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff can update own earnings or admin"
ON public.staff_client_earnings FOR UPDATE
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role))
WITH CHECK (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff can delete own earnings"
ON public.staff_client_earnings FOR DELETE
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

DROP POLICY IF EXISTS "Staff can view own payslips" ON public.staff_payslips;
DROP POLICY IF EXISTS "Staff can insert own payslips" ON public.staff_payslips;
DROP POLICY IF EXISTS "Staff or admin can update payslips" ON public.staff_payslips;
DROP POLICY IF EXISTS "Staff can delete own draft payslips" ON public.staff_payslips;

CREATE POLICY "Staff can view own payslips"
ON public.staff_payslips FOR SELECT
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff can insert own payslips"
ON public.staff_payslips FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_pay_self(staff_user_id));

CREATE POLICY "Staff or admin can update payslips"
ON public.staff_payslips FOR UPDATE
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role))
WITH CHECK (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff can delete own draft payslips"
ON public.staff_payslips FOR DELETE
USING ((public.is_staff_pay_self(staff_user_id) AND status = 'draft') OR public.has_role(auth.uid(),'admin'::app_role));

DROP POLICY IF EXISTS "Staff can view own pay settings" ON public.staff_pay_settings;
DROP POLICY IF EXISTS "Staff can upsert own pay settings" ON public.staff_pay_settings;
DROP POLICY IF EXISTS "Staff can update own pay settings" ON public.staff_pay_settings;

CREATE POLICY "Staff can view own pay settings"
ON public.staff_pay_settings FOR SELECT
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff can upsert own pay settings"
ON public.staff_pay_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Staff can update own pay settings"
ON public.staff_pay_settings FOR UPDATE
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role))
WITH CHECK (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(),'admin'::app_role));

DROP POLICY IF EXISTS "Staff can view own staff payments" ON public.staff_payments;
CREATE POLICY "Staff can view own staff payments"
ON public.staff_payments
FOR SELECT
TO authenticated
USING (public.is_staff_pay_self(staff_user_id) OR public.has_role(auth.uid(), 'admin'::app_role));