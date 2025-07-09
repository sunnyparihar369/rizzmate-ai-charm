-- Drop all policies that reference user_id columns first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.credit_transactions;

-- Now alter the column types to handle Clerk user IDs (which are strings)
ALTER TABLE public.profiles 
ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE public.credit_transactions 
ALTER COLUMN user_id TYPE TEXT;

-- Recreate the policies with proper Clerk auth handling
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (is_current_user_admin() = true);

CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (is_current_user_admin() = true);

CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.credit_transactions
FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Admins can view all transactions" ON public.credit_transactions
FOR SELECT USING (is_current_user_admin() = true);

-- Update admin functions to work with Clerk auth
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