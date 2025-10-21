# 🎯 Quick Start: Apply Your Authentication Migration

## The Fastest Way (3 Steps)

### 1️⃣ Navigate to your project

```powershell
cd d:\TravelHosta\Website
```

### 2️⃣ Link to your Supabase project (first time only)

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

> **Find YOUR_PROJECT_REF**:
> Supabase Dashboard → Settings → General → Reference ID

### 3️⃣ Push the migration

```powershell
supabase db push
```

✅ **Done!** Your database now has:

- `user_profiles` table
- Role-based access (admin/user)
- RLS security policies
- Auto-profile creation
- Admin promotion functions

---

## Alternative: Use Supabase Dashboard (No CLI)

1. Open your migration file:

   ```
   d:\TravelHosta\Website\supabase\migrations\20251021000000_create_user_profiles_and_rbac.sql
   ```

2. Copy all the SQL

3. Go to **Supabase Dashboard** → **SQL Editor**

4. Paste and click **Run**

✅ Same result!

---

## After Migration: Create First Admin

```sql
-- 1. Sign up a user via your app first
-- 2. Then run this in SQL Editor:

SELECT public.promote_to_admin('user-uuid-from-auth-users-table');
```

---

## If You Get Errors

**"Not logged in"**

```powershell
supabase login
```

**"Project not linked"**

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

**"Command not found"**

```powershell
# Install Supabase CLI
npm install -g supabase
```

---

## Check Migration Worked

**Via Dashboard:**

- Table Editor → Look for `user_profiles` table

**Via SQL:**

```sql
SELECT * FROM user_profiles;
```

---

Need detailed help? Check `HOW_TO_USE_SUPABASE_DB_PUSH.md`
