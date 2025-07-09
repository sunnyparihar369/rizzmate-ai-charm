-- Fix infinite recursion in RLS policies by using security definer functions
-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can insert all transactions" ON public.credit_transactions;

-- Create security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid()::text LIMIT 1),
    false
  );
$$;

-- Create new admin policies using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin_user());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin_user());

CREATE POLICY "Admins can view all transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (public.is_admin_user());

CREATE POLICY "Admins can insert all transactions" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (public.is_admin_user());