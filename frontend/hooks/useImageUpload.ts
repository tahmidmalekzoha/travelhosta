/**
 * Custom hook for managing image upload functionality
 */

import { useState, useEffect } from 'react';
import { uploadGuideImage, validateImageFile } from '../utils/imageUpload';
import { ToastType } from '../components/shared/Toast';

export interface UseImageUploadReturn {
    uploading: boolean;
    imagePreview: string | null;
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, guideTitle: string) => Promise<string | null>;
    handleRemoveImage: () => void;
}

export function useImageUpload(
    initialImageUrl?: string,
    onImageChange?: (url: string) => void,
    onToast?: (message: string, type: ToastType) => void
): UseImageUploadReturn {
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Initialize image preview from initial URL
    useEffect(() => {
        if (initialImageUrl) {
            setImagePreview(initialImageUrl);
        }
    }, [initialImageUrl]);

    /**
     * Handle image upload to Supabase Storage
     */
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        guideTitle: string
    ): Promise<string | null> => {
        const file = e.target.files?.[0];
        if (!file) return null;

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            if (onToast) {
                onToast(validation.error || 'Invalid file', 'error');
            }
            return null;
        }

        setUploading(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const imageUrl = await uploadGuideImage(file, guideTitle || 'guide');
            
            if (onImageChange) {
                onImageChange(imageUrl);
            }
            
            if (onToast) {
                onToast('Image uploaded successfully!', 'success');
            }
            
            return imageUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            if (onToast) {
                onToast(
                    error instanceof Error ? error.message : 'Failed to upload image',
                    'error'
                );
            }
            setImagePreview(null);
            return null;
        } finally {
            setUploading(false);
        }
    };

    /**
     * Remove uploaded image
     */
    const handleRemoveImage = () => {
        setImagePreview(null);
        if (onImageChange) {
            onImageChange('');
        }
    };

    return {
        uploading,
        imagePreview,
        setImagePreview,
        handleImageUpload,
        handleRemoveImage
    };
}
