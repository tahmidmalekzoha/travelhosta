-- Create hero_images table
CREATE TABLE IF NOT EXISTS public.hero_images (
    id BIGSERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on hero_images"
    ON public.hero_images FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access on tags"
    ON public.tags FOR SELECT
    TO public
    USING (true);

-- Create policies for authenticated users (admin operations)
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

-- Seed default tags
INSERT INTO public.tags (name) VALUES
    ('Family Friendly'),
    ('Budget'),
    ('Luxury'),
    ('Solo Travel'),
    ('Weekend'),
    ('Photography')
ON CONFLICT (name) DO NOTHING;

-- Seed a default hero image
INSERT INTO public.hero_images (image_url, title, subtitle, is_active) VALUES
    ('/images/hero-background.jpg', 'TRAVELHOSTA', 'Sajek, Hill of Wonders', true)
ON CONFLICT DO NOTHING;
