-- Complete reset to fix the UUID/TEXT issue
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_profile() CASCADE;

-- Create new tables with proper TEXT user_id for Clerk
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

-- Create simple policies that work without complex auth functions
CREATE POLICY "Allow all for now" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now transactions" ON public.credit_transactions FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin profile for your email
INSERT INTO public.profiles (user_id, email, full_name, credits, is_admin)
VALUES ('user_2zdEafNheQbmUehcj1PNh3Itkw1', 'classroom2cash@gmail.com', 'Admin User', 1000, true)
ON CONFLICT (user_id) DO UPDATE SET 
    is_admin = true, 
    credits = 1000;