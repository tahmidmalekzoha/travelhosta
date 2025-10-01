"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GUIDES_DATA } from '../constants';
import type { GuideData } from '../types';

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

export function GuidesProvider({ children }: { children: React.ReactNode }) {
    // Initialize with GUIDES_DATA to avoid empty state on first render
    const [guides, setGuides] = useState<GuideData[]>([...GUIDES_DATA]);
    // Initialize featured guides with first 4 guides by default
    const [featuredGuideIds, setFeaturedGuideIds] = useState<number[]>([1, 2, 3, 4]);

    // Load guides from localStorage on mount, if available
    useEffect(() => {
        const storedGuides = localStorage.getItem('travelhosta_guides');
        if (storedGuides) {
            try {
                const parsed = JSON.parse(storedGuides);
                if (parsed && parsed.length > 0) {
                    setGuides(parsed);
                }
            } catch (error) {
                console.error('Error parsing stored guides:', error);
                // Keep the default GUIDES_DATA already set in state
            }
        }
    }, []);

    // Load featured guides from localStorage on mount
    useEffect(() => {
        const storedFeatured = localStorage.getItem('travelhosta_featured_guides');
        if (storedFeatured) {
            try {
                const parsed = JSON.parse(storedFeatured);
                if (Array.isArray(parsed)) {
                    setFeaturedGuideIds(parsed);
                }
            } catch (error) {
                console.error('Error parsing stored featured guides:', error);
            }
        }
    }, []);

    // Persist guides to localStorage whenever they change
    useEffect(() => {
        if (guides.length > 0) {
            localStorage.setItem('travelhosta_guides', JSON.stringify(guides));
        }
    }, [guides]);

    // Persist featured guides to localStorage whenever they change
    useEffect(() => {
        if (featuredGuideIds.length > 0) {
            localStorage.setItem('travelhosta_featured_guides', JSON.stringify(featuredGuideIds));
        }
    }, [featuredGuideIds]);

    const addGuide = (guideData: Omit<GuideData, 'id'>) => {
        const newId = Math.max(...guides.map(g => g.id), 0) + 1;
        const newGuide: GuideData = {
            ...guideData,
            id: newId,
        };
        setGuides(prev => [newGuide, ...prev]);
    };

    const updateGuide = (id: number, guideData: Omit<GuideData, 'id'>) => {
        setGuides(prev =>
            prev.map(guide =>
                guide.id === id ? { ...guideData, id } : guide
            )
        );
    };

    const deleteGuide = (id: number) => {
        setGuides(prev => prev.filter(guide => guide.id !== id));
        // Remove from featured if it was featured
        setFeaturedGuideIds(prev => prev.filter(guideId => guideId !== id));
    };

    const setFeaturedGuides = (ids: number[]) => {
        // Ensure exactly 4 guides are featured
        if (ids.length > 4) {
            setFeaturedGuideIds(ids.slice(0, 4));
        } else {
            setFeaturedGuideIds(ids);
        }
    };

    const getFeaturedGuides = () => {
        return guides.filter(guide => featuredGuideIds.includes(guide.id)).slice(0, 4);
    };

    const value = {
        guides,
        featuredGuideIds,
        addGuide,
        updateGuide,
        deleteGuide,
        setFeaturedGuides,
        getFeaturedGuides,
    };

    return (
        <GuidesContext.Provider value={value}>
            {children}
        </GuidesContext.Provider>
    );
}

export function useGuides() {
    const context = useContext(GuidesContext);
    if (context === undefined) {
        throw new Error('useGuides must be used within a GuidesProvider');
    }
    return context;
}
