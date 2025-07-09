-- Drop existing functions first
DROP FUNCTION IF EXISTS public.get_current_user_profile();
DROP FUNCTION IF EXISTS public.is_current_user_admin();

-- Drop all existing policies and constraints
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.credit_transactions;

-- Drop foreign key constraints if they exist
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_user_id_fkey;

-- Drop and recreate the tables with correct types for Clerk
DROP TABLE IF EXISTS public.credit_transactions;
DROP TABLE IF EXISTS public.profiles;

-- Create profiles table with TEXT user_id for Clerk compatibility
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    credits INTEGER NOT NULL DEFAULT 100,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE public.credit_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT,
    credits_used INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create admin functions first (before policies)
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

-- Create RLS policies for Clerk auth using auth.jwt() ->> 'sub'
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

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();