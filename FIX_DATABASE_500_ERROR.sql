-- =====================================================
-- FIX: 500 Error When Fetching User Profiles
-- This script diagnoses and fixes common database issues
-- =====================================================

-- STEP 1: Check if user_role enum exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        RAISE NOTICE '❌ user_role enum does NOT exist - Creating it now...';
        CREATE TYPE user_role AS ENUM ('user', 'admin');
        RAISE NOTICE '✅ Created user_role enum';
    ELSE
        RAISE NOTICE '✅ user_role enum exists';
    END IF;
END $$;

-- STEP 2: Check if user_profiles table exists with correct structure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) THEN
        RAISE NOTICE '❌ user_profiles table does NOT exist - Creating it now...';
        
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            full_name TEXT,
            role user_role NOT NULL DEFAULT 'user',
            avatar_url TEXT,
            date_of_birth DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
            last_sign_in_at TIMESTAMP WITH TIME ZONE
        );
        
        RAISE NOTICE '✅ Created user_profiles table';
    ELSE
        RAISE NOTICE '✅ user_profiles table exists';
    END IF;
END $$;

-- STEP 3: Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- STEP 4: Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 5: Drop existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service can insert profiles" ON public.user_profiles;

-- STEP 6: Recreate RLS policies
-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT role FROM public.user_profiles WHERE id = auth.uid())
    );

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update all profiles"
    ON public.user_profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Service role can insert new profiles (for signup trigger)
CREATE POLICY "Service can insert profiles"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (true);

-- STEP 7: Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING; -- Prevent errors if profile already exists
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW; -- Don't fail the auth.users insert
END;
$$ LANGUAGE plpgsql;

-- STEP 8: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- STEP 9: Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- STEP 10: Create helper functions
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS VOID 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is admin or service role
    IF NOT (
        public.is_admin(auth.uid()) 
        OR auth.jwt() ->> 'role' = 'service_role'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can promote users';
    END IF;

    UPDATE public.user_profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- STEP 11: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_to_admin TO authenticated;

-- STEP 12: Create profiles for any existing auth users without profiles
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', ''),
    'user'::user_role
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- STEP 13: Display summary
DO $$
DECLARE
    user_count INTEGER;
    profile_count INTEGER;
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
    SELECT COUNT(*) INTO admin_count FROM public.user_profiles WHERE role = 'admin';
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ DATABASE SETUP COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Auth Users: %', user_count;
    RAISE NOTICE 'User Profiles: %', profile_count;
    RAISE NOTICE 'Admin Users: %', admin_count;
    RAISE NOTICE '';
    
    IF admin_count = 0 THEN
        RAISE NOTICE '⚠️  No admin users found!';
        RAISE NOTICE '👉 To create an admin, run:';
        RAISE NOTICE '   SELECT public.promote_to_admin(''YOUR-USER-ID-HERE'');';
        RAISE NOTICE '';
    END IF;
    
    IF user_count <> profile_count THEN
        RAISE NOTICE '⚠️  User count mismatch! Some profiles may be missing.';
    ELSE
        RAISE NOTICE '✅ All users have profiles';
    END IF;
    RAISE NOTICE '========================================';
END $$;

-- Display all users and their profiles
SELECT 
    u.id,
    u.email,
    p.full_name,
    COALESCE(p.role::text, 'NO PROFILE') as role,
    CASE 
        WHEN p.id IS NULL THEN '❌ MISSING'
        ELSE '✅ EXISTS'
    END as profile_status
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
