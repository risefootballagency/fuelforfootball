-- Add bold team name fields to analyses table
ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS home_team_bold boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS away_team_bold boolean DEFAULT false;