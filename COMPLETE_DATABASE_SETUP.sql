-- ============================================
-- COMPLETE DATABASE SETUP FOR TRAVELHOSTA
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Create all tables
-- ============================================

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

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Create hero_images table
CREATE TABLE IF NOT EXISTS public.hero_images (
    id BIGSERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_guides_division ON public.guides(division);
CREATE INDEX IF NOT EXISTS idx_guides_category ON public.guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_tags ON public.guides USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON public.guides(created_at DESC);

-- Step 3: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if any
-- ============================================

DROP POLICY IF EXISTS "Allow public read access on guides" ON public.guides;
DROP POLICY IF EXISTS "Allow public read access on featured_guides" ON public.featured_guides;
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access on divisions" ON public.divisions;
DROP POLICY IF EXISTS "Allow public read access on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow public read access on hero_images" ON public.hero_images;

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

DROP POLICY IF EXISTS "Allow authenticated insert on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow authenticated update on tags" ON public.tags;
DROP POLICY IF EXISTS "Allow authenticated delete on tags" ON public.tags;

DROP POLICY IF EXISTS "Allow authenticated insert on hero_images" ON public.hero_images;
DROP POLICY IF EXISTS "Allow authenticated update on hero_images" ON public.hero_images;
DROP POLICY IF EXISTS "Allow authenticated delete on hero_images" ON public.hero_images;

-- Step 5: Create new policies
-- ============================================

-- Guides policies
CREATE POLICY "Allow public read access on guides"
    ON public.guides FOR SELECT
    TO public
    USING (true);

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

-- Featured guides policies
CREATE POLICY "Allow public read access on featured_guides"
    ON public.featured_guides FOR SELECT
    TO public
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

-- Categories policies
CREATE POLICY "Allow public read access on categories"
    ON public.categories FOR SELECT
    TO public
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

-- Divisions policies
CREATE POLICY "Allow public read access on divisions"
    ON public.divisions FOR SELECT
    TO public
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

-- Tags policies
CREATE POLICY "Allow public read access on tags"
    ON public.tags FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated insert on tags"
    ON public.tags FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on tags"
    ON public.tags FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on tags"
    ON public.tags FOR DELETE
    TO authenticated
    USING (true);

-- Hero images policies
CREATE POLICY "Allow public read access on hero_images"
    ON public.hero_images FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated insert on hero_images"
    ON public.hero_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on hero_images"
    ON public.hero_images FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on hero_images"
    ON public.hero_images FOR DELETE
    TO authenticated
    USING (true);

-- Step 6: Create trigger function for updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_guides_updated_at ON public.guides;
CREATE TRIGGER update_guides_updated_at
    BEFORE UPDATE ON public.guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Seed initial data
-- ============================================

-- Insert default categories
INSERT INTO public.categories (name) VALUES
    ('Day Tour'),
    ('Camping'),
    ('Trekking'),
    ('Staycation'),
    ('Adventure'),
    ('Cultural'),
    ('Beach')
ON CONFLICT (name) DO NOTHING;

-- Insert default divisions (Bangladesh divisions)
INSERT INTO public.divisions (name) VALUES
    ('Dhaka'),
    ('Chittagong'),
    ('Khulna'),
    ('Rajshahi'),
    ('Sylhet'),
    ('Barisal'),
    ('Rangpur'),
    ('Mymensingh')
ON CONFLICT (name) DO NOTHING;

-- Insert default tags
INSERT INTO public.tags (name) VALUES
    ('Family Friendly'),
    ('Budget'),
    ('Luxury'),
    ('Solo Travel'),
    ('Weekend'),
    ('Photography')
ON CONFLICT (name) DO NOTHING;

-- Insert default hero image
INSERT INTO public.hero_images (image_url, title, subtitle, is_active) VALUES
    ('/images/hero-background.jpg', 'TRAVELHOSTA', 'Sajek, Hill of Wonders', true)
ON CONFLICT DO NOTHING;

-- Step 8: Setup Supabase Storage for Images
-- ============================================

-- Create storage bucket for guide images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'guide-images',
    'guide-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to guide images
CREATE POLICY IF NOT EXISTS "Public Access to Guide Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'guide-images');

-- Allow authenticated users to upload guide images
CREATE POLICY IF NOT EXISTS "Authenticated Upload Guide Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'guide-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY IF NOT EXISTS "Authenticated Update Guide Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'guide-images');

-- Allow authenticated users to delete guide images
CREATE POLICY IF NOT EXISTS "Authenticated Delete Guide Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'guide-images');

-- Step 9: Verify tables created
-- ============================================

SELECT 'Tables created successfully!' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('guides', 'featured_guides', 'categories', 'divisions', 'tags', 'hero_images')
ORDER BY table_name;
