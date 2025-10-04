/**
 * Image utility functions for validating and handling image URLs
 */

/**
 * Checks if an image URL is valid (not a placeholder or dummy image)
 * @param url - The image URL to validate
 * @returns true if the URL is valid, false otherwise
 */
export const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === '') {
        return false;
    }
    
    const placeholderUrls = ['dummy.jpg', '/images/dummy.jpg', 'images/dummy.jpg', 'placeholder.jpg'];
    const normalizedUrl = url.toLowerCase().trim();
    
    return !placeholderUrls.some(placeholder => normalizedUrl.includes(placeholder));
};

/**
 * Gets a fallback alt text for images
 * @param alt - Primary alt text
 * @param caption - Secondary caption text
 * @param defaultText - Default text to use if both are empty
 * @returns The alt text to use
 */
export const getImageAltText = (
    alt?: string,
    caption?: string,
    defaultText: string = 'Image'
): string => {
    return alt || caption || defaultText;
};
