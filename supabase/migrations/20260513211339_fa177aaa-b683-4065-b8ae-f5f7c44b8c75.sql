CREATE TABLE IF NOT EXISTS public.staff_pay_visibility (
  staff_user_id uuid PRIMARY KEY,
  hidden boolean NOT NULL DEFAULT false,
  hidden_reason text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_pay_visibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage staff pay visibility" ON public.staff_pay_visibility;
CREATE POLICY "Admins can manage staff pay visibility"
ON public.staff_pay_visibility
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_staff_pay_visibility_updated_at
BEFORE UPDATE ON public.staff_pay_visibility
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.staff_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id uuid NOT NULL,
  period_month text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'GBP',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text,
  reference text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_payments_staff_period ON public.staff_payments(staff_user_id, period_month);
CREATE INDEX IF NOT EXISTS idx_staff_payments_date ON public.staff_payments(payment_date DESC);

ALTER TABLE public.staff_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view own staff payments" ON public.staff_payments;
CREATE POLICY "Staff can view own staff payments"
ON public.staff_payments
FOR SELECT
TO authenticated
USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert staff payments" ON public.staff_payments;
CREATE POLICY "Admins can insert staff payments"
ON public.staff_payments
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update staff payments" ON public.staff_payments;
CREATE POLICY "Admins can update staff payments"
ON public.staff_payments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete staff payments" ON public.staff_payments;
CREATE POLICY "Admins can delete staff payments"
ON public.staff_payments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_staff_payments_updated_at
BEFORE UPDATE ON public.staff_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();