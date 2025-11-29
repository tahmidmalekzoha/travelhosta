/**
 * Bookmarks Service
 * Handles all bookmark-related operations with Supabase
 */

import { supabase } from '@/utils/supabase';
import type { GuideData } from '@/types';

/**
 * Toggle bookmark for a guide
 * @param guideId - The ID of the guide to bookmark/unbookmark
 * @returns Result object with success status and bookmark state
 */
export async function toggleBookmark(guideId: number): Promise<{
    success: boolean;
    isBookmarked: boolean;
    message: string;
}> {
    try {
        const { data, error } = await supabase.rpc('toggle_bookmark', {
            p_guide_id: guideId
        });

        if (error || !data) {
            console.error('Error toggling bookmark:', error);
            return {
                success: false,
                isBookmarked: false,
                message: 'Failed to toggle bookmark'
            };
        }

        const result = data as { success: boolean; isBookmarked: boolean; message: string };
        
        return {
            success: result.success,
            isBookmarked: result.isBookmarked,
            message: result.message
        };
    } catch (error) {
        console.error('Unexpected error toggling bookmark:', error);
        return {
            success: false,
            isBookmarked: false,
            message: 'An unexpected error occurred'
        };
    }
}

/**
 * Check if a guide is bookmarked by the current user
 * @param guideId - The ID of the guide to check
 * @returns Whether the guide is bookmarked
 */
export async function isGuideBookmarked(guideId: number): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('is_guide_bookmarked', {
            p_guide_id: guideId
        });

        if (error) {
            console.error('Error checking bookmark status:', error);
            return false;
        }

        return data || false;
    } catch (error) {
        console.error('Unexpected error checking bookmark:', error);
        return false;
    }
}

/**
 * Get all bookmarked guides for the current user
 * @returns Array of bookmarked guides with full guide data
 */
export async function getBookmarkedGuides(): Promise<GuideData[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return [];
        }

        const { data, error } = await supabase
            .from('user_bookmarks')
            .select(`
                guide_id,
                guides (
                    id,
                    title,
                    description,
                    division,
                    category,
                    image_url,
                    tags,
                    created_at,
                    updated_at
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookmarked guides:', error);
            return [];
        }

        // Map the data to GuideData format
        const guides: GuideData[] = (data || [])
            .filter(bookmark => bookmark.guides)
            .map(bookmark => {
                const guide = Array.isArray(bookmark.guides) ? bookmark.guides[0] : bookmark.guides;
                return {
                    id: guide.id,
                    title: guide.title,
                    description: guide.description,
                    division: guide.division,
                    category: guide.category,
                    imageUrl: guide.image_url || null,
                    tags: guide.tags || [],
                    createdAt: guide.created_at,
                    updatedAt: guide.updated_at
                };
            });

        return guides;
    } catch (error) {
        console.error('Unexpected error fetching bookmarked guides:', error);
        return [];
    }
}

/**
 * Get bookmark IDs for the current user
 * @returns Array of guide IDs that are bookmarked
 */
export async function getBookmarkedGuideIds(): Promise<number[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return [];
        }

        const { data, error } = await supabase
            .from('user_bookmarks')
            .select('guide_id')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching bookmark IDs:', error);
            return [];
        }

        return (data || []).map(bookmark => bookmark.guide_id);
    } catch (error) {
        console.error('Unexpected error fetching bookmark IDs:', error);
        return [];
    }
}
