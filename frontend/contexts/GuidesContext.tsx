"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { GuideData } from '../types';
import { guidesService } from '../services/guidesService';
import { logger } from '../utils/logger';

const FEATURED_LIMIT = guidesService.MAX_FEATURED_GUIDES;

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
 * Provider component for guides data and operations
 * Manages guides, featured guides, and syncs via the guides service
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

            const nextGuides = await guidesService.fetchGuides();
            setGuides(nextGuides);
        } catch (error) {
            logger.error('Failed to fetch guides', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch guides');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFeaturedGuides = useCallback(async () => {
        try {
            const ids = await guidesService.fetchFeaturedGuideIds();
            setFeaturedGuideIds(ids);
        } catch (error) {
            logger.error('Failed to fetch featured guides', error);
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
            const newGuide = await guidesService.createGuide(guideData);
            setGuides(prev => [newGuide, ...prev]);
        } catch (error) {
            logger.error('Failed to add guide', error);
            const message = error instanceof Error ? error.message : 'Failed to add guide';
            setError(message);
            throw error;
        }
    }, []);

    // Update an existing guide
    const updateGuide = useCallback(async (id: number, guideData: Omit<GuideData, 'id'>) => {
        try {
            setError(null);
            const updatedGuide = await guidesService.updateGuide(id, guideData);
            setGuides(prev => prev.map(guide => (guide.id === id ? updatedGuide : guide)));
        } catch (error) {
            logger.error('Failed to update guide', error);
            setError(error instanceof Error ? error.message : 'Failed to update guide');
            throw error;
        }
    }, []);

    // Delete a guide
    const deleteGuide = useCallback(async (id: number) => {
        try {
            setError(null);
            await guidesService.deleteGuide(id);
            setGuides(prev => prev.filter(guide => guide.id !== id));
            setFeaturedGuideIds(prev => prev.filter(guideId => guideId !== id));
        } catch (error) {
            logger.error('Failed to delete guide', error);
            setError(error instanceof Error ? error.message : 'Failed to delete guide');
            throw error;
        }
    }, []);

    // Set featured guides
    const setFeaturedGuides = useCallback(async (ids: number[]) => {
        try {
            setError(null);
            const limitedIds = await guidesService.setFeaturedGuides(ids);
            setFeaturedGuideIds(limitedIds);
        } catch (error) {
            logger.error('Failed to set featured guides', error);
            setError(error instanceof Error ? error.message : 'Failed to set featured guides');
            throw error;
        }
    }, []);

    // Get featured guides
    const getFeaturedGuides = useCallback(() => {
        return guides
            .filter(guide => featuredGuideIds.includes(guide.id))
            .slice(0, FEATURED_LIMIT);
    }, [guides, featuredGuideIds]);

    // Refresh guides from database
    const refreshGuides = useCallback(async () => {
        try {
            const { guides: nextGuides, featuredIds } = await guidesService.refreshGuides();
            setGuides(nextGuides);
            setFeaturedGuideIds(featuredIds);
        } catch (error) {
            logger.error('Failed to refresh guides', error);
            setError(error instanceof Error ? error.message : 'Failed to refresh guides');
            throw error;
        }
    }, []);

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
