-- =====================================================
-- User Profiles Diagnostic Script
-- Run this in Supabase SQL Editor to check your setup
-- =====================================================

-- 1. Check if user_profiles table exists
SELECT 
    'Table Check' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles'
        ) 
        THEN '✅ user_profiles table exists' 
        ELSE '❌ user_profiles table NOT found' 
    END as result;

-- 2. Check if RLS is enabled
SELECT 
    'RLS Check' as test,
    CASE 
        WHEN rowsecurity = true 
        THEN '✅ RLS is enabled' 
        ELSE '⚠️ RLS is NOT enabled' 
    END as result
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';

-- 3. Count RLS policies
SELECT 
    'RLS Policies' as test,
    COUNT(*)::text || ' policies found' as result
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';

-- 4. List all RLS policies
SELECT 
    'Policy: ' || policyname as policy_name,
    cmd as operation,
    CASE 
        WHEN permissive = 't' THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as type
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles'
ORDER BY policyname;

-- 5. Check trigger exists
SELECT 
    'Trigger Check' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) 
        THEN '✅ Trigger on_auth_user_created exists' 
        ELSE '❌ Trigger on_auth_user_created NOT found' 
    END as result;

-- 6. Count auth users
SELECT 
    'Auth Users' as test,
    COUNT(*)::text || ' users in auth.users' as result
FROM auth.users;

-- 7. Count user profiles
SELECT 
    'User Profiles' as test,
    COUNT(*)::text || ' profiles in user_profiles' as result
FROM public.user_profiles;

-- 8. Find orphaned auth users (users without profiles)
SELECT 
    'Orphaned Users' as test,
    COUNT(*)::text || ' users without profiles' as result
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 9. List all users with their profile status
SELECT 
    u.id,
    u.email,
    u.created_at as auth_created_at,
    p.full_name,
    p.role,
    p.created_at as profile_created_at,
    CASE 
        WHEN p.id IS NULL THEN '❌ NO PROFILE'
        ELSE '✅ HAS PROFILE'
    END as status
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 10. Check admin users
SELECT 
    'Admin Users' as test,
    COALESCE(COUNT(*)::text, '0') || ' admin users found' as result
FROM public.user_profiles
WHERE role = 'admin';

-- 11. List admin users
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM public.user_profiles
WHERE role = 'admin'
ORDER BY created_at;

-- =====================================================
-- HELPFUL COMMANDS (commented out - uncomment to use)
-- =====================================================

-- Create profiles for orphaned users:
/*
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', ''),
    'user'::user_role
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL;
*/

-- Promote a user to admin (replace with actual email):
/*
SELECT public.promote_to_admin(
    (SELECT id FROM public.user_profiles WHERE email = 'your-email@example.com')
);
*/

-- Check your own profile (will only work if you're logged in via Supabase):
/*
SELECT * FROM public.user_profiles WHERE id = auth.uid();
*/

-- Manually create a profile for a specific user:
/*
INSERT INTO public.user_profiles (id, email, full_name, role)
VALUES (
    'user-id-here',
    'email@example.com',
    'Full Name',
    'user'::user_role
);
*/
