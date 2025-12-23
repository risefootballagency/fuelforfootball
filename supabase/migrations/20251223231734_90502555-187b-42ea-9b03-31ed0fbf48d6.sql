-- Drop the trigger that was causing issues
DROP TRIGGER IF EXISTS on_auth_user_created_staff ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_staff_user();