# 📧 Supabase Email Authentication Setup Guide

## Overview

Your application now uses **Supabase Email Authentication** for secure user login and registration. This guide explains how the system works and how to configure it.

---

## 🔐 How Email Authentication Works

### **Sign Up Flow**

```
1. User fills registration form
   ↓
2. Supabase Auth creates user account
   ↓
3. Email confirmation sent (optional)
   ↓
4. Trigger creates user_profiles entry
   ↓
5. User can sign in
```

### **Sign In Flow**

```
1. User enters email & password
   ↓
2. Supabase validates credentials
   ↓
3. Session created with JWT token
   ↓
4. Verify user_profiles entry exists
   ↓
5. Validate role (user/admin)
   ↓
6. Login successful ✅
```

---

## ⚙️ Supabase Client Configuration

### **Enhanced Configuration**

The Supabase client is configured with optimal settings:

```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,

    // Persist session in local storage
    persistSession: true,

    // Detect session from URL for email confirmation links
    detectSessionInUrl: true,

    // Storage key for session
    storageKey: "travelhosta-auth",

    // Use PKCE flow for better security
    flowType: "pkce",
  },
});
```

### **What Each Setting Does:**

| Setting              | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| `autoRefreshToken`   | Automatically refreshes JWT tokens before expiry              |
| `persistSession`     | Saves session to browser localStorage                         |
| `detectSessionInUrl` | Handles email confirmation/password reset links               |
| `storageKey`         | Custom key for storing session data                           |
| `flowType: 'pkce'`   | Uses PKCE (Proof Key for Code Exchange) for enhanced security |

---

## 🚀 Setup Instructions

### **Step 1: Configure Environment Variables**

1. **Copy the example file:**

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Get your Supabase credentials:**

   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **Settings → API**
   - Copy the **Project URL**
   - Copy the **anon public** key

3. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### **Step 2: Configure Email Settings in Supabase**

1. **Go to Authentication Settings:**

   - Dashboard → Authentication → Settings

2. **Email Auth Configuration:**

   - ✅ Enable Email provider
   - ✅ Confirm email: ON (recommended) or OFF (for development)
   - Set email templates (optional)

3. **Site URL Configuration:**

   - Add your site URLs:
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`

4. **Redirect URLs:**
   - Add allowed redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`

### **Step 3: Set Up Email Templates (Optional)**

Customize email templates in **Authentication → Email Templates**:

- **Confirmation Email** - Sent when user signs up
- **Magic Link** - For passwordless login
- **Reset Password** - Password recovery
- **Change Email** - Email address change confirmation

---

## 📝 Implementation Details

### **Sign Up Function (`authService.signUp`)**

```typescript
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  // 1. Create auth user with Supabase
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
        date_of_birth: dateOfBirth || null,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  // 2. Trigger automatically creates user_profiles entry
  // 3. Return success with user data
  return { success: true, user, session, profile };
};
```

**What happens:**

1. Creates user in `auth.users` table
2. Sends confirmation email (if enabled)
3. Database trigger creates entry in `user_profiles`
4. User metadata (name, DOB) stored in user profile

### **Sign In Function (`authService.signIn`)**

```typescript
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  // 1. Authenticate with Supabase
  const { data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 2. Verify profile exists in database
  const profile = await getUserProfile(authData.user.id);
  if (!profile) {
    await supabase.auth.signOut();
    return { success: false, error: "Profile not found" };
  }

  // 3. Validate role
  if (profile.role !== "user" && profile.role !== "admin") {
    await supabase.auth.signOut();
    return { success: false, error: "Invalid role" };
  }

  // 4. Success
  return { success: true, user, session, profile };
};
```

**What happens:**

1. Validates email + password with Supabase Auth
2. Creates JWT session token
3. Verifies user has profile in database
4. Validates role is `user` or `admin`
5. Returns authenticated session

---

## 🔒 Security Features

### **1. Password Requirements**

- Minimum 6 characters (configurable in Supabase)
- Can add complexity requirements in Supabase settings

### **2. JWT Tokens**

- Secure, signed JSON Web Tokens
- Automatically refreshed before expiry
- Stored in browser localStorage
- Encrypted in transit (HTTPS)

### **3. PKCE Flow**

- Proof Key for Code Exchange
- Prevents authorization code interception
- Enhanced security for public clients

### **4. Email Confirmation**

- Optional email verification
- Prevents fake email signups
- Can be enabled/disabled per environment

### **5. Rate Limiting**

- Built-in rate limiting in Supabase
- Prevents brute force attacks
- Configurable in Supabase dashboard

---

## 🎯 User Experience

### **Sign Up Experience**

**With Email Confirmation (Production):**

```
1. User fills signup form
2. "Check your email for confirmation"
3. User clicks link in email
4. Account activated
5. User can sign in
```

**Without Email Confirmation (Development):**

```
1. User fills signup form
2. "Account created successfully"
3. Redirected to sign in
4. User can sign in immediately
```

### **Sign In Experience**

```
1. User enters email + password
2. "Signing in..."
3. Session validated
4. Profile loaded
5. Redirected to dashboard (or admin panel)
```

### **Remember Me**

The "Remember password" checkbox on sign in controls:

- Session persistence duration
- Auto-logout behavior
- (Can be customized to extend/shorten session lifetime)

---

## 🧪 Testing

### **Test Sign Up**

1. Fill in the signup form
2. Use a real email (if confirmation enabled)
3. Check for confirmation email
4. Verify profile created in database:
   ```sql
   SELECT * FROM user_profiles WHERE email = 'test@example.com';
   ```

### **Test Sign In**

1. Use registered email + password
2. Check console for authentication logs:
   ```
   ✅ User logged in successfully: user@example.com (user)
   ```
