"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { HeroImage } from '../types';
import { heroService } from '../services/heroService';
import { logger } from '../utils/logger';

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

export function HeroProvider({ children }: { children: React.ReactNode }) {
    const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHeroImages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const images = await heroService.fetchHeroImages();
            setHeroImages(images);
        } catch (caught) {
            logger.error('Failed to fetch hero images', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to fetch hero images';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHeroImages();
    }, [fetchHeroImages]);

    const activeHero = useMemo(() => {
        return heroImages.find(hero => hero.isActive) || null;
    }, [heroImages]);

    const addHeroImage = useCallback(async (heroData: Omit<HeroImage, 'id' | 'uploadedAt'>) => {
        try {
            setError(null);
            const newHero = await heroService.createHeroImage(heroData);
            setHeroImages(prev => [newHero, ...prev]);
        } catch (caught) {
            logger.error('Failed to add hero image', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to add hero image';
            setError(message);
            throw caught;
        }
    }, []);

    const updateHeroImage = useCallback(async (id: string, heroData: Partial<Omit<HeroImage, 'id' | 'uploadedAt'>>) => {
        try {
            setError(null);
            const updatedHero = await heroService.updateHeroImage(id, heroData);
            setHeroImages(prev => prev.map(hero => (hero.id === id ? updatedHero : hero)));
        } catch (caught) {
            logger.error('Failed to update hero image', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to update hero image';
            setError(message);
            throw caught;
        }
    }, []);

    const deleteHeroImage = useCallback(async (id: string) => {
        try {
            setError(null);
            await heroService.deleteHeroImage(id);
            setHeroImages(prev => prev.filter(hero => hero.id !== id));
        } catch (caught) {
            logger.error('Failed to delete hero image', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to delete hero image';
            setError(message);
            throw caught;
        }
    }, []);

    const setActiveHero = useCallback(async (id: string) => {
        try {
            setError(null);
            await heroService.setActiveHero(id);
            setHeroImages(prev => prev.map(hero => ({
                ...hero,
                isActive: hero.id === id,
            })));
        } catch (caught) {
            logger.error('Failed to set active hero', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to set active hero';
            setError(message);
            throw caught;
        }
    }, []);

    const refreshHeroImages = useCallback(async () => {
        try {
            const images = await heroService.refreshHeroImages();
            setHeroImages(images);
        } catch (caught) {
            logger.error('Failed to refresh hero images', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to refresh hero images';
            setError(message);
            throw caught;
        }
    }, []);

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

export function useHero() {
    const context = useContext(HeroContext);
    if (context === undefined) {
        throw new Error('useHero must be used within a HeroProvider');
    }
    return context;
}
