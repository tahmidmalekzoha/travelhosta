"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { GUIDES_DATA } from '../constants';
import type { GuideData } from '../types';

// Constants for localStorage keys
const STORAGE_KEYS = {
    GUIDES: 'travelhosta_guides',
    FEATURED: 'travelhosta_featured_guides',
} as const;

const DEFAULT_FEATURED_IDS = [1, 2, 3, 4];
const MAX_FEATURED_GUIDES = 4;

interface GuidesContextType {
    guides: GuideData[];
    featuredGuideIds: number[];
    addGuide: (guide: Omit<GuideData, 'id'>) => void;
    updateGuide: (id: number, guide: Omit<GuideData, 'id'>) => void;
    deleteGuide: (id: number) => void;
    setFeaturedGuides: (ids: number[]) => void;
    getFeaturedGuides: () => GuideData[];
}

const GuidesContext = createContext<GuidesContextType | undefined>(undefined);

/**
 * Safely parses JSON from localStorage
 */
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed || defaultValue;
        }
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
    }
    return defaultValue;
};

/**
 * Safely saves data to localStorage
 */
const saveToStorage = (key: string, data: unknown): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

/**
 * Provider component for guides data and operations
 * Manages guides, featured guides, and persistence to localStorage
 */
export function GuidesProvider({ children }: { children: React.ReactNode }) {
    // Initialize with GUIDES_DATA to avoid empty state on first render
    const [guides, setGuides] = useState<GuideData[]>([...GUIDES_DATA]);
    const [featuredGuideIds, setFeaturedGuideIds] = useState<number[]>(DEFAULT_FEATURED_IDS);

    // Load guides from localStorage on mount
    useEffect(() => {
        const storedGuides = loadFromStorage<GuideData[]>(STORAGE_KEYS.GUIDES, []);
        if (storedGuides.length > 0) {
            setGuides(storedGuides);
        }
    }, []);

    // Load featured guides from localStorage on mount
    useEffect(() => {
        const storedFeatured = loadFromStorage<number[]>(STORAGE_KEYS.FEATURED, DEFAULT_FEATURED_IDS);
        if (Array.isArray(storedFeatured) && storedFeatured.length > 0) {
            setFeaturedGuideIds(storedFeatured);
        }
    }, []);

    // Persist guides to localStorage whenever they change
    useEffect(() => {
        if (guides.length > 0) {
            saveToStorage(STORAGE_KEYS.GUIDES, guides);
        }
    }, [guides]);

    // Persist featured guides to localStorage whenever they change
    useEffect(() => {
        if (featuredGuideIds.length > 0) {
            saveToStorage(STORAGE_KEYS.FEATURED, featuredGuideIds);
        }
    }, [featuredGuideIds]);

    // Generate a new unique ID for a guide
    const generateNewId = useCallback(() => {
        return Math.max(...guides.map(g => g.id), 0) + 1;
    }, [guides]);

    const addGuide = useCallback((guideData: Omit<GuideData, 'id'>) => {
        const newGuide: GuideData = {
            ...guideData,
            id: generateNewId(),
        };
        setGuides(prev => [newGuide, ...prev]);
    }, [generateNewId]);

    const updateGuide = useCallback((id: number, guideData: Omit<GuideData, 'id'>) => {
        setGuides(prev =>
            prev.map(guide =>
                guide.id === id ? { ...guideData, id } : guide
            )
        );
    }, []);

    const deleteGuide = useCallback((id: number) => {
        setGuides(prev => prev.filter(guide => guide.id !== id));
        // Remove from featured if it was featured
        setFeaturedGuideIds(prev => prev.filter(guideId => guideId !== id));
    }, []);

    const setFeaturedGuides = useCallback((ids: number[]) => {
        // Ensure no more than MAX_FEATURED_GUIDES are featured
        const limitedIds = ids.length > MAX_FEATURED_GUIDES 
            ? ids.slice(0, MAX_FEATURED_GUIDES) 
            : ids;
        setFeaturedGuideIds(limitedIds);
    }, []);

    const getFeaturedGuides = useCallback(() => {
        return guides
            .filter(guide => featuredGuideIds.includes(guide.id))
            .slice(0, MAX_FEATURED_GUIDES);
    }, [guides, featuredGuideIds]);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        guides,
        featuredGuideIds,
        addGuide,
        updateGuide,
        deleteGuide,
        setFeaturedGuides,
        getFeaturedGuides,
    }), [guides, featuredGuideIds, addGuide, updateGuide, deleteGuide, setFeaturedGuides, getFeaturedGuides]);

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
