-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    guide_id BIGINT NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, guide_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_guide_id ON public.user_bookmarks(guide_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_created_at ON public.user_bookmarks(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
    ON public.user_bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own bookmarks
CREATE POLICY "Users can create own bookmarks"
    ON public.user_bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
    ON public.user_bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.user_bookmarks TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_bookmarks_id_seq TO authenticated;

-- Function to toggle bookmark (add if not exists, remove if exists)
CREATE OR REPLACE FUNCTION public.toggle_bookmark(p_guide_id BIGINT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_bookmark_exists BOOLEAN;
    v_result JSON;
BEGIN
    -- Get the current user ID
    v_user_id := auth.uid();
    
    -- Check if user is authenticated
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User not authenticated'
        );
    END IF;
    
    -- Check if bookmark exists
    SELECT EXISTS(
        SELECT 1 FROM public.user_bookmarks
        WHERE user_id = v_user_id AND guide_id = p_guide_id
    ) INTO v_bookmark_exists;
    
    IF v_bookmark_exists THEN
        -- Remove bookmark
        DELETE FROM public.user_bookmarks
        WHERE user_id = v_user_id AND guide_id = p_guide_id;
        
        v_result := json_build_object(
            'success', true,
            'action', 'removed',
            'isBookmarked', false,
            'message', 'Bookmark removed successfully'
        );
    ELSE
        -- Add bookmark
        INSERT INTO public.user_bookmarks (user_id, guide_id)
        VALUES (v_user_id, p_guide_id);
        
        v_result := json_build_object(
            'success', true,
            'action', 'added',
            'isBookmarked', true,
            'message', 'Bookmark added successfully'
        );
    END IF;
    
    RETURN v_result;
END;
$$;

-- Function to check if a guide is bookmarked
CREATE OR REPLACE FUNCTION public.is_guide_bookmarked(p_guide_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_is_bookmarked BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    SELECT EXISTS(
        SELECT 1 FROM public.user_bookmarks
        WHERE user_id = v_user_id AND guide_id = p_guide_id
    ) INTO v_is_bookmarked;
    
    RETURN v_is_bookmarked;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.toggle_bookmark(BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_guide_bookmarked(BIGINT) TO authenticated;
