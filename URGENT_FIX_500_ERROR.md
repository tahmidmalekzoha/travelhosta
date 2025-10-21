# 🔴 URGENT: Fix 500 Database Error

## The Problem

You're getting a **500 Internal Server Error** when trying to fetch user profiles:

```
Failed to load resource: the server responded with a status of 500 ()
Get user profile error: Object
```

This means the database is encountering an error, likely because:

1. ❌ The `user_profiles` table doesn't exist
2. ❌ The `user_role` enum type is missing
3. ❌ The database migration was never run
4. ❌ There's a schema mismatch

## 🚀 Quick Fix (3 Steps)

### Step 1: Run the Fix Script in Supabase

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project → **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `FIX_DATABASE_500_ERROR.sql`
5. Click **Run** (or press Ctrl+Enter)

This script will:

- ✅ Create the `user_role` enum if missing
- ✅ Create the `user_profiles` table if missing
- ✅ Set up all RLS policies
- ✅ Create necessary triggers
- ✅ Create helper functions
- ✅ Create profiles for any existing users
- ✅ Show you a summary of your database state

### Step 2: Promote Yourself to Admin

After running the fix script, you'll see your user ID in the output. To promote yourself to admin:

```sql
-- Replace with your actual user ID from the output
SELECT public.promote_to_admin('2be26f96-d62c-4f97-ba85-9bc1ab15939a');
```

### Step 3: Refresh Your Application

1. Go back to your application
2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
3. If still logged in, log out and log back in
4. Check the console - you should see no more errors

## 🔍 Verify the Fix

After running the script, check the console output. You should see:

```
✅ DATABASE SETUP COMPLETE
Auth Users: 1
User Profiles: 1
Admin Users: 1
✅ All users have profiles
```

If you see any warnings, follow the instructions provided.

## 📊 What the Fix Script Does

### Creates Database Objects

- `user_role` enum type ('user', 'admin')
- `user_profiles` table with all required columns
- Indexes for performance
- RLS (Row Level Security) policies

### Sets Up Automation

- Trigger to auto-create profiles when users sign up
- Trigger to update `updated_at` timestamp
- Helper functions for admin checks

### Migrates Existing Data

- Creates profiles for any users that don't have them
- Uses email and metadata from `auth.users`

## 🐛 Still Having Issues?

### Check Your Environment Variables

Make sure these are set correctly in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Check Supabase Connection

Run this in the SQL Editor:

```sql
-- This should return your current user info
SELECT
    auth.uid() as current_user_id,
    auth.jwt() ->> 'email' as current_user_email;
```

If this returns NULL, you're not authenticated in the Supabase dashboard.

### Manually Check the Table

```sql
-- Check if table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_profiles';

-- Check if enum exists
SELECT typname
FROM pg_type
WHERE typname = 'user_role';

-- List all profiles
SELECT * FROM public.user_profiles;
```

### Check RLS Policies

```sql
-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';
```

You should see 5 policies:

1. Users can view own profile
2. Users can update own profile
3. Admins can view all profiles
4. Admins can update all profiles
5. Service can insert profiles

## 🔄 Alternative: Reset Everything

If you want to start completely fresh:

```sql
-- ⚠️ WARNING: This will delete all user profiles!
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Then run the FIX_DATABASE_500_ERROR.sql script
```

## 📝 Understanding the Error

The 500 error happens when:

- PostgreSQL encounters an error executing the query
- The table/enum doesn't exist
- There's a type mismatch
- A constraint is violated at the database level

Unlike 401/403 (permission errors) or 404 (not found), a 500 error indicates something is fundamentally wrong with the database schema.

## ✅ Success Checklist

After applying the fix, verify:

- [ ] No 500 errors in browser console
- [ ] You can see your name/email in the signin button
- [ ] Profile loads without retries
- [ ] You can access the admin panel (if you promoted yourself)
- [ ] New user signups automatically create profiles

## 🆘 Need More Help?

If you're still seeing errors, check the browser console for the detailed error object:

```javascript
// Look for this in the console:
Get user profile error: {
  code: "...",
  message: "...",
  details: "...",
  hint: "..."
}
```

Copy the entire error object and investigate the `message` and `hint` fields.

---

## 📚 Related Files

- `FIX_DATABASE_500_ERROR.sql` - The fix script (run this first!)
- `diagnose-user-profiles.sql` - Diagnostic queries
- `USER_PROFILE_ERROR_FIX.md` - General troubleshooting guide
- `supabase/migrations/20251021000000_create_user_profiles_and_rbac.sql` - Original migration

---

**Remember:** Always run the fix script in your Supabase SQL Editor, not in your application code!
