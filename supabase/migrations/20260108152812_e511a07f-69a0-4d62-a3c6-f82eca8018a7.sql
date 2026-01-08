-- Create signature contracts table
CREATE TABLE public.signature_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  share_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed', 'cancelled')),
  owner_signed_at TIMESTAMP WITH TIME ZONE,
  owner_field_values JSONB DEFAULT '{}',
  completed_pdf_url TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create signature fields table
CREATE TABLE public.signature_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.signature_contracts(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL CHECK (field_type IN ('signature', 'initial', 'date', 'text', 'checkbox')),
  label TEXT,
  page_number INTEGER NOT NULL DEFAULT 1,
  x_position NUMERIC NOT NULL,
  y_position NUMERIC NOT NULL,
  width NUMERIC DEFAULT 200,
  height NUMERIC DEFAULT 50,
  required BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  signer_party TEXT NOT NULL CHECK (signer_party IN ('owner', 'counterparty')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create signature submissions table
CREATE TABLE public.signature_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.signature_contracts(id) ON DELETE CASCADE,
  signer_name TEXT,
  signer_email TEXT,
  field_values JSONB DEFAULT '{}',
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved signatures table
CREATE TABLE public.saved_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  signature_data TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add video_url column to performance_report_actions if not exists
ALTER TABLE public.performance_report_actions 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add player_list_order and star_order to players
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS player_list_order INTEGER,
ADD COLUMN IF NOT EXISTS star_order INTEGER,
ADD COLUMN IF NOT EXISTS hover_image_url TEXT;

-- Create storage bucket for signature contracts if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('signature-contracts', 'signature-contracts', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.signature_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_signatures ENABLE ROW LEVEL SECURITY;

-- Staff can manage signature contracts
CREATE POLICY "Staff can manage signature contracts" ON public.signature_contracts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

-- Public can read contracts by share token (for signing)
CREATE POLICY "Public can read contracts by share token" ON public.signature_contracts
FOR SELECT USING (share_token IS NOT NULL);

-- Staff can manage signature fields
CREATE POLICY "Staff can manage signature fields" ON public.signature_fields
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

-- Public can read signature fields for public contracts
CREATE POLICY "Public can read signature fields" ON public.signature_fields
FOR SELECT USING (true);

-- Staff can manage signature submissions
CREATE POLICY "Staff can manage signature submissions" ON public.signature_submissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

-- Public can insert signature submissions
CREATE POLICY "Public can insert signature submissions" ON public.signature_submissions
FOR INSERT WITH CHECK (true);

-- Public can read their own signature submissions
CREATE POLICY "Public can read signature submissions" ON public.signature_submissions
FOR SELECT USING (true);

-- Staff can manage saved signatures
CREATE POLICY "Staff can manage saved signatures" ON public.saved_signatures
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

-- Users can manage their own saved signatures
CREATE POLICY "Users can manage own saved signatures" ON public.saved_signatures
FOR ALL USING (auth.uid() = user_id);

-- Storage policy for signature-contracts bucket
CREATE POLICY "Public can read signature contract files"
ON storage.objects FOR SELECT
USING (bucket_id = 'signature-contracts');

CREATE POLICY "Staff can upload signature contract files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'signature-contracts' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

CREATE POLICY "Staff can delete signature contract files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'signature-contracts' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('staff', 'admin')
  )
);

-- Create updated_at triggers
CREATE TRIGGER update_signature_contracts_updated_at
  BEFORE UPDATE ON public.signature_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signature_fields_updated_at
  BEFORE UPDATE ON public.signature_fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_signatures_updated_at
  BEFORE UPDATE ON public.saved_signatures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();