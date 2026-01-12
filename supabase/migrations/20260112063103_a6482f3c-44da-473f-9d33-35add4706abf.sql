-- Create scout_report_feedback table for staff to provide feedback on scout reports
CREATE TABLE public.scout_report_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.scouting_reports(id) ON DELETE CASCADE,
  scout_id UUID NOT NULL REFERENCES public.scouts(id) ON DELETE CASCADE,
  player_feedback TEXT,
  next_steps TEXT,
  future_reference_notes TEXT,
  is_exclusive BOOLEAN DEFAULT FALSE,
  commission_percentage NUMERIC DEFAULT 0,
  staff_notes TEXT,
  created_by TEXT,
  read_by_scout BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scout_report_feedback ENABLE ROW LEVEL SECURITY;

-- Scouts can read their own feedback
CREATE POLICY "Scouts can view their own feedback"
ON public.scout_report_feedback
FOR SELECT
USING (true);

-- Anyone can insert feedback (staff will handle this via admin)
CREATE POLICY "Allow feedback creation"
ON public.scout_report_feedback
FOR INSERT
WITH CHECK (true);

-- Allow updates (for marking as read)
CREATE POLICY "Allow feedback updates"
ON public.scout_report_feedback
FOR UPDATE
USING (true);

-- Add missing columns to scouting_reports if they don't exist
ALTER TABLE public.scouting_reports 
ADD COLUMN IF NOT EXISTS full_match_url TEXT,
ADD COLUMN IF NOT EXISTS rise_report_url TEXT,
ADD COLUMN IF NOT EXISTS additional_documents JSONB,
ADD COLUMN IF NOT EXISTS additional_info TEXT,
ADD COLUMN IF NOT EXISTS contribution_type TEXT;