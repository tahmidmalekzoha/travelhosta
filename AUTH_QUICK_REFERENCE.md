# 🚀 Quick Reference: Enhanced Authentication

## The 3-Step Validation

```
┌─────────────────────────────────────────┐
│  1️⃣  Check Cookies for Session         │
│      ↓                                  │
│  2️⃣  Verify Profile in Database        │
│      ↓                                  │
│  3️⃣  Validate Role (user/admin)        │
│      ↓                                  │
│  ✅  Login Successful!                  │
└─────────────────────────────────────────┘
```

---

## What Happens During Login

| Step | Action                 | On Success | On Failure       |
| ---- | ---------------------- | ---------- | ---------------- |
| 1    | Check credentials      | Continue → | Show error       |
| 2    | Check database profile | Continue → | Sign out + error |
| 3    | Validate role          | Login ✅   | Sign out + error |

---

## Console Messages

### ✅ Success

```
🔐 Initializing authentication...
📝 Session found in cookies for user: user@example.com
✅ Authentication validated: user@example.com (user)
```

### ❌ No Profile

```
📝 Session found in cookies for user: user@example.com
❌ User profile not found in database. Logging out...
```

### ❌ Invalid Role

```
📝 Session found in cookies for user: user@example.com
❌ Invalid user role. Logging out...
```

---

## Quick Commands

### Check if user has profile:

```sql
SELECT * FROM user_profiles WHERE email = 'user@example.com';
```

### Create missing profiles:

```sql
-- Run the fix script
-- See: FIX_DATABASE_500_ERROR.sql
```

### Promote to admin:

```sql
SELECT public.promote_to_admin('user-id-here');
```

### Check all users:

```sql
SELECT u.email, p.role,
  CASE WHEN p.id IS NULL THEN '❌ NO PROFILE'
       ELSE '✅ HAS PROFILE' END as status
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id;
```

---

## Files Modified

- `frontend/services/authService.ts` - Validation logic
- `frontend/contexts/AuthContext.tsx` - Session checking

---

## New Function Available

```typescript
// Validate current session
const validation = await authService.validateSession();

if (validation.isValid) {
  // User is authenticated
  const { user, profile, session } = validation;
} else {
  // Not authenticated
  console.log(validation.reason);
}
```

---

## Error Messages

| Message                                    | Meaning             | Fix                 |
| ------------------------------------------ | ------------------- | ------------------- |
| "Account not properly set up"              | No database profile | Run fix script      |
| "Account does not have proper permissions" | Invalid role        | Check database role |
| "Invalid email or password"                | Wrong credentials   | Check credentials   |

---

## Test Checklist

- [ ] Normal user can log in
- [ ] Admin user can log in
- [ ] User without profile is rejected
- [ ] Page refresh keeps user logged in
- [ ] Invalid role triggers sign-out
- [ ] Console shows detailed logs

---

## 🆘 Quick Fixes

**User can't log in?**
→ Check if profile exists in database

**User gets signed out immediately?**
→ Check console for error, verify role is `user` or `admin`

**500 database error?**
→ Run `FIX_DATABASE_500_ERROR.sql`

---

**That's it! Your authentication now validates against both cookies AND the database!** ✅
