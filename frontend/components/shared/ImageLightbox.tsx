"use client";

import { FunctionComponent, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
    /** URL of the image to display */
    imageUrl: string;
    /** Alt text for the image */
    alt?: string;
    /** Caption text to display below the image */
    caption?: string;
    /** Function to close the lightbox */
    onClose: () => void;
    /** Optional array of images for gallery navigation */
    images?: Array<{ url: string; caption?: string; alt?: string }>;
    /** Current index in the gallery */
    currentIndex?: number;
    /** Function to navigate to next/previous image */
    onNavigate?: (index: number) => void;
}

/**
 * Lightbox component for viewing images in fullscreen
 * Matches the TravelHosta design with rounded corners and clean styling
 */
const ImageLightbox: FunctionComponent<ImageLightboxProps> = ({
    imageUrl,
    alt,
    caption,
    onClose,
    images,
    currentIndex = 0,
    onNavigate
}) => {
    // Handle ESC key to close lightbox
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (images && onNavigate) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                onNavigate(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
                onNavigate(currentIndex + 1);
            }
        }
    }, [onClose, images, currentIndex, onNavigate]);

    useEffect(() => {
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handlePrevious = useCallback(() => {
        if (onNavigate && currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    }, [onNavigate, currentIndex]);

    const handleNext = useCallback(() => {
        if (onNavigate && images && currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
        }
    }, [onNavigate, images, currentIndex]);

    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Close lightbox"
            >
                <X size={24} />
            </button>

            {/* Previous Button */}
            {images && onNavigate && currentIndex > 0 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-6 z-50 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={28} />
                </button>
            )}

            {/* Next Button */}
            {images && onNavigate && currentIndex < images.length - 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-6 z-50 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Next image"
                >
                    <ChevronRight size={28} />
                </button>
            )}

            {/* Image Container */}
            <div 
                className="relative flex flex-col items-center w-full h-full justify-center"
                onClick={handleBackdropClick}
            >
                <div 
                    className="relative rounded-[40px] overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={imageUrl}
                        alt={alt || caption || 'Fullscreen image'}
                        className="max-w-[90vw] max-h-[85vh] min-h-[60vh] object-contain"
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </div>

                {/* Caption */}
                {caption && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-black/60 backdrop-blur-md rounded-[32px] border border-white/20 max-w-[80vw]">
                        <p className="font-['Schibsted_Grotesk'] text-white text-lg text-center">
                            {caption}
                        </p>
                    </div>
                )}

                {/* Gallery Counter */}
                {images && images.length > 1 && (
                    <div className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <p className="font-['Schibsted_Grotesk'] text-white text-sm">
                            {currentIndex + 1} / {images.length}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageLightbox;
