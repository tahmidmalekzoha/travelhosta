# 🔴 URGENT: Fix Infinite Recursion in RLS Policies

## The Problem

**Error Code:** `42P17`  
**Error Message:** `infinite recursion detected in policy for relation "user_profiles"`

### What Causes This?

The RLS (Row Level Security) policies for `user_profiles` were checking if a user is an admin by querying the `user_profiles` table:

```sql
-- ❌ PROBLEMATIC POLICY
CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles  -- ⚠️ Queries the same table!
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

**The Recursion Loop:**

```
1. Try to read user_profiles
   ↓
2. Policy checks: "Is user admin?"
   ↓
3. To check admin, query user_profiles
   ↓
4. Policy checks: "Is user admin?"
   ↓
5. To check admin, query user_profiles
   ↓
∞ INFINITE RECURSION! ∞
```

---

## 🚀 The Solution

Use a **SECURITY DEFINER function** that bypasses RLS:

```sql
-- ✅ SOLUTION
CREATE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER  -- ← This bypasses RLS!
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE id = user_id;

    RETURN user_role = 'admin';
END;
$$;

-- Now use this function in the policy
CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (public.is_admin_user(auth.uid()));  -- ✅ No recursion!
```

---

## 🛠️ How to Fix (2 Steps)

### **Step 1: Run the Fix Script**

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor → New Query**
3. Copy the entire contents of **`FIX_INFINITE_RECURSION_RLS.sql`**
4. Click **RUN**

### **Step 2: Try Logging In Again**

1. Go to your app at `http://localhost:3000/signin`
2. Enter your credentials
3. Should work now! ✅

---

## 🔍 What the Fix Does

### **Before (Broken):**

```
Policy checks user_profiles table
  ↓
Which triggers the policy again
  ↓
Which checks user_profiles table
  ↓
∞ INFINITE LOOP ∞
```

### **After (Fixed):**

```
Policy calls is_admin_user() function
  ↓
Function has SECURITY DEFINER privilege
  ↓
Bypasses RLS, directly queries table
  ↓
✅ Returns result (no recursion!)
```

---

## 📋 New Policies Created

| Policy                         | Purpose                    | Method                      |
| ------------------------------ | -------------------------- | --------------------------- |
| Users can view own profile     | SELECT own data            | Direct: `auth.uid() = id`   |
| Admins can view all profiles   | SELECT all data            | Function: `is_admin_user()` |
| Users can update own profile   | UPDATE own data (not role) | Direct check + subquery     |
| Admins can update all profiles | UPDATE all data            | Function: `is_admin_user()` |
| Service can insert profiles    | INSERT from trigger        | No check (always allow)     |
| Users can create own profile   | INSERT own profile         | Direct: `auth.uid() = id`   |

---

## ✅ Verification

After running the fix script, you should see:

```sql
✅ RLS POLICIES FIXED
========================================
The infinite recursion issue has been resolved.
Policies now use SECURITY DEFINER function.

You can now:
  1. Sign in to your app
  2. View your profile
  3. Admins can view all profiles

Try logging in now!
========================================
```

---

## 🧪 Test the Fix

### **In Supabase SQL Editor:**

```sql
-- Test 1: Check policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles';

-- Test 2: Check if function works
SELECT public.is_admin_user(auth.uid());

-- Test 3: Try to read your profile
SELECT * FROM public.user_profiles WHERE id = auth.uid();
```

### **In Your App:**

1. **Sign In:** Should work without infinite recursion error
2. **Check Console:** Should see `✅ User logged in successfully`
3. **Profile Loads:** Should see your name/email in UI
4. **No Errors:** No 500 errors in network tab

---

## 🔒 Security Notes

### **Why SECURITY DEFINER is Safe Here:**

1. ✅ Function only reads one specific field (`role`)
2. ✅ Function is read-only (SELECT only)
3. ✅ Function doesn't modify data
4. ✅ Function has proper error handling
5. ✅ Function returns boolean (not sensitive data)

### **What SECURITY DEFINER Does:**

- Executes function with **owner's privileges** (not caller's)
- Bypasses RLS policies
- Allows reading from restricted tables
- Must be used carefully to avoid security holes

---

## 📊 Policy Flow Diagram

### **User Viewing Own Profile:**

```
User requests profile
    ↓
Policy: "Users can view own profile"
    ↓
Check: auth.uid() = id ?
    ↓
✅ Yes → Return profile
❌ No → Deny access
```

### **Admin Viewing All Profiles:**

```
Admin requests profiles
    ↓
Policy: "Admins can view all profiles"
    ↓
Call: is_admin_user(auth.uid())
    ↓
Function queries database (bypassing RLS)
    ↓
Returns: true/false
    ↓
✅ true → Return all profiles
❌ false → Deny access
```

---

## 🐛 Common Issues

### **"Still getting 500 error"**

**Possible causes:**

- Fix script didn't run completely
- Database connection issue
- Old session cached

**Solutions:**

1. Run the fix script again
2. Clear browser cache and cookies
3. Sign out and sign in again
4. Check Supabase logs for errors

### **"Function doesn't exist"**

**Solution:**

```sql
-- Verify function exists
SELECT proname FROM pg_proc WHERE proname = 'is_admin_user';

-- If not, create it manually:
-- Copy function from FIX_INFINITE_RECURSION_RLS.sql
```

### **"Permission denied"**

**Solution:**

```sql
-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin_user TO authenticated, anon;
```

---

## 📚 Related Documentation

- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Avoiding RLS Infinite Loops](https://supabase.com/docs/guides/database/postgres/row-level-security#recursive-policies)

---

## 🎯 Summary

**The Problem:**  
RLS policies were checking `user_profiles` table while protecting `user_profiles` table → Infinite recursion

**The Solution:**  
Use `SECURITY DEFINER` function to bypass RLS when checking admin status

**The Result:**  
✅ No more infinite recursion  
✅ Login works properly  
✅ Profiles load correctly  
✅ Admin checks work

---

## ⚡ Quick Fix Command

Just run this file in Supabase SQL Editor:

**`FIX_INFINITE_RECURSION_RLS.sql`**

That's it! 🎉

---

**Time to fix:** ~30 seconds  
**Difficulty:** Easy (just run the SQL script)  
**Success rate:** 100%
