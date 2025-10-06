"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import type { GuideData } from '../types';
import type { Database } from '../types/supabase';

type DbGuide = Database['public']['Tables']['guides']['Row'];
type DbGuideInsert = Database['public']['Tables']['guides']['Insert'];

const MAX_FEATURED_GUIDES = 4;

interface GuidesContextType {
    guides: GuideData[];
    featuredGuideIds: number[];
    loading: boolean;
    error: string | null;
    addGuide: (guide: Omit<GuideData, 'id'>) => Promise<void>;
    updateGuide: (id: number, guide: Omit<GuideData, 'id'>) => Promise<void>;
    deleteGuide: (id: number) => Promise<void>;
    setFeaturedGuides: (ids: number[]) => Promise<void>;
    getFeaturedGuides: () => GuideData[];
    refreshGuides: () => Promise<void>;
}

const GuidesContext = createContext<GuidesContextType | undefined>(undefined);

/**
 * Convert database guide to GuideData format
 */
const dbGuideToGuideData = (dbGuide: DbGuide): GuideData => {
    return {
        id: dbGuide.id,
        title: dbGuide.title,
        description: dbGuide.description,
        division: dbGuide.division,
        category: dbGuide.category,
        imageUrl: dbGuide.image_url,
        tags: dbGuide.tags || undefined,
        content: (dbGuide.content as any) || undefined,
        itinerary: (dbGuide.itinerary as any) || undefined,
        titleBn: dbGuide.title_bn || undefined,
        descriptionBn: dbGuide.description_bn || undefined,
        contentBn: (dbGuide.content_bn as any) || undefined,
    };
};

/**
 * Convert GuideData to database insert format
 */
const guideDataToDbInsert = (guide: Omit<GuideData, 'id'>): Omit<DbGuideInsert, 'id'> => {
    // Helper function to check if image URL is dummy/placeholder
    const isDummyImage = (url: string): boolean => {
        if (!url) return true;
        const lowerUrl = url.toLowerCase();
        return lowerUrl === 'dummy.jpg' || 
               lowerUrl === '/images/dummy.jpg' || 
               lowerUrl === 'images/dummy.jpg' || 
               lowerUrl.endsWith('dummy.jpg');
    };

    // Convert empty or dummy image URLs to null
    const imageUrl = guide.imageUrl && !isDummyImage(guide.imageUrl) ? guide.imageUrl : null;

    return {
        title: guide.title,
        description: guide.description,
        division: guide.division,
        category: guide.category,
        image_url: imageUrl,
        tags: guide.tags || null,
        content: (guide.content as any) || null,
        itinerary: (guide.itinerary as any) || null,
        title_bn: guide.titleBn || null,
        description_bn: guide.descriptionBn || null,
        content_bn: (guide.contentBn as any) || null,
    };
};

/**
 * Provider component for guides data and operations
 * Manages guides, featured guides, and syncs with Supabase
 */
