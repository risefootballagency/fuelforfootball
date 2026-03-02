
-- 1. Create staff_notification_settings table
CREATE TABLE IF NOT EXISTS public.staff_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  event_type TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role, event_type)
);

ALTER TABLE public.staff_notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read notification settings"
  ON public.staff_notification_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage notification settings"
  ON public.staff_notification_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_staff_notification_settings_updated_at
  BEFORE UPDATE ON public.staff_notification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Add missing RLS policies for staff_notification_events
CREATE POLICY "Authenticated users can insert notification events"
  ON public.staff_notification_events FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon can insert notification events"
  ON public.staff_notification_events FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Staff can update notification read status"
  ON public.staff_notification_events FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- 3. Create trigger functions for automatic notification logging

-- Site visit notifications (with location)
CREATE OR REPLACE FUNCTION public.log_site_visit_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff_notification_events (event_type, title, body, event_data)
  VALUES (
    'visitor',
    'New Site Visitor',
    'Visited ' || NEW.page_path,
    jsonb_build_object(
      'page', NEW.page_path,
      'visitor_id', NEW.visitor_id,
      'user_agent', NEW.user_agent,
      'referrer', NEW.referrer,
      'location', NEW.location
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

DROP TRIGGER IF EXISTS trigger_site_visit_notification ON public.site_visits;
CREATE TRIGGER trigger_site_visit_notification
  AFTER INSERT ON public.site_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.log_site_visit_notification();

-- Form submission notifications
CREATE OR REPLACE FUNCTION public.log_form_submission_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff_notification_events (event_type, title, body, event_data)
  VALUES (
    'form_submission',
    'New Form Submission',
    NEW.form_type || ' form submitted',
    jsonb_build_object(
      'form_type', NEW.form_type,
      'form_id', NEW.id,
      'data', NEW.data
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

DROP TRIGGER IF EXISTS trigger_form_submission_notification ON public.form_submissions;
CREATE TRIGGER trigger_form_submission_notification
  AFTER INSERT ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_form_submission_notification();

-- Playlist change notifications
CREATE OR REPLACE FUNCTION public.log_playlist_change_notification()
RETURNS TRIGGER AS $$
DECLARE
  event_name TEXT;
  playlist_name TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    event_name := 'created';
    playlist_name := NEW.name;
  ELSIF TG_OP = 'UPDATE' THEN
    event_name := 'updated';
    playlist_name := NEW.name;
  ELSIF TG_OP = 'DELETE' THEN
    event_name := 'deleted';
    playlist_name := OLD.name;
  END IF;
  
  INSERT INTO public.staff_notification_events (event_type, title, body, event_data)
  VALUES (
    'playlist_change',
    'Playlist ' || INITCAP(event_name),
    'Playlist: ' || playlist_name,
    jsonb_build_object(
      'event', event_name,
      'playlist_name', playlist_name,
      'playlist_id', COALESCE(NEW.id, OLD.id)
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

DROP TRIGGER IF EXISTS trigger_playlist_change_notification ON public.playlists;
CREATE TRIGGER trigger_playlist_change_notification
  AFTER INSERT OR UPDATE OR DELETE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.log_playlist_change_notification();

-- Clip upload notifications (player highlights)
CREATE OR REPLACE FUNCTION public.log_clip_upload_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.highlights IS DISTINCT FROM NEW.highlights THEN
    INSERT INTO public.staff_notification_events (event_type, title, body, event_data)
    VALUES (
      'clip_upload',
      'Clip Updated',
      'Highlights updated for ' || NEW.name,
      jsonb_build_object(
        'player_id', NEW.id,
        'player_name', NEW.name
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

DROP TRIGGER IF EXISTS trigger_clip_upload_notification ON public.players;
CREATE TRIGGER trigger_clip_upload_notification
  AFTER UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.log_clip_upload_notification();

-- 4. Enable realtime for staff_notification_events
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_notification_events;
