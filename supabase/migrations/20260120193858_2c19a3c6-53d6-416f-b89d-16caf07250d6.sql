-- Drop the foreign key constraint that references local players table
-- This allows storing player_id values from the shared database
ALTER TABLE marketing_gallery 
DROP CONSTRAINT IF EXISTS marketing_gallery_player_id_fkey;