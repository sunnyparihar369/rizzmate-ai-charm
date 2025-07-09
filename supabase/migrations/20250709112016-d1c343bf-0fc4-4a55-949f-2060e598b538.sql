-- Fix RLS performance issues and consolidate multiple permissive policies
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can insert all transactions" ON public.credit_transactions;

-- Create optimized consolidated policies for profiles table
CREATE POLICY "Users and admins can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (select auth.uid())::text = user_id 
  OR public.is_admin_user()
);

CREATE POLICY "Users and admins can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  (select auth.uid())::text = user_id 
  OR public.is_admin_user()
);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK ((select auth.uid())::text = user_id);

-- Create optimized consolidated policies for credit_transactions table
CREATE POLICY "Users and admins can view transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (
  (select auth.uid())::text = user_id 
  OR public.is_admin_user()
);

CREATE POLICY "Users and admins can insert transactions" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (
  (select auth.uid())::text = user_id 
  OR public.is_admin_user()
);