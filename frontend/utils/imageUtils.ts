/**
 * Image utility functions
 * Helper functions for image validation and processing
 */

/**
 * Validates if a given URL is a valid image URL
 * @param url - The URL to validate
 * @returns True if the URL is valid and appears to be an image
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }

    // Check if it's a valid URL format
    try {
        // Handle relative URLs (starting with /)
        if (url.startsWith('/')) {
            return url.length > 1;
        }

        // Handle absolute URLs
        const urlObj = new URL(url);
        
        // Check for common image extensions
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
        const hasImageExtension = imageExtensions.some(ext => 
            urlObj.pathname.toLowerCase().endsWith(ext)
        );

        // Also check for Supabase storage URLs or other CDN patterns
        const isStorageUrl = url.includes('supabase') || url.includes('storage');

        return hasImageExtension || isStorageUrl;
    } catch {
        return false;
    }
}

/**
 * Gets a fallback image URL
 * @returns Default placeholder image path
 */
export function getFallbackImageUrl(): string {
    return '/images/dummy.jpg';
}

/**
 * Validates and returns a safe image URL with fallback
 * @param url - The URL to validate
 * @param fallback - Optional custom fallback URL
 * @returns Valid image URL or fallback
 */
export function getSafeImageUrl(url: string | null | undefined, fallback?: string): string {
    return isValidImageUrl(url) ? url! : (fallback || getFallbackImageUrl());
}

/**
 * Gets appropriate alt text for an image, with fallback logic
 * @param alt - Primary alt text
 * @param caption - Caption to use as fallback
 * @param defaultText - Default text if neither alt nor caption is available
 * @returns Appropriate alt text for the image
 */
export function getImageAltText(
    alt: string | undefined,
    caption: string | undefined,
    defaultText: string = 'Image'
): string {
    if (alt && alt.trim()) {
        return alt.trim();
    }
    if (caption && caption.trim()) {
        return caption.trim();
    }
    return defaultText;
}
