# 🚀 Supabase Email Auth - Quick Reference

## Setup (2 minutes)

### 1. Environment Variables

```bash
# Create .env.local in frontend folder
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### 2. Supabase Dashboard

```
Authentication → Settings
  ↓
✅ Enable Email provider
✅ Set Confirm email (OFF for dev, ON for prod)
✅ Site URL: http://localhost:3000
✅ Redirect URL: http://localhost:3000/auth/callback
```

---

## How to Use

### Sign Up

```typescript
await authService.signUp({
  email: "user@example.com",
  password: "password123",
  fullName: "John Doe",
  dateOfBirth: "1990-01-01",
});
```

### Sign In

```typescript
await authService.signIn({
  email: "user@example.com",
  password: "password123",
});
```

### Sign Out

```typescript
await authService.signOut();
```

### Get Current User

```typescript
const session = await authService.getCurrentSession();
const profile = await authService.getUserProfile(session.user.id);
```

---

## Authentication Flow

```
Sign Up:  Form → Supabase → Email (optional) → Profile Created → Success
Sign In:  Credentials → Supabase → Validate DB → Validate Role → Success
Session:  Cookie → Auto-refresh → Validate DB → Stay Logged In
```

---

## Features Enabled

✅ Email + password authentication  
✅ JWT session management  
✅ Auto token refresh  
✅ Session persistence  
✅ PKCE security flow  
✅ Database validation  
✅ Role-based access  
✅ Email confirmation (optional)

---

## Testing

```bash
# 1. Sign up new user at /signup
# 2. Check console for: ✅ Account created successfully
# 3. Sign in at /signin
# 4. Check console for: ✅ User logged in successfully
# 5. Refresh page - should stay logged in
```

---

## Troubleshooting

| Issue                   | Fix                                |
| ----------------------- | ---------------------------------- |
| "Missing env variables" | Create `.env.local`                |
| "Invalid credentials"   | Check email/password               |
| "Account not set up"    | Run database fix script            |
| No email received       | Check spam or disable confirmation |
| Session not persisting  | Enable localStorage in browser     |

---

## Configuration

### Development

```
Confirm email: OFF
Site URL: http://localhost:3000
```

### Production

```
Confirm email: ON
Site URL: https://yourdomain.com
Custom SMTP: Configure
Strong passwords: Enable
```

---

## Files Modified

- ✅ `frontend/app/signup/page.tsx` - Now uses real Supabase auth
- ✅ `frontend/utils/supabase.ts` - Enhanced configuration
- ✅ `frontend/.env.example` - Environment template

---

## Documentation

- `SUPABASE_EMAIL_AUTH_GUIDE.md` - Complete guide
- `SUPABASE_EMAIL_AUTH_SUMMARY.md` - Implementation details
- `AUTH_QUICK_REFERENCE.md` - Auth flow reference

---

**Ready to use! Just add environment variables and test.** ✅
