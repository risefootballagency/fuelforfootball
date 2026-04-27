
-- ============ staff_client_earnings ============
CREATE TABLE public.staff_client_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id uuid NOT NULL,
  client_name text NOT NULL,
  player_id uuid REFERENCES public.players(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  earning_type text NOT NULL CHECK (earning_type IN ('work_75','commission_10','manual')),
  amount_due numeric(12,2) NOT NULL DEFAULT 0,
  percentage numeric(5,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'GBP',
  period_month text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','received','paid_out')),
  received_at date,
  paid_out_at date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sce_staff_period ON public.staff_client_earnings(staff_user_id, period_month);
CREATE INDEX idx_sce_invoice ON public.staff_client_earnings(invoice_id) WHERE invoice_id IS NOT NULL;
CREATE INDEX idx_sce_status ON public.staff_client_earnings(status);

ALTER TABLE public.staff_client_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own earnings"
  ON public.staff_client_earnings FOR SELECT
  USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can insert own earnings"
  ON public.staff_client_earnings FOR INSERT
  WITH CHECK (auth.uid() = staff_user_id);

CREATE POLICY "Staff can update own earnings or admin"
  ON public.staff_client_earnings FOR UPDATE
  USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can delete own earnings"
  ON public.staff_client_earnings FOR DELETE
  USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_sce_updated_at
  BEFORE UPDATE ON public.staff_client_earnings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ staff_payslips ============
CREATE TABLE public.staff_payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_user_id uuid NOT NULL,
  period_month text NOT NULL,
  gross_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_estimate numeric(12,2) NOT NULL DEFAULT 0,
  net_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 20,
  currency text NOT NULL DEFAULT 'GBP',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','paid')),
  submitted_at timestamptz,
  approved_at timestamptz,
  paid_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(staff_user_id, period_month)
);

CREATE INDEX idx_payslip_staff ON public.staff_payslips(staff_user_id);
CREATE INDEX idx_payslip_status ON public.staff_payslips(status);

ALTER TABLE public.staff_payslips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own payslips"
  ON public.staff_payslips FOR SELECT
  USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can insert own payslips"
  ON public.staff_payslips FOR INSERT
  WITH CHECK (auth.uid() = staff_user_id);

CREATE POLICY "Staff or admin can update payslips"
  ON public.staff_payslips FOR UPDATE
  USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can delete own draft payslips"
  ON public.staff_payslips FOR DELETE
  USING ((auth.uid() = staff_user_id AND status = 'draft') OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_payslip_updated_at
  BEFORE UPDATE ON public.staff_payslips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ staff_pay_settings ============
CREATE TABLE public.staff_pay_settings (
  staff_user_id uuid PRIMARY KEY,
  default_tax_rate numeric(5,2) NOT NULL DEFAULT 20,
  preferred_currency text NOT NULL DEFAULT 'GBP',
  default_earning_type text NOT NULL DEFAULT 'work_75' CHECK (default_earning_type IN ('work_75','commission_10','manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_pay_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own pay settings"
  ON public.staff_pay_settings FOR SELECT
  USING (auth.uid() = staff_user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff can upsert own pay settings"
  ON public.staff_pay_settings FOR INSERT
  WITH CHECK (auth.uid() = staff_user_id);

CREATE POLICY "Staff can update own pay settings"
  ON public.staff_pay_settings FOR UPDATE
  USING (auth.uid() = staff_user_id);

CREATE TRIGGER trg_sps_updated_at
  BEFORE UPDATE ON public.staff_pay_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Auto-receive trigger ============
-- When an invoice's amount_paid increases and a linked earning is still pending,
-- mark the earning as received.
CREATE OR REPLACE FUNCTION public.auto_receive_staff_earning()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(NEW.amount_paid,0) > COALESCE(OLD.amount_paid,0) THEN
    UPDATE public.staff_client_earnings
       SET status = 'received',
           received_at = COALESCE(received_at, CURRENT_DATE)
     WHERE invoice_id = NEW.id
       AND status = 'pending';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_invoice_auto_receive_earning
  AFTER UPDATE OF amount_paid ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.auto_receive_staff_earning();
