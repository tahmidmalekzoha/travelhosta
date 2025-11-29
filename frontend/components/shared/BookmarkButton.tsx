/**
 * Bookmark Button Component
 * Allows users to bookmark/unbookmark guides
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleBookmark, isGuideBookmarked } from '@/services/bookmarksService';
import { useAuth } from '@/contexts/AuthContext';

interface BookmarkButtonProps {
    guideId: number;
    variant?: 'default' | 'detail'; // default for cards, detail for guide detail page
    onBookmarkChange?: (isBookmarked: boolean) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
    guideId, 
    variant = 'default',
    onBookmarkChange 
}) => {
    const { user } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if guide is bookmarked on mount
    useEffect(() => {
        if (user) {
            checkBookmarkStatus();
        }
    }, [user, guideId]);

    const checkBookmarkStatus = async () => {
        const bookmarked = await isGuideBookmarked(guideId);
        setIsBookmarked(bookmarked);
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            // Redirect to signin if not authenticated
            window.location.href = `/signin?redirect=${window.location.pathname}`;
            return;
        }

        setIsLoading(true);
        const result = await toggleBookmark(guideId);
        
        if (result.success) {
            setIsBookmarked(result.isBookmarked);
            if (onBookmarkChange) {
                onBookmarkChange(result.isBookmarked);
            }
        }
        setIsLoading(false);
    };

    if (variant === 'detail') {
        // Large button for guide detail page
        return (
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className="group relative inline-flex items-center rounded-full bg-[#cd8453] h-[85px] transition-transform duration-200 hover:scale-105 hover:bg-[#b8754a] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
                <span className={`absolute left-[11.54px] top-[9.44px] flex h-[65.062px] w-[65.062px] items-center justify-center rounded-full bg-[#f2eee9] transition-colors duration-200 ${
                    isBookmarked ? 'text-[#cd8453]' : 'text-[#1b3c44]'
                }`}>
                    <Bookmark 
                        size={28} 
                        strokeWidth={2.5}
                        fill={isBookmarked ? 'currentColor' : 'none'}
                        className="transition-all duration-200"
                    />
                </span>
                <span className="font-['Schibsted_Grotesk'] font-normal text-[50.37px] text-[#f2eee9] ml-[93.4px] mr-[34px]">
                    {isBookmarked ? 'Saved' : 'Save'}
                </span>
            </button>
        );
    }

    // Compact button for cards and other places
    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isBookmarked 
                    ? 'bg-[#cd8453] text-white hover:bg-[#b8754a]' 
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <Bookmark 
                size={20} 
                fill={isBookmarked ? 'currentColor' : 'none'}
                className="transition-all duration-200"
            />
        </button>
    );
};

export default BookmarkButton;
