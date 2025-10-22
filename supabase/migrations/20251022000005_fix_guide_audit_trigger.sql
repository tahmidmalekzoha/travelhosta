-- Fix the guide audit trigger to handle missing user profiles gracefully
-- and handle the foreign key constraint issue
CREATE OR REPLACE FUNCTION public.track_guide_edit()
RETURNS TRIGGER AS $$
DECLARE
    v_user_profile RECORD;
    v_action TEXT;
    v_user_id UUID;
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
    
    -- Get the user ID safely
    v_user_id := COALESCE(auth.uid(), CASE WHEN TG_OP = 'DELETE' THEN OLD.created_by ELSE NEW.created_by END);
    
    -- Get user profile information, with fallback if profile doesn't exist
    BEGIN
        SELECT email, username, display_name
        INTO v_user_profile
        FROM public.user_profiles
        WHERE id = v_user_id;
    EXCEPTION WHEN OTHERS THEN
        -- If user profile doesn't exist, set default values
        v_user_profile.email := NULL;
        v_user_profile.username := NULL;
        v_user_profile.display_name := NULL;
    END;
    
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
            v_user_id,
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
            v_user_id,
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
EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE WARNING 'Failed to insert audit log for guide %: %', 
        COALESCE(NEW.id, OLD.id), SQLERRM;
    -- Return the row to allow the main operation to succeed
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the changed_by column in audit log allows NULL
-- First check if the column exists, if not this will be created by the previous migration
DO $$ 
BEGIN
    -- Check if column exists and alter it to allow NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'guide_audit_log' 
        AND column_name = 'changed_by'
    ) THEN
        ALTER TABLE public.guide_audit_log 
        ALTER COLUMN changed_by DROP NOT NULL;
        
        COMMENT ON COLUMN public.guide_audit_log.changed_by IS 'User ID who made the change. NULL if user context is unavailable.';
    ELSE
        RAISE NOTICE 'Column changed_by does not exist. Please run migration 20251022000004 first.';
    END IF;
END $$;

-- Fix the foreign key constraint to be DEFERRABLE
-- This allows the trigger to see the newly inserted guide row
DO $$
BEGIN
    -- Drop the existing foreign key constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'guide_audit_log' 
        AND constraint_name = 'guide_audit_log_guide_id_fkey'
    ) THEN
        ALTER TABLE public.guide_audit_log 
        DROP CONSTRAINT guide_audit_log_guide_id_fkey;
        
        -- Recreate it as DEFERRABLE INITIALLY DEFERRED
        -- This means the constraint check happens at the end of the transaction
        ALTER TABLE public.guide_audit_log
        ADD CONSTRAINT guide_audit_log_guide_id_fkey 
        FOREIGN KEY (guide_id) 
        REFERENCES public.guides(id) 
        ON DELETE CASCADE
        DEFERRABLE INITIALLY DEFERRED;
        
        RAISE NOTICE 'Foreign key constraint made DEFERRABLE';
    ELSE
        RAISE NOTICE 'Foreign key constraint does not exist yet.';
    END IF;
END $$;
