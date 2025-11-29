# Database Schema Migration: full_name → username

## Overview
This migration consolidates the user identifier system by:
1. **Dropping** the separate `username` column 
2. **Renaming** `full_name` to `username`
3. Making `username` the primary user identifier and referral code

## Migration Details

### Database Changes
**File**: `supabase/migrations/20251129000003_rename_fullname_to_username.sql`

#### Schema Changes:
- Dropped existing `username` column from `user_profiles`
- Renamed `full_name` column to `username`
- Made `username` NOT NULL with UNIQUE constraint
- Added index: `idx_user_profiles_username`

#### Function Updates:
1. **`generate_username_from_text(p_text TEXT)`**
   - Converts any text to a valid username
   - Handles collisions with auto-incrementing suffix
   - Limits to 30 characters

2. **`auto_generate_username()`** (Trigger Function)
   - Auto-generates username from email if not provided
   - Runs BEFORE INSERT on `user_profiles`
   - Sets `display_name` to username if not provided

3. **`validate_username(p_username TEXT)`**
   - Validates format: 3-30 characters, alphanumeric + underscores
   - Pattern: `^[a-zA-Z0-9_]{3,30}$`

4. **`set_username(p_user_id UUID, p_username TEXT)`**
   - Allows admins to change usernames
   - Regular users cannot change after initial creation

5. **Referral Functions** (Updated to use username):
   - `get_user_referral_code()` - Returns username as referral code
   - `apply_referral_code(p_referral_code VARCHAR)` - Accepts username as code
   - `get_referral_stats()` - Returns stats with username as code

### Frontend Changes

#### Type Definitions:
- **`types/supabase.ts`**: Updated all type definitions
  - `user_profiles.Row.username: string` (was `full_name: string | null`)
  - Made username required in Insert/Update types

- **`types/index.ts`**: Updated UserProfile interface
  - `username: string` (primary identifier)
  - Removed `full_name` field

#### Service Layer:
- **`authService.ts`**:
  - Updated `UserProfile` interface
  - Changed `SignUpData.fullName` → `SignUpData.username`
  - Updated signup metadata to pass `username` instead of `full_name`

#### Components Updated:
1. **`app/signup/page.tsx`**
   - Form field: `fullName` → `username`
   - Label: "Full Name" → "Username"
   - Placeholder: "Enter your full name" → "Enter your username"
   - Validation: "Full name is required" → "Username is required"

2. **`app/profile/page.tsx`**
   - Display: `profile.full_name` → `profile.username`

3. **`components/admin/AdminHeader.tsx`**
   - User display: `profile?.full_name` → `profile?.username`
   - Avatar initial: Uses username

4. **`components/admin/ProfileEditor.tsx`**
   - Removed `fullName` state variable
   - Field label: "Full Name" → "Username"
   - Update function uses `username` field

5. **`components/admin/UsersManagement.tsx`**
   - Search filter: Uses `username` instead of `full_name`
   - User display: Shows `username` in all locations
   - Avatars: Use username for initials

6. **`components/SigninButton.tsx`**
   - Display name: `profile.full_name` → `profile.username`

#### Tests:
- **`tests/authService.test.ts`**
  - Mock data: `full_name` → `username`
  - Test value: "Test User" → "test_user"

## How It Works Now

### User Registration Flow:
1. User enters username in signup form
2. Backend receives username value
3. Trigger `auto_generate_username()` processes it:
   - If username provided: validates and ensures uniqueness
   - If not provided: generates from email (e.g., "john@example.com" → "john")
   - If collision: appends counter (e.g., "john_1", "john_2")
4. Username is stored and used as referral code

### Referral System:
- **Referral Code**: User's username (e.g., "john_doe")
- **Sharing**: Users share their username as referral code
- **Applying**: New users enter existing username during signup
- **Tracking**: `user_referrals` table tracks referrer-referred relationships

### Display Names:
- **username**: Permanent identifier, used for referrals, admin-only changes
- **display_name**: Optional friendly name, user-changeable (24hr cooldown)
- **UI Display**: Shows `display_name` if set, otherwise `username`

## Migration Steps

### 1. Apply Database Migration
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/20251129000003_rename_fullname_to_username.sql
```

**⚠️ IMPORTANT**: This migration will:
- Drop the existing `username` column (data loss if it had different values than full_name)
- Rename `full_name` to `username`
- Make username required (NOT NULL)

### 2. Data Considerations
- Existing `full_name` values will become usernames
- May need cleanup if names have special characters or spaces
- Run validation query first:
```sql
SELECT full_name, 
       REGEXP_REPLACE(LOWER(full_name), '[^a-zA-Z0-9_]', '_', 'g') as new_username
FROM user_profiles
WHERE full_name IS NULL 
   OR LENGTH(full_name) < 3 
   OR LENGTH(full_name) > 30
   OR full_name !~ '^[a-zA-Z0-9_]+$';
```

### 3. Frontend Deployment
All frontend changes are already committed. Deploy in sync with database migration.

## Testing Checklist

### Database:
- [ ] Migration runs without errors
- [ ] All existing users have valid usernames
- [ ] No duplicate usernames exist
- [ ] Referral functions return correct username

### Frontend:
- [ ] Signup form accepts username input
- [ ] Profile page displays username correctly
- [ ] Admin panel shows usernames instead of full names
- [ ] User search works with username
- [ ] Referral code displays username

### Referral System:
- [ ] Get referral code returns username
- [ ] Apply referral code accepts username
- [ ] Referral stats show correct username
- [ ] Referral link contains username

## Rollback Plan

If issues occur, rollback migration:
```sql
-- Rename username back to full_name
ALTER TABLE public.user_profiles RENAME COLUMN username TO full_name;

-- Recreate separate username column
ALTER TABLE public.user_profiles 
ADD COLUMN username TEXT UNIQUE;

-- Restore original functions and triggers
-- (Copy from previous migration files)
```

## Notes

- **Breaking Change**: This is a significant schema change
- **Coordination**: Requires database and frontend deployment in sync
- **User Impact**: Existing users will see their names as usernames
- **Data Quality**: May need manual cleanup of problematic usernames
- **Testing**: Thoroughly test in staging before production

## Files Modified

### Database:
- `supabase/migrations/20251129000003_rename_fullname_to_username.sql` (NEW)
- `supabase/migrations/20251129000002_add_referral_system.sql` (DELETED)
- `supabase/migrations/20251129000001_create_user_bookmarks.sql` (unchanged)

### Frontend:
- `frontend/types/supabase.ts`
- `frontend/types/index.ts`
- `frontend/services/authService.ts`
- `frontend/app/signup/page.tsx`
- `frontend/app/profile/page.tsx`
- `frontend/components/admin/AdminHeader.tsx`
- `frontend/components/admin/ProfileEditor.tsx`
- `frontend/components/admin/UsersManagement.tsx`
- `frontend/components/SigninButton.tsx`
- `frontend/tests/authService.test.ts`
