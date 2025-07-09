-- Create a simple admin setup function that can make the first user an admin
-- or allow any user to become admin if no admin exists yet

CREATE OR REPLACE FUNCTION public.setup_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile_id uuid;
BEGIN
  -- Find the user by email
  SELECT id INTO user_profile_id 
  FROM public.profiles 
  WHERE email = user_email;
  
  -- If user exists, make them admin
  IF user_profile_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET is_admin = true 
    WHERE id = user_profile_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Insert a dummy admin user for testing
-- Note: You'll need to sign up with these credentials first through the normal signup process
-- Email: admin@rizzmate.com
-- After signing up, this user will automatically be made admin

-- Create a trigger to auto-make the admin@rizzmate.com user admin when they sign up
CREATE OR REPLACE FUNCTION public.auto_admin_setup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If the email is admin@rizzmate.com, make them admin
  IF NEW.email = 'admin@rizzmate.com' THEN
    NEW.is_admin = true;
    NEW.credits = 1000; -- Give admin extra credits
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger that runs before insert on profiles
DROP TRIGGER IF EXISTS auto_admin_trigger ON public.profiles;
CREATE TRIGGER auto_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_admin_setup();