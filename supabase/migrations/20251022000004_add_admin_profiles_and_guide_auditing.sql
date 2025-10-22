-- Add username and display_name to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS last_name_change_at TIMESTAMPTZ;

-- Add audit fields to guides table
ALTER TABLE public.guides
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ;

-- Create guide_audit_log table for tracking all changes
CREATE TABLE IF NOT EXISTS public.guide_audit_log (
    id BIGSERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Snapshot of user info at time of change (preserved even if user changes their name)
    user_email TEXT,
    user_username TEXT,
    user_display_name TEXT,
    
    -- What changed (JSONB for flexibility)
    changes JSONB,
    
    -- Snapshot of guide state after change
    guide_snapshot JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_guide_audit_log_guide_id ON public.guide_audit_log(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_audit_log_changed_by ON public.guide_audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_guide_audit_log_changed_at ON public.guide_audit_log(changed_at DESC);

-- Function to validate username format (alphanumeric, underscore, hyphen only)
CREATE OR REPLACE FUNCTION public.validate_username(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN username ~ '^[a-zA-Z0-9_-]+$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update display name with cooldown check
CREATE OR REPLACE FUNCTION public.update_user_display_name(
    p_user_id UUID,
    p_new_display_name TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_last_change_at TIMESTAMPTZ;
    v_cooldown_remaining INTERVAL;
BEGIN
    -- Check current cooldown
    SELECT last_name_change_at INTO v_last_change_at
    FROM public.user_profiles
    WHERE id = p_user_id;
    
    -- If last change was less than 24 hours ago, reject
    IF v_last_change_at IS NOT NULL AND v_last_change_at > NOW() - INTERVAL '24 hours' THEN
        v_cooldown_remaining := (v_last_change_at + INTERVAL '24 hours') - NOW();
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Display name can only be changed once per 24 hours',
            'cooldown_remaining', EXTRACT(EPOCH FROM v_cooldown_remaining)
        );
    END IF;
    
    -- Update display name
    UPDATE public.user_profiles
    SET 
        display_name = p_new_display_name,
        last_name_change_at = NOW()
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set username (only allowed once, or by admin role)
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
            'error', 'Username can only contain letters, numbers, underscores, and hyphens'
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
    
    -- If username is already set and user is not admin/superadmin, reject
    IF v_current_username IS NOT NULL AND v_user_role NOT IN ('admin', 'superadmin') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Username can only be set once. Contact an administrator to change it.'
        );
    END IF;
    
    -- Set username
    UPDATE public.user_profiles
    SET username = p_username
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically set guide creator when a guide is inserted
CREATE OR REPLACE FUNCTION public.set_guide_creator()
RETURNS TRIGGER AS $$
BEGIN
    -- Set created_by if not already set
    IF NEW.created_by IS NULL THEN
        NEW.created_by := auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track guide edits
CREATE OR REPLACE FUNCTION public.track_guide_edit()
RETURNS TRIGGER AS $$
DECLARE
    v_user_profile RECORD;
    v_action TEXT;
BEGIN
    -- Determine action type
    IF TG_OP = 'INSERT' THEN
        v_action := 'created';
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'updated';
        -- Update last_edited_by and last_edited_at
        NEW.last_edited_by := COALESCE(auth.uid(), NEW.last_edited_by);
        NEW.last_edited_at := NOW();
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'deleted';
    END IF;
    
    -- Get user profile information
    SELECT email, username, display_name
    INTO v_user_profile
    FROM public.user_profiles
    WHERE id = COALESCE(auth.uid(), CASE WHEN TG_OP = 'DELETE' THEN OLD.created_by ELSE NEW.created_by END);
    
    -- Insert audit log entry
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.guide_audit_log (
            guide_id,
            action,
            changed_by,
            changed_at,
            user_email,
            user_username,
            user_display_name,
            guide_snapshot
        ) VALUES (
            OLD.id,
            v_action,
            COALESCE(auth.uid(), OLD.created_by),
            NOW(),
            v_user_profile.email,
            v_user_profile.username,
            v_user_profile.display_name,
            row_to_json(OLD)::jsonb
        );
        RETURN OLD;
    ELSE
        INSERT INTO public.guide_audit_log (
            guide_id,
            action,
            changed_by,
            changed_at,
            user_email,
            user_username,
            user_display_name,
            guide_snapshot,
            changes
        ) VALUES (
            NEW.id,
            v_action,
            COALESCE(auth.uid(), NEW.created_by),
            NOW(),
            v_user_profile.email,
            v_user_profile.username,
            v_user_profile.display_name,
            row_to_json(NEW)::jsonb,
            CASE 
                WHEN TG_OP = 'UPDATE' THEN 
                    jsonb_build_object(
                        'old', row_to_json(OLD)::jsonb,
                        'new', row_to_json(NEW)::jsonb
                    )
                ELSE NULL
            END
        );
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS set_guide_creator_trigger ON public.guides;
DROP TRIGGER IF EXISTS track_guide_changes_trigger ON public.guides;

-- Create triggers
CREATE TRIGGER set_guide_creator_trigger
    BEFORE INSERT ON public.guides
    FOR EACH ROW
    EXECUTE FUNCTION public.set_guide_creator();

CREATE TRIGGER track_guide_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.guides
    FOR EACH ROW
    EXECUTE FUNCTION public.track_guide_edit();

-- Create a view that joins guides with creator/editor information
DROP VIEW IF EXISTS public.guides_with_audit_info;
CREATE VIEW public.guides_with_audit_info WITH (security_invoker = true) AS
SELECT 
    g.*,
    creator.email as creator_email,
    creator.username as creator_username,
    creator.display_name as creator_display_name,
    editor.email as last_editor_email,
    editor.username as last_editor_username,
    editor.display_name as last_editor_display_name
FROM public.guides g
LEFT JOIN public.user_profiles creator ON g.created_by = creator.id
LEFT JOIN public.user_profiles editor ON g.last_edited_by = editor.id;

-- Grant permissions
GRANT SELECT ON public.guide_audit_log TO authenticated;
GRANT SELECT ON public.guides_with_audit_info TO authenticated;

-- RLS Policies
ALTER TABLE public.guide_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on guide_audit_log" ON public.guide_audit_log;
DROP POLICY IF EXISTS "Allow authenticated users to insert audit logs" ON public.guide_audit_log;

-- Public can read audit logs (for transparency)
CREATE POLICY "Allow public read access on guide_audit_log"
ON public.guide_audit_log FOR SELECT
TO authenticated
USING (true);

-- Only the system (via triggers) should insert audit logs
CREATE POLICY "Allow authenticated users to insert audit logs"
ON public.guide_audit_log FOR INSERT
TO authenticated
WITH CHECK (changed_by = auth.uid());

-- Comment the tables and columns for documentation
COMMENT ON COLUMN public.user_profiles.username IS 'Unique permanent identifier. Can only be set once by user, then requires admin to change.';
COMMENT ON COLUMN public.user_profiles.display_name IS 'User''s display name. Can be changed once per 24 hours to prevent abuse.';
COMMENT ON COLUMN public.user_profiles.last_name_change_at IS 'Timestamp of last display name change, used for cooldown enforcement.';

COMMENT ON TABLE public.guide_audit_log IS 'Complete audit trail of all guide changes. Preserves user information at time of change.';
COMMENT ON COLUMN public.guide_audit_log.user_email IS 'Snapshot of user email at time of change (preserved even if user changes email)';
COMMENT ON COLUMN public.guide_audit_log.user_username IS 'Snapshot of username at time of change (preserved even if admin changes it)';
COMMENT ON COLUMN public.guide_audit_log.user_display_name IS 'Snapshot of display name at time of change (preserved even if user changes it)';
