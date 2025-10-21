# 500 Error Quick Fix Checklist

## ⚡ Do This Right Now

### 1️⃣ Open Supabase SQL Editor

- Go to: https://supabase.com/dashboard
- Select your project
- Click **SQL Editor** in the left sidebar
- Click **New Query**

### 2️⃣ Run the Fix Script

- Open: `FIX_DATABASE_500_ERROR.sql`
- Copy ALL the contents
- Paste into Supabase SQL Editor
- Click **RUN** or press `Ctrl+Enter`

### 3️⃣ Wait for Success Message

You should see:

```
✅ DATABASE SETUP COMPLETE
Auth Users: X
User Profiles: X
Admin Users: X
```

### 4️⃣ Promote Yourself to Admin

Copy your user ID from the table displayed, then run:

```sql
SELECT public.promote_to_admin('YOUR-USER-ID-HERE');
```

Example:

```sql
SELECT public.promote_to_admin('2be26f96-d62c-4f97-ba85-9bc1ab15939a');
```

### 5️⃣ Refresh Your App

- Go back to your application (http://localhost:3000)
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or log out and log back in

### 6️⃣ Verify It Works

Check the browser console - you should see:

- ✅ "Auth state changed: INITIAL_SESSION"
- ✅ NO more 500 errors
- ✅ Your name/email displayed in the UI
- ✅ NO "Profile not found on first attempt, retrying..." messages

---

## ❌ If Still Broken

### Check #1: Did the script run successfully?

Look at the Supabase SQL Editor output. If you see any RED errors, copy them and investigate.

### Check #2: Do you have the table now?

Run in SQL Editor:

```sql
SELECT * FROM public.user_profiles;
```

You should see at least one row (your profile).

### Check #3: Is your profile actually there?

Run in SQL Editor:

```sql
SELECT * FROM public.user_profiles
WHERE id = '2be26f96-d62c-4f97-ba85-9bc1ab15939a';
```

Replace with your actual user ID.

### Check #4: Are the policies working?

Run in SQL Editor:

```sql
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'user_profiles';
```

You should see 5 policies.

---

## 🎯 Expected Outcome

### Before Fix:

```
❌ GET /rest/v1/user_profiles?... → 500 (Internal Server Error)
❌ Get user profile error: Object
❌ Profile not found on first attempt, retrying...
❌ Failed to load user profile after retry
```

### After Fix:

```
✅ Auth state changed: INITIAL_SESSION
✅ User profile loaded successfully
✅ No errors in console
✅ Name displayed in UI
```

---

## 📞 Still Need Help?

1. Check `URGENT_FIX_500_ERROR.md` for detailed troubleshooting
2. Run `diagnose-user-profiles.sql` to see database state
3. Copy the full error object from console for debugging

---

**TIME TO FIX: ~2 minutes** ⏱️

Just run the SQL script in Supabase. That's it!
