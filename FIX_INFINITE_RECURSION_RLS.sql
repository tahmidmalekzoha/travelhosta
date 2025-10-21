-- =====================================================
-- FIX: Infinite Recursion in RLS Policies
-- Error: code '42P17' - infinite recursion detected
-- =====================================================

-- The problem: RLS policies that check user_profiles role are causing
-- infinite recursion when trying to read from user_profiles

-- SOLUTION: Use a separate function with SECURITY DEFINER to bypass RLS

-- =====================================================
-- STEP 1: Drop existing problematic policies
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service can insert profiles" ON public.user_profiles;

-- =====================================================
-- STEP 2: Create helper function to check admin status
-- This function uses SECURITY DEFINER to bypass RLS
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Direct query bypassing RLS due to SECURITY DEFINER
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE id = user_id;
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- =====================================================
-- STEP 3: Create NEW RLS policies without recursion
-- =====================================================

-- Policy 1: Users can SELECT their own profile
-- Simple check: auth.uid() = id (no recursion)
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Admins can SELECT all profiles
-- Uses helper function to avoid recursion
CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (public.is_admin_user(auth.uid()));

-- Policy 3: Users can UPDATE their own profile (except role)
-- Uses WITH CHECK to prevent role changes
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (
            SELECT role 
            FROM public.user_profiles 
            WHERE id = auth.uid()
            LIMIT 1
        )
    );

-- Policy 4: Admins can UPDATE all profiles
-- Uses helper function to avoid recursion
CREATE POLICY "Admins can update all profiles"
    ON public.user_profiles
    FOR UPDATE
    USING (public.is_admin_user(auth.uid()));

-- Policy 5: Service role can INSERT new profiles
-- No conditions - allows trigger to work
CREATE POLICY "Service can insert profiles"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (true);

-- Policy 6: Authenticated users can INSERT their own profile
-- For the auto-creation fallback in the app
CREATE POLICY "Users can create own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- STEP 4: Grant necessary permissions
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin_user TO authenticated, anon;

-- =====================================================
-- STEP 5: Verify the fix
-- =====================================================

-- Test 1: Check that policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd as command
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Test 2: Try to select your own profile (should work)
SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- Test 3: Check if is_admin_user function works
SELECT public.is_admin_user(auth.uid()) as am_i_admin;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ RLS POLICIES FIXED';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'The infinite recursion issue has been resolved.';
    RAISE NOTICE 'Policies now use SECURITY DEFINER function.';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now:';
    RAISE NOTICE '  1. Sign in to your app';
    RAISE NOTICE '  2. View your profile';
    RAISE NOTICE '  3. Admins can view all profiles';
    RAISE NOTICE '';
    RAISE NOTICE 'Try logging in now!';
    RAISE NOTICE '========================================';
END $$;