3. Verify session persists on page refresh

### **Test Email Confirmation**

1. Sign up with new account
2. Check email inbox
3. Click confirmation link
4. Should redirect to your app
5. Can now sign in

---

## 🛠️ Development vs Production

### **Development Mode**

Recommended settings:

- ❌ Disable email confirmation (faster testing)
- ✅ Use localhost URLs
- ✅ Enable detailed logging
- ✅ Use test email addresses

### **Production Mode**

Recommended settings:

- ✅ Enable email confirmation
- ✅ Use production domain
- ✅ Configure custom email templates
- ✅ Enable rate limiting
- ✅ Set up email quotas

---

## 📊 Email Providers

Supabase supports multiple email providers:

### **Default (Supabase SMTP)**

- Free tier: 30 emails/hour
- Good for development
- Limited for production

### **Custom SMTP**

Configure your own email service:

- SendGrid
- AWS SES
- Mailgun
- Postmark
- Any SMTP provider

**Setup:** Dashboard → Settings → Auth → SMTP Settings

---

## 🔧 Common Configurations

### **Disable Email Confirmation (Development)**

```
Dashboard → Authentication → Settings
↓
Email Auth
↓
Confirm email: OFF
```

### **Enable Email Confirmation (Production)**

```
Dashboard → Authentication → Settings
↓
Email Auth
↓
Confirm email: ON
↓
Redirect users to: /auth/callback
```

### **Customize Password Requirements**

```
Dashboard → Authentication → Settings
↓
Password
↓
Minimum characters: 8
Strong password: ON (recommended)
```

### **Set Session Timeout**

```
Dashboard → Authentication → Settings
↓
JWT Settings
↓
JWT expiry: 3600 (1 hour)
Refresh token expiry: 604800 (7 days)
```

---

## 📧 Email Templates

### **Variables Available:**

All email templates support these variables:

- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .Token }}` - Confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email

### **Example Custom Template:**

```html
<h2>Welcome to TravelHosta!</h2>
<p>Thanks for signing up. Please confirm your email:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
```

---

## 🐛 Troubleshooting

### **"Invalid login credentials"**

**Cause:** Wrong email or password  
**Fix:** Check credentials, ensure user is registered

### **"Email not confirmed"**

**Cause:** Email confirmation required but not completed  
**Fix:** Check email inbox, resend confirmation

### **"User already registered"**

**Cause:** Email already in use  
**Fix:** Use different email or sign in

### **No confirmation email received**

**Causes:**

- Email in spam folder
- SMTP not configured
- Email quota exceeded
- Invalid email address

**Fixes:**

- Check spam folder
- Configure custom SMTP
- Disable confirmation for testing
- Verify email is valid

### **Session expires immediately**

**Causes:**

- JWT expiry too short
- Token refresh disabled
- Browser blocking localStorage

**Fixes:**

- Increase JWT expiry in settings
- Verify `autoRefreshToken: true`
- Check browser storage permissions

---

## 📚 API Reference

### **Sign Up**

```typescript
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
  options: {
    data: {
      full_name: "John Doe",
      date_of_birth: "1990-01-01",
    },
    emailRedirectTo: "http://localhost:3000/auth/callback",
  },
});
```

### **Sign In**

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});
```

### **Sign Out**

```typescript
const { error } = await supabase.auth.signOut();
```

### **Get Current User**

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();
```

### **Get Session**

```typescript
const {
  data: { session },
} = await supabase.auth.getSession();
```

### **Reset Password**

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(
  "user@example.com",
  {
    redirectTo: "http://localhost:3000/auth/reset-password",
  }
);
```

---

## ✅ Checklist

Before going live, ensure:

- [ ] Environment variables configured (`.env.local`)
- [ ] Email confirmation enabled (production)
- [ ] Custom SMTP configured (production)
- [ ] Site URL configured in Supabase
- [ ] Redirect URLs whitelisted
- [ ] Email templates customized
- [ ] Password requirements set
- [ ] JWT expiry configured
- [ ] Rate limiting enabled
- [ ] Database migration run (`user_profiles` table exists)
- [ ] RLS policies enabled
- [ ] Test signup flow works
- [ ] Test signin flow works
- [ ] Test email confirmation works
- [ ] Test password reset works

---

## 🎓 Best Practices

1. **Always use HTTPS in production**

   - Protects JWT tokens in transit
   - Prevents session hijacking

2. **Enable email confirmation in production**

   - Prevents fake signups
   - Verifies email ownership

3. **Use strong password requirements**

   - Minimum 8 characters
   - Include numbers, symbols
   - Enable in Supabase settings

4. **Configure custom SMTP for production**

   - Better deliverability
   - Higher email quotas
   - Custom branding

5. **Monitor authentication events**

   - Check Supabase logs
   - Track failed login attempts
   - Monitor signup patterns

6. **Keep JWT expiry reasonable**

   - Not too short (bad UX)
   - Not too long (security risk)
   - 1 hour is typical

7. **Test thoroughly before launch**
   - Test all auth flows
   - Test on multiple browsers
   - Test email delivery
   - Test error handling

---

## 📖 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Authentication Guide](https://supabase.com/docs/guides/auth/auth-email)
- [JWT Tokens Explained](https://supabase.com/docs/guides/auth/sessions)
- [Custom SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp)

---

## 🎉 Summary

Your application now uses **Supabase Email Authentication**:

✅ **Secure password-based login**  
✅ **JWT session management**  
✅ **Email confirmation (configurable)**  
✅ **Automatic token refresh**  
✅ **Session persistence**  
✅ **PKCE security flow**  
✅ **Database profile integration**  
✅ **Role-based access control**

**Ready to go! Just configure your environment variables and test!** 🚀
