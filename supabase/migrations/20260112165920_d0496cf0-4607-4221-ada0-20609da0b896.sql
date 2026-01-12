-- Add folder_id column to staff_documents for organizing docs into folders
ALTER TABLE public.staff_documents 
ADD COLUMN IF NOT EXISTS folder_id TEXT;