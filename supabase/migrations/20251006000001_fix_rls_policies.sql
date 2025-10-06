-- Temporary fix for RLS policies to allow admin operations
-- This adds policies that allow operations when authenticated OR when using service role key

-- Drop existing authenticated-only policies and recreate with broader permissions
DROP POLICY IF EXISTS "Allow authenticated insert on guides" ON public.guides;
DROP POLICY IF EXISTS "Allow authenticated update on guides" ON public.guides;
DROP POLICY IF EXISTS "Allow authenticated delete on guides" ON public.guides;

DROP POLICY IF EXISTS "Allow authenticated insert on featured_guides" ON public.featured_guides;
DROP POLICY IF EXISTS "Allow authenticated update on featured_guides" ON public.featured_guides;
DROP POLICY IF EXISTS "Allow authenticated delete on featured_guides" ON public.featured_guides;

DROP POLICY IF EXISTS "Allow authenticated insert on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated update on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated delete on categories" ON public.categories;

DROP POLICY IF EXISTS "Allow authenticated insert on divisions" ON public.divisions;
DROP POLICY IF EXISTS "Allow authenticated update on divisions" ON public.divisions;
DROP POLICY IF EXISTS "Allow authenticated delete on divisions" ON public.divisions;

-- Create new policies that allow all operations for now
-- TODO: Implement proper authentication and restrict these policies

-- Guides table policies
CREATE POLICY "Allow all insert on guides"
    ON public.guides FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update on guides"
    ON public.guides FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete on guides"
    ON public.guides FOR DELETE
    USING (true);

-- Featured guides table policies
CREATE POLICY "Allow all insert on featured_guides"
    ON public.featured_guides FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update on featured_guides"
    ON public.featured_guides FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete on featured_guides"
    ON public.featured_guides FOR DELETE
    USING (true);

-- Categories table policies
CREATE POLICY "Allow all insert on categories"
    ON public.categories FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update on categories"
    ON public.categories FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete on categories"
    ON public.categories FOR DELETE
    USING (true);

-- Divisions table policies
CREATE POLICY "Allow all insert on divisions"
    ON public.divisions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all update on divisions"
    ON public.divisions FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all delete on divisions"
    ON public.divisions FOR DELETE
    USING (true);

-- Add comment explaining this is temporary
COMMENT ON TABLE public.guides IS 'Travel guides table. Current RLS policies allow all operations - should be restricted with proper auth implementation.';
