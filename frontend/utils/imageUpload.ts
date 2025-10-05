import { supabase } from './supabase';

/**
 * Upload a guide image to Supabase Storage
 * @param file - The image file to upload
 * @param guideName - The name of the guide (used for file naming)
 * @returns The public URL of the uploaded image
 */
export async function uploadGuideImage(
  file: File,
  guideName: string
): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image must be less than 5MB');
  }

  // Create a unique filename
  const fileExt = file.name.split('.').pop();
  const sanitizedGuideName = guideName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50);
  const timestamp = Date.now();
  const fileName = `${sanitizedGuideName}-${timestamp}.${fileExt}`;
  const filePath = `guides/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('guide-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('guide-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Upload a hero image to Supabase Storage
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadHeroImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB for hero images
  if (file.size > maxSize) {
    throw new Error('Image must be less than 10MB');
  }

  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `hero-${timestamp}.${fileExt}`;
  const filePath = `hero/${fileName}`;

  const { data, error } = await supabase.storage
    .from('guide-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('guide-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Get an optimized image URL with transformations
 * @param path - The storage path of the image
 * @param width - Desired width (default: 800px)
 * @param quality - Image quality 1-100 (default: 80)
 * @returns The transformed image URL
 */
export function getOptimizedImageUrl(
  path: string,
  width: number = 800,
  quality: number = 80
): string {
  // Extract the path from full URL if needed
  const storagePath = path.includes('guide-images/') 
    ? path.split('guide-images/')[1]
    : path;

  const { data } = supabase.storage
    .from('guide-images')
    .getPublicUrl(storagePath, {
      transform: {
        width,
        height: Math.round(width * 0.66), // 3:2 aspect ratio
        resize: 'cover',
        quality
      }
    });
  
  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL or path of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract the path from the URL
  const path = imageUrl.includes('guide-images/')
    ? imageUrl.split('guide-images/')[1]
    : imageUrl;

  const { error } = await supabase.storage
    .from('guide-images')
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, WebP, and GIF images are allowed'
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image must be less than 5MB'
    };
  }

  return { valid: true };
}
