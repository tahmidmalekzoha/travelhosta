-- Create guides table
CREATE TABLE IF NOT EXISTS public.guides (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    division TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    
    -- Bilingual support
    title_bn TEXT,
    description_bn TEXT,
    
    -- Content stored as JSONB for flexibility
    content JSONB,
    content_bn JSONB,
    
    -- Legacy itinerary support
    itinerary JSONB,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create featured_guides table
CREATE TABLE IF NOT EXISTS public.featured_guides (
    id BIGSERIAL PRIMARY KEY,
    guide_id BIGINT NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guide_id),
    UNIQUE(position)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create divisions table
CREATE TABLE IF NOT EXISTS public.divisions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on guides"
    ON public.guides FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on featured_guides"
    ON public.featured_guides FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on categories"
    ON public.categories FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on divisions"
    ON public.divisions FOR SELECT
    TO public
    USING (true);

-- Create policies for authenticated users (admin operations)
CREATE POLICY "Allow authenticated insert on guides"
    ON public.guides FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on guides"
    ON public.guides FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on guides"
    ON public.guides FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on featured_guides"
    ON public.featured_guides FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on featured_guides"
    ON public.featured_guides FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on featured_guides"
    ON public.featured_guides FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on divisions"
    ON public.divisions FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on divisions"
    ON public.divisions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on divisions"
    ON public.divisions FOR DELETE
    TO authenticated
    USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_guides_division ON public.guides(division);
CREATE INDEX idx_guides_category ON public.guides(category);
CREATE INDEX idx_guides_tags ON public.guides USING GIN(tags);
CREATE INDEX idx_guides_created_at ON public.guides(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_guides_updated_at
    BEFORE UPDATE ON public.guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
