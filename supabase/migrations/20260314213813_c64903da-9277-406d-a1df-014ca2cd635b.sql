-- Recreate notification triggers that are missing

-- 1. Site visit trigger
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_site_visit ON public.site_visits;
CREATE TRIGGER on_site_visit
  AFTER INSERT ON public.site_visits
  FOR EACH ROW EXECUTE FUNCTION public.log_site_visit_notification();

-- 2. Form submission trigger
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_form_submission ON public.form_submissions;
CREATE TRIGGER on_form_submission
  AFTER INSERT ON public.form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.log_form_submission_notification();

-- 3. Playlist change trigger
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_playlist_change ON public.highlight_projects;
CREATE TRIGGER on_playlist_change
  AFTER INSERT OR UPDATE OR DELETE ON public.highlight_projects
  FOR EACH ROW EXECUTE FUNCTION public.log_playlist_change_notification();

-- 4. Clip upload trigger
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_clip_upload ON public.players;
CREATE TRIGGER on_clip_upload
  AFTER UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.log_clip_upload_notification();

-- 5. Enable realtime for staff_notification_events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'staff_notification_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_notification_events;
  END IF;
END $$;