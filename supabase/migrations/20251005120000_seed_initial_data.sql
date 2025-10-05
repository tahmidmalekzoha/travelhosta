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
