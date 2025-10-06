-- Make image_url nullable in guides table to allow creating guides without images
-- When no image is provided, it can be null or set to 'dummy.jpg'
ALTER TABLE public.guides 
ALTER COLUMN image_url DROP NOT NULL;

-- Update existing guides with empty or placeholder image URLs to null for consistency
UPDATE public.guides 
SET image_url = NULL 
WHERE image_url IN ('', 'dummy.jpg', '/images/dummy.jpg', 'images/dummy.jpg');

COMMENT ON COLUMN public.guides.image_url IS 'Optional cover image URL. Can be null if no image is provided.';
