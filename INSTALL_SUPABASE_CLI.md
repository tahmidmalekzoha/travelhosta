# ⚡ Install Supabase CLI - Choose Your Method

## Method 1: NPM (Recommended - Easiest)

```powershell
npm install -g supabase
```

**Verify installation:**

```powershell
supabase --version
```

---

## Method 2: Scoop (Windows Package Manager)

### Install Scoop first (if not installed):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### Then install Supabase:

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

## Method 3: Manual Download

1. Download from: https://github.com/supabase/cli/releases
2. Choose `supabase_windows_amd64.exe`
3. Rename to `supabase.exe`
4. Add to your PATH or move to a folder in PATH

---

## After Installation: Complete Setup

### Step 1: Login

```powershell
supabase login
```

_Opens browser for authentication_

### Step 2: Go to your project

```powershell
cd d:\TravelHosta\Website
```

### Step 3: Link your Supabase project

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

**Find your Project Reference ID:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → General
4. Copy "Reference ID"

### Step 4: Push your migration

```powershell
supabase db push
```

✅ **Done!** Your authentication database is set up.

---

## Alternative: No CLI Required (Use Dashboard)

Don't want to install CLI? You can apply the migration manually:

### Step 1: Open your migration file

```
d:\TravelHosta\Website\supabase\migrations\20251021000000_create_user_profiles_and_rbac.sql
```

### Step 2: Copy the entire SQL content

### Step 3: Go to Supabase Dashboard

1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)

### Step 4: Paste and Run

1. Paste the SQL into the editor
2. Click **RUN** (or press Ctrl+Enter)
3. Wait for "Success" message

✅ **Done!** Same result without CLI.

---

## Verify Migration Worked

### Check in Dashboard:

- Go to **Table Editor**
- You should see `user_profiles` table

### Check via SQL:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_profiles';
```

---

## Recommended: Install via NPM

**Fastest and easiest method:**

```powershell
# Open PowerShell as Administrator
npm install -g supabase

# Verify
supabase --version

# You're ready!
```

---

## Next Steps After Installation

1. ✅ Apply the migration (see QUICK_START_DB_MIGRATION.md)
2. ✅ Configure Supabase Auth settings
3. ✅ Create your first admin user
4. ✅ Test signup/signin in your app

---

**Choose the method that works best for you!**

- **Fastest**: NPM installation
- **No CLI needed**: Manual SQL in Dashboard
- **Long-term**: Scoop (keeps CLI updated automatically)
