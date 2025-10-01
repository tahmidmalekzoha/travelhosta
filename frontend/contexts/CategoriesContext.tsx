"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Category {
    id: string;
    name: string;
}

export interface Division {
    id: string;
    name: string;
}

interface CategoriesContextType {
    categories: Category[];
    divisions: Division[];
    addCategory: (name: string) => void;
    removeCategory: (id: string) => void;
    addDivision: (name: string) => void;
    removeDivision: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Default categories and divisions
const DEFAULT_CATEGORIES: Category[] = [
    { id: 'cat-1', name: 'Day Tour' },
    { id: 'cat-2', name: 'Camping' },
    { id: 'cat-3', name: 'Trekking' },
    { id: 'cat-4', name: 'Staycation' },
    { id: 'cat-5', name: 'Adventure' },
    { id: 'cat-6', name: 'Cultural' },
    { id: 'cat-7', name: 'Beach' }
];

const DEFAULT_DIVISIONS: Division[] = [
    { id: 'div-1', name: 'Dhaka' },
    { id: 'div-2', name: 'Chittagong' },
    { id: 'div-3', name: 'Khulna' },
    { id: 'div-4', name: 'Rajshahi' },
    { id: 'div-5', name: 'Sylhet' },
    { id: 'div-6', name: 'Barisal' },
    { id: 'div-7', name: 'Rangpur' }
];

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([...DEFAULT_CATEGORIES]);
    const [divisions, setDivisions] = useState<Division[]>([...DEFAULT_DIVISIONS]);

    // Load categories from localStorage on mount
    useEffect(() => {
        const storedCategories = localStorage.getItem('travelhosta_categories');
        if (storedCategories) {
            try {
                const parsed = JSON.parse(storedCategories);
                if (parsed && parsed.length > 0) {
                    setCategories(parsed);
                }
            } catch (error) {
                console.error('Error parsing stored categories:', error);
            }
        }
    }, []);

    // Load divisions from localStorage on mount
    useEffect(() => {
        const storedDivisions = localStorage.getItem('travelhosta_divisions');
        if (storedDivisions) {
            try {
                const parsed = JSON.parse(storedDivisions);
                if (parsed && parsed.length > 0) {
                    setDivisions(parsed);
                }
            } catch (error) {
                console.error('Error parsing stored divisions:', error);
            }
        }
    }, []);

    // Persist categories to localStorage whenever they change
    useEffect(() => {
        if (categories.length > 0) {
            localStorage.setItem('travelhosta_categories', JSON.stringify(categories));
        }
    }, [categories]);

    // Persist divisions to localStorage whenever they change
    useEffect(() => {
        if (divisions.length > 0) {
            localStorage.setItem('travelhosta_divisions', JSON.stringify(divisions));
        }
    }, [divisions]);

    const addCategory = (name: string) => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: name.trim(),
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const removeCategory = (id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const addDivision = (name: string) => {
        const newDivision: Division = {
            id: `div-${Date.now()}`,
            name: name.trim(),
        };
        setDivisions(prev => [...prev, newDivision]);
    };

    const removeDivision = (id: string) => {
        setDivisions(prev => prev.filter(div => div.id !== id));
    };

    const value = {
        categories,
        divisions,
        addCategory,
        removeCategory,
        addDivision,
        removeDivision,
    };

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    const context = useContext(CategoriesContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within a CategoriesProvider');
    }
    return context;
}
