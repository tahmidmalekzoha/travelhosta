"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { HeroImage } from '../types';
import type { Database } from '../types/supabase';

type DbHeroImage = Database['public']['Tables']['hero_images']['Row'];
type DbHeroImageInsert = Database['public']['Tables']['hero_images']['Insert'];

interface HeroContextType {
    heroImages: HeroImage[];
    activeHero: HeroImage | null;
    loading: boolean;
    error: string | null;
    addHeroImage: (hero: Omit<HeroImage, 'id' | 'uploadedAt'>) => Promise<void>;
    updateHeroImage: (id: string, hero: Partial<Omit<HeroImage, 'id' | 'uploadedAt'>>) => Promise<void>;
    deleteHeroImage: (id: string) => Promise<void>;
    setActiveHero: (id: string) => Promise<void>;
    refreshHeroImages: () => Promise<void>;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

/**
 * Convert database hero image to HeroImage format
 */
const dbHeroToHeroImage = (dbHero: DbHeroImage): HeroImage => {
    return {
        id: dbHero.id.toString(),
        imageUrl: dbHero.image_url,
        title: dbHero.title,
        subtitle: dbHero.subtitle,
        isActive: dbHero.is_active || false,
        uploadedAt: dbHero.created_at || new Date().toISOString(),
    };
};

/**
 * Convert HeroImage to database insert format
 */
const heroImageToDbInsert = (hero: Omit<HeroImage, 'id' | 'uploadedAt'>): Omit<DbHeroImageInsert, 'id' | 'created_at'> => {
    return {
        image_url: hero.imageUrl,
        title: hero.title,
        subtitle: hero.subtitle,
        is_active: hero.isActive,
    };
};

/**
 * Provider component for hero images data and operations
 * Manages hero images and syncs with Supabase
 */
export function HeroProvider({ children }: { children: React.ReactNode }) {
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch hero images from Supabase
    const fetchHeroImages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error: fetchError } = await supabase
                .from('hero_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const images = (data || []).map(dbHeroToHeroImage);
            setHeroImages(images);
        } catch (err) {
            console.error('Error fetching hero images:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch hero images');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load data on mount
    useEffect(() => {
        fetchHeroImages();
    }, [fetchHeroImages]);

    // Get active hero image
    const activeHero = useMemo(() => {
        return heroImages.find(hero => hero.isActive) || null;
    }, [heroImages]);

    // Add a new hero image
    const addHeroImage = useCallback(async (heroData: Omit<HeroImage, 'id' | 'uploadedAt'>) => {
        try {
            setError(null);
            const dbHero = heroImageToDbInsert(heroData);
            
            const { data, error: insertError } = await supabase
                .from('hero_images')
                .insert([dbHero])
                .select()
                .single();

            if (insertError) throw insertError;

            if (data) {
                const newHero = dbHeroToHeroImage(data);
                setHeroImages(prev => [newHero, ...prev]);
            }
        } catch (err) {
            console.error('Error adding hero image:', err);
            setError(err instanceof Error ? err.message : 'Failed to add hero image');
            throw err;
        }
    }, []);

    // Update an existing hero image
    const updateHeroImage = useCallback(async (id: string, heroData: Partial<Omit<HeroImage, 'id' | 'uploadedAt'>>) => {
        try {
            setError(null);
            const updateData: any = {};
            if (heroData.imageUrl !== undefined) updateData.image_url = heroData.imageUrl;
            if (heroData.title !== undefined) updateData.title = heroData.title;
            if (heroData.subtitle !== undefined) updateData.subtitle = heroData.subtitle;
            if (heroData.isActive !== undefined) updateData.is_active = heroData.isActive;
            
            const { data, error: updateError } = await supabase
                .from('hero_images')
                .update(updateData)
                .eq('id', parseInt(id))
                .select()
                .single();

            if (updateError) throw updateError;

            if (data) {
                const updatedHero = dbHeroToHeroImage(data);
                setHeroImages(prev => prev.map(hero => 
                    hero.id === id ? updatedHero : hero
                ));
            }
        } catch (err) {
            console.error('Error updating hero image:', err);
            setError(err instanceof Error ? err.message : 'Failed to update hero image');
            throw err;
        }
    }, []);

    // Delete a hero image
    const deleteHeroImage = useCallback(async (id: string) => {
        try {
            setError(null);
            
            const { error: deleteError } = await supabase
                .from('hero_images')
                .delete()
                .eq('id', parseInt(id));

            if (deleteError) throw deleteError;

            setHeroImages(prev => prev.filter(hero => hero.id !== id));
        } catch (err) {
            console.error('Error deleting hero image:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete hero image');
            throw err;
        }
    }, []);

    // Set active hero image
    const setActiveHero = useCallback(async (id: string) => {
        try {
            setError(null);
            
            // First, set all heroes to inactive
            await supabase
                .from('hero_images')
                .update({ is_active: false })
                .neq('id', 0);

            // Then set the selected one to active
            const { data, error: updateError } = await supabase
                .from('hero_images')
                .update({ is_active: true })
                .eq('id', parseInt(id))
                .select();

            if (updateError) throw updateError;

            // Update local state
            setHeroImages(prev => prev.map(hero => ({
                ...hero,
                isActive: hero.id === id
            })));
        } catch (err) {
            console.error('Error setting active hero:', err);
            setError(err instanceof Error ? err.message : 'Failed to set active hero');
            throw err;
        }
    }, []);

    // Refresh hero images from database
    const refreshHeroImages = useCallback(async () => {
        await fetchHeroImages();
    }, [fetchHeroImages]);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        heroImages,
        activeHero,
        loading,
        error,
        addHeroImage,
        updateHeroImage,
        deleteHeroImage,
        setActiveHero,
        refreshHeroImages,
    }), [heroImages, activeHero, loading, error, addHeroImage, updateHeroImage, deleteHeroImage, setActiveHero, refreshHeroImages]);

    return (
        <HeroContext.Provider value={value}>
            {children}
        </HeroContext.Provider>
    );
}

/**
 * Hook to access hero context
 * Must be used within a HeroProvider
 */
export function useHero() {
    const context = useContext(HeroContext);
    if (context === undefined) {
        throw new Error('useHero must be used within a HeroProvider');
    }
    return context;
}
