"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GUIDES_DATA } from '../constants';
import type { GuideData } from '../types';

interface GuidesContextType {
    guides: GuideData[];
    addGuide: (guide: Omit<GuideData, 'id'>) => void;
    updateGuide: (id: number, guide: Omit<GuideData, 'id'>) => void;
    deleteGuide: (id: number) => void;
}

const GuidesContext = createContext<GuidesContextType | undefined>(undefined);

export function GuidesProvider({ children }: { children: React.ReactNode }) {
    const [guides, setGuides] = useState<GuideData[]>([]);

    // Initialize with existing guides from constants
    useEffect(() => {
        const storedGuides = localStorage.getItem('travelhosta_guides');
        if (storedGuides) {
            try {
                setGuides(JSON.parse(storedGuides));
            } catch (error) {
                console.error('Error parsing stored guides:', error);
                setGuides([...GUIDES_DATA]);
            }
        } else {
            setGuides([...GUIDES_DATA]);
        }
    }, []);

    // Persist guides to localStorage whenever they change
    useEffect(() => {
        if (guides.length > 0) {
            localStorage.setItem('travelhosta_guides', JSON.stringify(guides));
        }
    }, [guides]);

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
    };

    const value = {
        guides,
        addGuide,
        updateGuide,
        deleteGuide,
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
