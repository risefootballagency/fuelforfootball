-- Allow marketeer and analyst staff to view and update notifications
DROP POLICY IF EXISTS "Staff can view notification events" ON public.staff_notification_events;
CREATE POLICY "Staff can view notification events"
ON public.staff_notification_events FOR SELECT
USING (
  has_role(auth.uid(), 'staff'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'marketeer'::app_role)
  OR has_role(auth.uid(), 'analyst'::app_role)
);

DROP POLICY IF EXISTS "Staff can update notification read status" ON public.staff_notification_events;
CREATE POLICY "Staff can update notification read status"
ON public.staff_notification_events FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'staff'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'marketeer'::app_role)
  OR has_role(auth.uid(), 'analyst'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'staff'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'marketeer'::app_role)
  OR has_role(auth.uid(), 'analyst'::app_role)
);

-- Allow admins to insert client earnings on behalf of any staff member
DROP POLICY IF EXISTS "Staff can insert own earnings" ON public.staff_client_earnings;
CREATE POLICY "Staff or admin can insert earnings"
ON public.staff_client_earnings FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = staff_user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);