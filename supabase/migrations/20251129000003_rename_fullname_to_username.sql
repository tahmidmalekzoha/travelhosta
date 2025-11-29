-- Migration to rename full_name to username throughout the system
-- This consolidates the naming convention to use username as the primary identifier

-- Step 1: Drop the existing username column (it will be replaced by full_name)
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS username CASCADE;

-- Step 2: Rename full_name to username
ALTER TABLE public.user_profiles 
RENAME COLUMN full_name TO username;

-- Step 3: Make username unique and not null
ALTER TABLE public.user_profiles 
ALTER COLUMN username SET NOT NULL;

-- Add unique constraint
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_username_unique UNIQUE (username);

-- Step 4: Create index for referral lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Step 5: Update the auto_generate_username function to work with the renamed column
CREATE OR REPLACE FUNCTION public.generate_username_from_text(p_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_base_username TEXT;
    v_username TEXT;
    v_counter INTEGER := 0;
    v_exists BOOLEAN;
BEGIN
    -- Convert text to username: lowercase, replace spaces with underscores, remove special chars
    v_base_username := LOWER(REGEXP_REPLACE(TRIM(p_text), '[^a-zA-Z0-9\s]', '', 'g'));
    v_base_username := REGEXP_REPLACE(v_base_username, '\s+', '_', 'g');
    
    -- Limit to 30 characters
    v_base_username := SUBSTRING(v_base_username FROM 1 FOR 30);
    
    -- Check if base username exists
    v_username := v_base_username;
    
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM public.user_profiles WHERE username = v_username
        ) INTO v_exists;
        
        EXIT WHEN NOT v_exists;
        
        -- Add counter if exists
        v_counter := v_counter + 1;
        v_username := v_base_username || '_' || v_counter;
    END LOOP;
    
    RETURN v_username;
END;
$$;

-- Step 6: Update trigger function to work with username column
CREATE OR REPLACE FUNCTION public.auto_generate_username()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Generate username if not provided
    IF NEW.username IS NULL THEN
        -- Try to use email username part as base
        IF NEW.email IS NOT NULL THEN
            NEW.username := public.generate_username_from_text(split_part(NEW.email, '@', 1));
        ELSE
            -- Fallback to user_ + id
            NEW.username := 'user_' || NEW.id::TEXT;
        END IF;
    ELSE
        -- Ensure username is unique by appending counter if needed
        NEW.username := public.generate_username_from_text(NEW.username);
    END IF;
    
    -- Set display_name to username if not provided
    IF NEW.display_name IS NULL THEN
        NEW.display_name := NEW.username;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_username ON public.user_profiles;
CREATE TRIGGER trigger_auto_generate_username
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_username();

-- Step 7: Update validate_username function to ensure proper format
CREATE OR REPLACE FUNCTION public.validate_username(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Username can contain letters, numbers, underscores only
    -- Must be between 3 and 30 characters
    RETURN p_username ~ '^[a-zA-Z0-9_]{3,30}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 8: Update set_username function (now it just validates and updates username)
CREATE OR REPLACE FUNCTION public.set_username(
    p_user_id UUID,
    p_username TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_current_username TEXT;
    v_user_role TEXT;
BEGIN
    -- Validate username format
    IF NOT validate_username(p_username) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Username must be 3-30 characters and contain only letters, numbers, and underscores'
        );
    END IF;
    
    -- Check if username is already taken
    IF EXISTS (SELECT 1 FROM public.user_profiles WHERE username = p_username AND id != p_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Username is already taken'
        );
    END IF;
    
    -- Get current username and role
    SELECT username, role INTO v_current_username, v_user_role
    FROM public.user_profiles
    WHERE id = p_user_id;
    
    -- If username is already set and user is not admin/superadmin, check cooldown
    IF v_current_username IS NOT NULL AND v_user_role NOT IN ('admin', 'superadmin') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Username can only be changed by administrators. Contact support for username changes.'
        );
    END IF;
    
    -- Set username
    UPDATE public.user_profiles
    SET username = p_username
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Update referral functions to work with username
CREATE OR REPLACE FUNCTION public.get_user_referral_code()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_username VARCHAR(50);
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User not authenticated'
        );
    END IF;
    
    -- Get username (which serves as referral code)
    SELECT username INTO v_username
    FROM public.user_profiles
    WHERE id = v_user_id;
    
    IF v_username IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Username not set'
        );
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'referralCode', v_username
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_referral_code(p_referral_code VARCHAR(50))
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_referrer_id UUID;
    v_already_referred BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User not authenticated'
        );
    END IF;
    
    -- Check if user already has a referrer
    SELECT EXISTS(
        SELECT 1 FROM public.user_referrals WHERE referred_user_id = v_user_id
    ) INTO v_already_referred;
    
    IF v_already_referred THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User already has a referrer'
        );
    END IF;
    
    -- Find referrer by username (referral code)
    SELECT id INTO v_referrer_id
    FROM public.user_profiles
    WHERE username = p_referral_code;
    
    IF v_referrer_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid referral code'
        );
    END IF;
    
    IF v_referrer_id = v_user_id THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Cannot use your own referral code'
        );
    END IF;
    
    -- Update user profile with referral info
    UPDATE public.user_profiles
    SET referred_by = p_referral_code
    WHERE id = v_user_id;
    
    -- Create referral record
    INSERT INTO public.user_referrals (referrer_id, referred_user_id, referral_code, status)
    VALUES (v_referrer_id, v_user_id, p_referral_code, 'completed');
    
    RETURN json_build_object(
        'success', true,
        'message', 'Referral code applied successfully'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_referral_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_total_referrals INTEGER;
    v_pending_referrals INTEGER;
    v_completed_referrals INTEGER;
    v_username VARCHAR(50);
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User not authenticated'
        );
    END IF;
    
    -- Get username (which serves as referral code)
    SELECT username INTO v_username
    FROM public.user_profiles
    WHERE id = v_user_id;
    
    IF v_username IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Username not set'
        );
    END IF;
    
    -- Count referrals
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status IN ('completed', 'rewarded'))
    INTO v_total_referrals, v_pending_referrals, v_completed_referrals
    FROM public.user_referrals
    WHERE referrer_id = v_user_id;
    
    RETURN json_build_object(
        'success', true,
        'referralCode', v_username,
        'totalReferrals', v_total_referrals,
        'pendingReferrals', v_pending_referrals,
        'completedReferrals', v_completed_referrals
    );
END;
$$;

-- Step 10: Grant permissions
GRANT EXECUTE ON FUNCTION public.generate_username_from_text(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_username(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_username(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_referral_code() TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_stats() TO authenticated;

-- Step 11: Update comments
COMMENT ON COLUMN public.user_profiles.username IS 'Primary user identifier. Auto-generated from email or provided value. Used as referral code. Unique and permanent.';
COMMENT ON COLUMN public.user_profiles.display_name IS 'User display name shown in UI. Can be changed (subject to cooldown).';
