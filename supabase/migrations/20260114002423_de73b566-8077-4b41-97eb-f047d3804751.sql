-- Add a public read access policy for analyses table
-- This ensures staff can view analyses regardless of role context

-- First check if the policy exists, if not create it
DO $$
BEGIN
  -- Drop existing restrictive policies if they exist and recreate with proper access
  -- Add a permissive public SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analyses' 
    AND policyname = 'Allow public read access to analyses'
  ) THEN
    CREATE POLICY "Allow public read access to analyses"
    ON public.analyses 
    FOR SELECT 
    TO public
    USING (true);
  END IF;
END $$;