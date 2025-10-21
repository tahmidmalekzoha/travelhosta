# User Profile Error Fix - Complete Guide

## Problem Summary

The application was encountering an error when trying to fetch user profiles after authentication:

```
Get user profile error: {}
```

This was happening because:

1. The user profile might not exist in the database
2. The database trigger might have failed to create the profile
3. RLS policies might be preventing access

## Changes Made

### 1. Enhanced Error Logging (`authService.ts`)

**Before:**

```typescript
if (error) {
  console.error("Get user profile error:", error);
  return null;
}
```

**After:**

```typescript
if (error) {
  // Log detailed error information
  console.error("Get user profile error:", {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    userId: userId,
  });

  // If profile doesn't exist, try to create it
  if (error.code === "PGRST116") {
    console.warn("User profile not found, attempting to create it...");
    return await createUserProfileIfMissing(userId);
  }

  return null;
}
```

### 2. Added Fallback Profile Creation

Created a new function `createUserProfileIfMissing` that:

- Detects when a profile is missing (error code `PGRST116`)
- Attempts to create the profile using the authenticated user's data
- Extracts `full_name` and `date_of_birth` from user metadata
- Sets the default role as 'user'

### 3. Added Retry Logic in `AuthContext`

Both in initialization and auth state changes:

- First attempt to fetch the profile
- If it fails, wait 1 second and retry once
- This handles race conditions where the trigger might be slow

## Database Checklist

### Verify the Database Setup

Run these queries in your Supabase SQL Editor to check everything is set up correctly:

#### 1. Check if `user_profiles` table exists:

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_profiles';
```

#### 2. Check if the trigger exists:

```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

#### 3. Check if RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';
```

#### 4. Check existing profiles:

```sql
SELECT id, email, full_name, role, created_at
FROM public.user_profiles;
```

#### 5. Check for orphaned auth users (users without profiles):

```sql
SELECT u.id, u.email, u.created_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

### Fix Orphaned Users

If you find users without profiles, create them manually:

```sql
-- Replace with actual user IDs
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', ''),
    'user'::user_role
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

### Create Your First Admin User

After signing up, promote yourself to admin:

```sql
-- First, find your user ID
SELECT id, email FROM public.user_profiles WHERE email = 'your-email@example.com';

-- Then promote to admin
SELECT public.promote_to_admin('your-user-id-here');

-- Verify
SELECT id, email, role FROM public.user_profiles WHERE email = 'your-email@example.com';
```

## Testing the Fix

### 1. Test New User Signup

1. Sign up with a new account
2. Check the browser console for detailed logs
3. Verify the profile is created in the database
4. Check that you can see your name in the signin button

### 2. Test Existing User Login

1. Log in with an existing account
2. The system should either:
   - Load the existing profile, OR
   - Detect missing profile and create it automatically
3. Verify no errors in console (or only informational warnings)

### 3. Check Profile Display

- The signin button should show your full name (if provided) or email username
- The avatar should show the first letter of your display name
- The role should be displayed correctly

## Error Codes Reference

- **PGRST116**: Row not found (profile doesn't exist)
- **42501**: Insufficient privileges (RLS policy issue)
- **23505**: Unique constraint violation (duplicate profile)

## Troubleshooting

### If you still see errors:

1. **Check Supabase connection:**

   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment variables
   - Make sure Supabase project is running

2. **Check RLS policies:**

   - Users must be able to read their own profile
   - Service role must be able to insert profiles
   - Run the migration file again if needed

3. **Check trigger function:**

   - The trigger should be `SECURITY DEFINER` to bypass RLS
   - It should insert into `user_profiles` after a user is created in `auth.users`

4. **Clear browser cache and cookies:**
   - Sometimes old session data can cause issues
   - Log out completely and log back in

## Next Steps

1. ✅ Test the application with the new error handling
2. ✅ Monitor console for detailed error messages
3. ✅ Create an admin user using the SQL command above
4. ✅ Verify all existing users have profiles
5. ✅ Test the complete authentication flow

## Related Files

- `frontend/services/authService.ts` - Authentication service with improved error handling
- `frontend/contexts/AuthContext.tsx` - Auth context with retry logic
- `frontend/components/SigninButton.tsx` - Fixed to use `profile` instead of `user`
- `supabase/migrations/20251021000000_create_user_profiles_and_rbac.sql` - Database schema

## Summary

The fix implements a three-layer safety net:

1. **Better error logging** - See exactly what's going wrong
2. **Automatic profile creation** - Create missing profiles on-the-fly
3. **Retry logic** - Handle race conditions and timing issues

This should resolve the profile loading errors while providing detailed feedback about what's happening.
