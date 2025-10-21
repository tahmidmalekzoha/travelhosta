# 🎯 Complete Guide: Using `supabase db push`

## TL;DR - Three Ways to Apply Your Migration

### ✅ Option 1: CLI Method (Best for ongoing development)

```powershell
npm install -g supabase  # Install once
supabase login           # Login once
cd d:\TravelHosta\Website
supabase link --project-ref YOUR_PROJECT_REF  # Link once
supabase db push         # Push migration
```

### ✅ Option 2: Dashboard Method (No installation needed)

1. Open migration file: `supabase/migrations/20251021000000_create_user_profiles_and_rbac.sql`
2. Copy all SQL
3. Supabase Dashboard → SQL Editor
4. Paste and click RUN

### ✅ Option 3: Local Development

```powershell
supabase start  # Starts local Supabase + applies migrations automatically
```

---

## 📚 Complete Step-by-Step Guide

### Prerequisites Check

- [ ] Node.js installed (for npm method)
- [ ] Supabase project created at https://supabase.com
- [ ] Project URL and Keys saved in `.env.local`

---

## Installation (Choose One)

### Method A: NPM (Recommended)

```powershell
npm install -g supabase
supabase --version  # Verify
```

### Method B: Scoop

```powershell
scoop install supabase
```

### Method C: No Installation

Use Dashboard SQL Editor instead (see Option 2 above)

---

## Detailed Steps

### 1. Login to Supabase (CLI Method)

```powershell
supabase login
```

**What happens:**

- Opens browser
- Login with your Supabase account
- Returns to terminal when authenticated
- Token saved for future commands

---

### 2. Navigate to Project

```powershell
cd d:\TravelHosta\Website
```

---

### 3. Link Your Project (One-time setup)

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

**Find YOUR_PROJECT_REF:**

1. Go to https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Copy the **Reference ID** (looks like: `abcdefghijklmnop`)

**Example:**

```powershell
supabase link --project-ref abcdefghijklmnop
```

**Output:**

```
Finished supabase link.
```

---

### 4. Push Your Migration

```powershell
supabase db push
```

**What happens:**

1. Connects to your remote database
2. Checks which migrations haven't been applied
3. Applies pending migrations (your auth migration)
4. Records migration in history

**Expected Output:**

```
Applying migration 20251021000000_create_user_profiles_and_rbac.sql...
Applying migration 20251021000000_create_user_profiles_and_rbac.sql... Done
Finished supabase db push.
```

✅ **Success!** Your database now has the authentication system.

---

## Verify Migration Applied

### Check via Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Table Editor** (left sidebar)
4. Look for `user_profiles` table

**You should see:**

- `user_profiles` table with columns: id, email, full_name, role, etc.

### Check via SQL Editor

```sql
-- Check table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_profiles';

-- View table structure
SELECT * FROM user_profiles LIMIT 1;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_profiles';
```

---

## Post-Migration Setup

### 1. Configure Auth Settings

**In Supabase Dashboard:**

1. Go to **Authentication** → **Settings**

2. **Site URL** (under "General"):

   ```
   http://localhost:3000
   ```

   (For production, use your domain)

3. **Redirect URLs**:

   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```

4. **Email Confirmations** (under "Email Auth"):

   - ✅ **Disable for development** (easier testing)
   - ✅ **Enable for production** (security)

5. Click **Save**

---

### 2. Create Your First Admin User

**Step A: Sign up via your app**

1. Go to http://localhost:3000/signup
2. Create an account
3. Note: You'll be a regular user first

**Step B: Promote to admin**

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query:

```sql
-- First, find your user ID
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Copy your user ID, then promote to admin
SELECT public.promote_to_admin('paste-your-user-id-here');