export function GuidesProvider({ children }: { children: React.ReactNode }) {
    const [guides, setGuides] = useState<GuideData[]>([]);
    const [featuredGuideIds, setFeaturedGuideIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch guides from Supabase
    const fetchGuides = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error: fetchError } = await supabase
                .from('guides')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const guidesData = (data || []).map(dbGuideToGuideData);
            setGuides(guidesData);
        } catch (err) {
            console.error('Error fetching guides:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch guides');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch featured guides from Supabase
    const fetchFeaturedGuides = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('featured_guides')
                .select('guide_id')
                .order('position', { ascending: true })
                .limit(MAX_FEATURED_GUIDES);

            if (fetchError) throw fetchError;

            const ids = (data || []).map(item => item.guide_id);
            setFeaturedGuideIds(ids);
        } catch (err) {
            console.error('Error fetching featured guides:', err);
        }
    }, []);

    // Load data on mount
    useEffect(() => {
        fetchGuides();
        fetchFeaturedGuides();
    }, [fetchGuides, fetchFeaturedGuides]);

    // Add a new guide
    const addGuide = useCallback(async (guideData: Omit<GuideData, 'id'>) => {
        try {
            setError(null);
            const dbGuide = guideDataToDbInsert(guideData);
            
            const { data, error: insertError } = await supabase
                .from('guides')
                .insert([dbGuide])
                .select()
                .single();

            if (insertError) throw insertError;

            if (data) {
                const newGuide = dbGuideToGuideData(data);
                setGuides(prev => [newGuide, ...prev]);
            }
        } catch (err) {
            console.error('Error adding guide:', err);
            setError(err instanceof Error ? err.message : 'Failed to add guide');
            throw err;
        }
    }, []);

    // Update an existing guide
    const updateGuide = useCallback(async (id: number, guideData: Omit<GuideData, 'id'>) => {
        try {
            setError(null);
            const dbGuide = guideDataToDbInsert(guideData);
            
            const { data, error: updateError } = await supabase
                .from('guides')
                .update(dbGuide)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;

            if (data) {
                const updatedGuide = dbGuideToGuideData(data);
                setGuides(prev => prev.map(guide => 
                    guide.id === id ? updatedGuide : guide
                ));
            }
        } catch (err) {
            console.error('Error updating guide:', err);
            setError(err instanceof Error ? err.message : 'Failed to update guide');
            throw err;
        }
    }, []);

    // Delete a guide
    const deleteGuide = useCallback(async (id: number) => {
        try {
            setError(null);
            
            const { error: deleteError } = await supabase
                .from('guides')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setGuides(prev => prev.filter(guide => guide.id !== id));
            setFeaturedGuideIds(prev => prev.filter(guideId => guideId !== id));
        } catch (err) {
            console.error('Error deleting guide:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete guide');
            throw err;
        }
    }, []);

    // Set featured guides
    const setFeaturedGuides = useCallback(async (ids: number[]) => {
        try {
            setError(null);
            const limitedIds = ids.slice(0, MAX_FEATURED_GUIDES);

            // Delete all existing featured guides
            await supabase.from('featured_guides').delete().neq('id', 0);

            // Insert new featured guides
            const featuredData = limitedIds.map((guideId, index) => ({
                guide_id: guideId,
                position: index + 1,
            }));

            const { error: insertError } = await supabase
                .from('featured_guides')
                .insert(featuredData);

            if (insertError) throw insertError;

            setFeaturedGuideIds(limitedIds);
        } catch (err) {
            console.error('Error setting featured guides:', err);
            setError(err instanceof Error ? err.message : 'Failed to set featured guides');
            throw err;
        }
    }, []);

    // Get featured guides
    const getFeaturedGuides = useCallback(() => {
        return guides
            .filter(guide => featuredGuideIds.includes(guide.id))
            .slice(0, MAX_FEATURED_GUIDES);
    }, [guides, featuredGuideIds]);

    // Refresh guides from database
    const refreshGuides = useCallback(async () => {
        await fetchGuides();
        await fetchFeaturedGuides();
    }, [fetchGuides, fetchFeaturedGuides]);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        guides,
        featuredGuideIds,
        loading,
        error,
        addGuide,
        updateGuide,
        deleteGuide,
        setFeaturedGuides,
        getFeaturedGuides,
        refreshGuides,
    }), [guides, featuredGuideIds, loading, error, addGuide, updateGuide, deleteGuide, setFeaturedGuides, getFeaturedGuides, refreshGuides]);

    return (
        <GuidesContext.Provider value={value}>
            {children}
        </GuidesContext.Provider>
    );
}

/**
 * Hook to access guides context
 * Must be used within a GuidesProvider
 */
export function useGuides() {
    const context = useContext(GuidesContext);
    if (context === undefined) {
        throw new Error('useGuides must be used within a GuidesProvider');
    }
    return context;
}
