-- Fix the user_id column type to handle Clerk user IDs (which are strings, not UUIDs)
ALTER TABLE public.profiles 
ALTER COLUMN user_id TYPE TEXT;

-- Update credit_transactions table as well
ALTER TABLE public.credit_transactions 
ALTER COLUMN user_id TYPE TEXT;

-- Update the handle_new_user function to work with text user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, credits, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'classroom2cash@gmail.com' THEN 1000
      ELSE 100
    END,
    NEW.email = 'classroom2cash@gmail.com'
  );
  RETURN NEW;
END;
$$;

-- Update RLS policies to work with text user_id
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Update credit transactions policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;

CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.credit_transactions
FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Update admin-related functions
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.jwt() ->> 'sub' AND is_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT id::text FROM public.profiles WHERE user_id = auth.jwt() ->> 'sub';
$$;