-- Verify
SELECT id, email, role
FROM user_profiles
WHERE role = 'admin';
```

**Alternative: Create admin directly**

```sql
-- If you know the user ID from auth.users
SELECT public.promote_to_admin('existing-user-uuid');
```

---

### 3. Test Authentication

**Test Signup:**

1. Open http://localhost:3000/signup
2. Fill in details
3. Submit form
4. Check Supabase Dashboard → Authentication → Users
5. Should see new user
6. Check Table Editor → user_profiles
7. Should see profile automatically created

**Test Signin:**

1. Open http://localhost:3000/signin
2. Use credentials from signup
3. Should redirect to home (or /admin if admin)
4. Check browser dev tools → Application → Cookies
5. Should see Supabase auth cookies

**Test Admin Access:**

1. Sign in as promoted admin user
2. Should redirect to http://localhost:3000/admin
3. Try accessing /admin as regular user
4. Should be blocked (once middleware is implemented)

---

## Troubleshooting

### Error: "Not logged in"

```powershell
supabase login
```

### Error: "Project not linked"

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

### Error: "Migration already applied"

This is OK - migration has already run. Check status:

```powershell
supabase migration list
```

### Error: "supabase command not found"

Install the CLI:

```powershell
npm install -g supabase
```

### Error: "Database connection failed"

- Check internet connection
- Verify project exists at https://supabase.com/dashboard
- Check project status at https://status.supabase.com

### Migration runs but creates errors

View detailed logs:

```powershell
supabase db push --debug
```

---

## Alternative: Manual SQL Application

If you prefer not to use CLI:

### Step 1: Open migration file

```
d:\TravelHosta\Website\supabase\migrations\20251021000000_create_user_profiles_and_rbac.sql
```

### Step 2: Copy entire contents

### Step 3: Supabase Dashboard

1. Go to **SQL Editor**
2. Paste SQL
3. Click **RUN** (or Ctrl+Enter)
4. Wait for success message

### Step 4: Verify

- Check Table Editor for `user_profiles`
- Run test queries

✅ **Same result, no CLI needed!**

---

## What the Migration Creates

Your migration file creates:

✅ **`user_profiles` table**

- Links to auth.users
- Stores role (user/admin)
- Stores profile info (name, avatar, etc.)

✅ **RLS Policies**

- Users can read their own profile
- Users can update their own profile (but not role)
- Admins can read/update all profiles

✅ **Automatic Profile Creation**

- Trigger creates profile when user signs up
- Copies email and name from auth metadata

✅ **Admin Functions**

- `is_admin(user_id)` - Check if user is admin
- `promote_to_admin(user_id)` - Promote user to admin

✅ **Updated Policies for Existing Tables**

- guides: Admin-only create/update/delete
- hero_images: Admin-only create/update/delete

---

## Quick Command Reference

```powershell
# One-time setup
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

# Check status
supabase migration list
supabase status

# Local development
supabase start    # Start local Supabase
supabase stop     # Stop local Supabase
supabase db reset # Reset and reapply migrations

# Create new migration
supabase migration new migration_name
```

---

## Next Steps

After successfully applying the migration:

1. ✅ **Test signup/signin flows**
2. ✅ **Create first admin user**
3. ✅ **Update signup page** to use authService
4. ✅ **Create middleware** to protect routes
5. ✅ **Update admin layout** to verify roles
6. ✅ **Test RLS policies** for security

---

## Summary

**Easiest path:**

1. Install: `npm install -g supabase`
2. Login: `supabase login`
3. Link: `supabase link --project-ref YOUR_REF`
4. Push: `supabase db push`
5. Verify: Check Dashboard for `user_profiles` table
6. Test: Sign up and sign in!

**That's it!** Your authentication system is now live in the database. 🎉

---

## Related Documentation

- `INSTALL_SUPABASE_CLI.md` - Detailed CLI installation
- `QUICK_START_DB_MIGRATION.md` - Quick reference
- `AUTHENTICATION_COMPLETE_GUIDE.md` - Full auth implementation guide
- `SIGNIN_PAGE_FIXED.md` - Signin page fix details

---

**Questions?**

- Supabase Docs: https://supabase.com/docs
- CLI Reference: https://supabase.com/docs/guides/cli
- Discord: https://discord.supabase.com
