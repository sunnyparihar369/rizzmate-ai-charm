-- Fix RLS policies to properly secure admin access and functionality

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all for now" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for now transactions" ON public.credit_transactions;

-- Create proper RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Admin policies for profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid()::text AND is_admin = true
  )
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid()::text AND is_admin = true
  )
);

-- Create proper RLS policies for credit_transactions table
CREATE POLICY "Users can view their own transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Admin policies for transactions
CREATE POLICY "Admins can view all transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid()::text AND is_admin = true
  )
);

CREATE POLICY "Admins can insert all transactions" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid()::text AND is_admin = true
  )
);

-- Update profiles table to use text for user_id to match Clerk
ALTER TABLE public.profiles ALTER COLUMN user_id TYPE text;