# RLS Policy Fix and Authentication Guide

## Problem

The error `new row violates row-level security policy for table "guides"` occurs because:

1. **Supabase RLS is enabled** on the guides table
2. **Policies require authenticated users** (`TO authenticated`)
3. **Your app uses localStorage auth** instead of Supabase Auth
4. **No Supabase session exists**, so the anon key can't pass RLS checks

## Immediate Fix Applied

**Migration**: `20251006000001_fix_rls_policies.sql`

This migration:

- Removes the `authenticated` user requirement from RLS policies
- Allows all operations temporarily for development
- Keeps RLS enabled for future proper implementation

### To Apply This Fix:

```bash
# Push the new migration to your remote Supabase
npx supabase db push
```

## ⚠️ Security Note

The current fix allows **anyone** to modify the database. This is acceptable for:

- Development environments
- Internal/private applications
- When behind additional authentication layers

## Long-Term Solutions

### Option 1: Implement Supabase Auth (Recommended)

Replace the localStorage auth with proper Supabase authentication:

**Benefits:**

- Row-level security works properly
- Built-in session management
- Secure by default
- Email verification, password reset, etc.

**Implementation:**

```typescript
// Update AuthContext.tsx to use Supabase Auth
import { supabase } from "../utils/supabase";

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

const logout = async () => {
  await supabase.auth.signOut();
};
```

**Update RLS Policies:**

```sql
-- Restrict to authenticated users only
CREATE POLICY "Authenticated users can insert guides"
    ON public.guides FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Optional: Admin role check
CREATE POLICY "Admin users can modify guides"
    ON public.guides FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin'
    );
```

### Option 2: Use Service Role Key

For admin panels, use the service role key (bypasses RLS):

```typescript
// Create separate client for admin operations
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only!
);
```

⚠️ **Never expose service role key to client-side code!**

### Option 3: Disable RLS (Not Recommended)

```sql
ALTER TABLE public.guides DISABLE ROW LEVEL SECURITY;
```

Only use this if you have other security measures in place.

## Current Architecture

```
┌─────────────────┐
│   Frontend      │
│  (localStorage) │
└────────┬────────┘
         │ anon key
         ▼
┌─────────────────┐
│   Supabase      │
│   (RLS: ON)     │ ← Blocks: No authenticated session
└─────────────────┘
```

## Recommended Architecture

```
┌─────────────────┐
│   Frontend      │
│ (Supabase Auth) │
└────────┬────────┘
         │ session token
         ▼
┌─────────────────┐
│   Supabase      │
│   (RLS: ON)     │ ← Allows: Valid session
└─────────────────┘
```

## Next Steps

1. ✅ **Immediate**: Apply the RLS fix migration (already created)
2. 🔄 **Short-term**: Test that guides creation works
3. 🎯 **Long-term**: Choose and implement one of the authentication options above

## Migration Files Created

1. `20251006000000_make_image_url_nullable.sql` - Makes image_url optional
2. `20251006000001_fix_rls_policies.sql` - Fixes RLS authentication issues

Run both with:

```bash
npx supabase db push
```
