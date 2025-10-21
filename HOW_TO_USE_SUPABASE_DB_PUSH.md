# 🚀 How to Use Supabase DB Push

## Overview

`supabase db push` applies your local migration files to your remote Supabase database. This is how you'll apply the authentication migration we created.

---

## Prerequisites

### 1. Install Supabase CLI (if not already installed)

**Windows (PowerShell):**

```powershell
# Using Scoop
scoop install supabase

# OR using npm
npm install -g supabase
```

**Verify installation:**

```powershell
supabase --version
```

### 2. Check Your Migration Files

Your migration is located at:

```
d:\TravelHosta\Website\supabase\migrations\20251021000000_create_user_profiles_and_rbac.sql
```

This creates:

- ✅ `user_profiles` table
- ✅ Role-based access control (admin/user)
- ✅ RLS policies
- ✅ Auto-profile creation triggers
- ✅ Admin promotion functions

---

## Method 1: Push to Remote Supabase Project (Recommended for Production)

### Step 1: Link Your Project

```powershell
cd d:\TravelHosta\Website

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your PROJECT_REF:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > General
4. Copy the "Reference ID"

### Step 2: Push Your Migrations

```powershell
# Push all pending migrations to remote database
supabase db push
```

**What happens:**

- ✅ Connects to your remote Supabase project
- ✅ Checks which migrations haven't been applied
- ✅ Applies the new migration
- ✅ Updates migration history

### Step 3: Verify Migration

```powershell
# Check migration status
supabase migration list
```

You should see your migration marked as applied.

---

## Method 2: Local Development with Supabase Local

### Step 1: Start Local Supabase

```powershell
cd d:\TravelHosta\Website

# Start local Supabase (includes database, auth, storage, etc.)
supabase start
```

**This will:**

- ✅ Start local PostgreSQL database
- ✅ Apply all migrations automatically
- ✅ Start Studio at http://localhost:54323
- ✅ Start API at http://localhost:54321

### Step 2: View Local Database

Access Supabase Studio:

```
http://localhost:54323
```

Default credentials:

- **Email**: No login needed for local
- **Direct access**: Just open the URL

### Step 3: Reset Database (if needed)

```powershell
# Reset database and reapply all migrations
supabase db reset
```

---

## Method 3: Generate SQL from Migration (Manual Application)

If you prefer to apply SQL manually:

### Step 1: View the Migration SQL

```powershell
# View the migration content
Get-Content "d:\TravelHosta\Website\supabase\migrations\20251021000000_create_user_profiles_and_rbac.sql"
```

### Step 2: Apply via Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the migration SQL
5. Click **Run**

---

## Troubleshooting

### Error: "Not logged in"

```powershell
# Login to Supabase
supabase login
```

This will open a browser for authentication.

### Error: "Project not linked"

```powershell
# Re-link your project
supabase link --project-ref YOUR_PROJECT_REF
```

### Error: "Migration already applied"

This means the migration has already run. Check:

```powershell
supabase migration list
```

### Error: "Database connection failed"

Check your internet connection and Supabase project status at https://status.supabase.com

---

## After Pushing the Migration

### 1. Verify Tables Created

**Via Supabase Dashboard:**

1. Go to Table Editor
2. You should see `user_profiles` table

**Via SQL Editor:**

```sql
SELECT * FROM user_profiles LIMIT 5;
```

### 2. Create Your First Admin User

**Option A: Sign up first, then promote**

```sql
-- Get user ID from auth.users
SELECT id, email FROM auth.users;

-- Promote to admin
SELECT public.promote_to_admin('paste-user-id-here');
```

**Option B: Sign up via your app**

1. Go to http://localhost:3000/signup
2. Create account
3. Then promote via SQL

### 3. Configure Auth Settings

**In Supabase Dashboard:**

1. Go to Authentication > Settings
2. **Site URL**: Set to `http://localhost:3000` (dev) or your production URL
3. **Redirect URLs**: Add your URLs
4. **Email Confirmations**:
   - ✅ Enable for production
   - ❌ Disable for development (easier testing)

### 4. Test Authentication

1. Try signing up: http://localhost:3000/signup
2. Try signing in: http://localhost:3000/signin
3. Check user profile was created automatically
4. Test admin access (if promoted)

---

## Quick Reference Commands

```powershell
# Login to Supabase
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to remote
supabase db push

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset local database
supabase db reset

# Check migration status
supabase migration list

# Generate new migration
supabase migration new migration_name

# View local credentials
supabase status
```

---

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**To find these:**

1. Supabase Dashboard
2. Settings > API
3. Copy URL and anon/public key

---

## Recommended Workflow

### For Development:

```powershell
# 1. Start local Supabase
supabase start

# 2. Develop and test locally
# Your migrations auto-apply on start

# 3. When ready, push to remote
supabase db push
```

### For Production:

```powershell
# 1. Link to production project
supabase link --project-ref PROD_PROJECT_REF

# 2. Push migrations
supabase db push

# 3. Verify in dashboard
# Check tables and test auth
```

---

## What Happens When You Run `supabase db push`?

1. **Connection**: CLI connects to your remote database
2. **Check**: Compares local migrations with applied migrations
3. **Calculate**: Determines which migrations need to run
4. **Execute**: Runs pending migrations in order
5. **Record**: Updates migration history table
6. **Confirm**: Shows success message

**Example Output:**

```
Applying migration 20251021000000_create_user_profiles_and_rbac.sql...
Applying migration 20251021000000_create_user_profiles_and_rbac.sql... Done
Finished supabase db push.
```

---

## Next Steps After Migration

1. ✅ **Test signup/signin flows**
2. ✅ **Create first admin user**
3. ✅ **Update signup page** (use authService)
4. ✅ **Create middleware** (protect routes)
5. ✅ **Update admin layout** (verify roles)
6. ✅ **Test RLS policies** (ensure security)

---

## Summary

**Simplest approach for you:**

```powershell
# Navigate to project
cd d:\TravelHosta\Website

# If not logged in
supabase login

# Link your project (one time only)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push

# Done! ✅
```

That's it! Your authentication system will be set up in the database.

---

**Need Help?**

- Supabase CLI Docs: https://supabase.com/docs/guides/cli
- Migration Guide: https://supabase.com/docs/guides/cli/local-development#database-migrations
- Discord Support: https://discord.supabase.com
