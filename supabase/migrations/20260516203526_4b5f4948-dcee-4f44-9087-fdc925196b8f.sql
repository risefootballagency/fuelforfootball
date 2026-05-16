ALTER TABLE public.pay_links
  ADD COLUMN IF NOT EXISTS is_invoice boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS invoice_due_date date,
  ADD COLUMN IF NOT EXISTS invoice_paid_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_pay_links_player_invoice
  ON public.pay_links (player_id, is_invoice)
  WHERE is_invoice = true;

CREATE OR REPLACE FUNCTION public.notify_invoice_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_player_name text;
BEGIN
  IF NEW.is_invoice = true
     AND NEW.status = 'completed'
     AND (OLD.status IS DISTINCT FROM NEW.status)
  THEN
    NEW.invoice_paid_at := COALESCE(NEW.invoice_paid_at, now());

    SELECT name INTO v_player_name FROM public.players WHERE id = NEW.player_id;

    INSERT INTO public.staff_notification_events (event_type, title, body, event_data)
    VALUES (
      'invoice_paid',
      'Invoice Paid',
      COALESCE(v_player_name, 'A player') || ' paid invoice: ' || NEW.title,
      jsonb_build_object(
        'pay_link_id', NEW.id,
        'player_id', NEW.player_id,
        'player_name', v_player_name,
        'amount', NEW.amount,
        'currency', NEW.currency,
        'title', NEW.title
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_invoice_paid ON public.pay_links;
CREATE TRIGGER trg_notify_invoice_paid
BEFORE UPDATE ON public.pay_links
FOR EACH ROW
EXECUTE FUNCTION public.notify_invoice_paid();