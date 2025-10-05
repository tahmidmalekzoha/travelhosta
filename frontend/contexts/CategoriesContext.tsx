"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabase';

export interface Category {
    id: string;
    name: string;
}

export interface Division {
    id: string;
    name: string;
}

export interface Tag {
    id: string;
    name: string;
}

interface CategoriesContextType {
    categories: Category[];
    divisions: Division[];
    tags: Tag[];
    loading: boolean;
    error: string | null;
    addCategory: (name: string) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
    addDivision: (name: string) => Promise<void>;
    removeDivision: (id: string) => Promise<void>;
    addTag: (name: string) => void;
    removeTag: (id: string) => void;
    setCategories: (categories: Category[]) => void;
    setDivisions: (divisions: Division[]) => void;
    setTags: (tags: Tag[]) => void;
    refreshCategories: () => Promise<void>;
    refreshDivisions: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const DEFAULT_TAGS: Tag[] = [
    { id: 'tag-1', name: 'Family Friendly' },
    { id: 'tag-2', name: 'Budget' },
    { id: 'tag-3', name: 'Luxury' },
    { id: 'tag-4', name: 'Solo Travel' },
    { id: 'tag-5', name: 'Weekend' },
    { id: 'tag-6', name: 'Photography' }
];

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [tags, setTags] = useState<Tag[]>([...DEFAULT_TAGS]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (fetchError) throw fetchError;

            const categoriesData = (data || []).map(cat => ({
                id: cat.id.toString(),
                name: cat.name
            }));
            
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        }
    }, []);

    const fetchDivisions = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('divisions')
                .select('*')
                .order('name', { ascending: true });

            if (fetchError) throw fetchError;

            const divisionsData = (data || []).map(div => ({
                id: div.id.toString(),
                name: div.name
            }));
            
            setDivisions(divisionsData);
        } catch (err) {
            console.error('Error fetching divisions:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch divisions');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCategories(), fetchDivisions()]);
            setLoading(false);
        };
        loadData();
    }, [fetchCategories, fetchDivisions]);

    useEffect(() => {
        const storedTags = localStorage.getItem('travelhosta_tags');
        if (storedTags) {
            try {
                const parsed = JSON.parse(storedTags);
                if (parsed && Array.isArray(parsed)) {
                    setTags(parsed);
                }
            } catch (error) {
                console.error('Error parsing stored tags:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (tags.length > 0) {
            localStorage.setItem('travelhosta_tags', JSON.stringify(tags));
        }
    }, [tags]);

    const addCategory = useCallback(async (name: string) => {
        try {
            setError(null);
            const { data, error: insertError } = await supabase
                .from('categories')
                .insert([{ name }])
                .select()
                .single();

            if (insertError) throw insertError;

            if (data) {
                const newCategory: Category = {
                    id: data.id.toString(),
                    name: data.name
                };
                setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
            }
        } catch (err) {
            console.error('Error adding category:', err);
            setError(err instanceof Error ? err.message : 'Failed to add category');
            throw err;
        }
    }, []);

    const removeCategory = useCallback(async (id: string) => {
        try {
            setError(null);
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', parseInt(id));

            if (deleteError) throw deleteError;

            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            console.error('Error removing category:', err);
            setError(err instanceof Error ? err.message : 'Failed to remove category');
            throw err;
        }
    }, []);

    const addDivision = useCallback(async (name: string) => {
        try {
            setError(null);
            const { data, error: insertError } = await supabase
                .from('divisions')
                .insert([{ name }])
                .select()
                .single();

            if (insertError) throw insertError;

            if (data) {
                const newDivision: Division = {
                    id: data.id.toString(),
                    name: data.name
                };
                setDivisions(prev => [...prev, newDivision].sort((a, b) => a.name.localeCompare(b.name)));
            }
        } catch (err) {
            console.error('Error adding division:', err);
            setError(err instanceof Error ? err.message : 'Failed to add division');
            throw err;
        }
    }, []);

    const removeDivision = useCallback(async (id: string) => {
        try {
            setError(null);
            const { error: deleteError } = await supabase
                .from('divisions')
                .delete()
                .eq('id', parseInt(id));

            if (deleteError) throw deleteError;

            setDivisions(prev => prev.filter(div => div.id !== id));
        } catch (err) {
            console.error('Error removing division:', err);
            setError(err instanceof Error ? err.message : 'Failed to remove division');
            throw err;
        }
    }, []);

    const addTag = useCallback((name: string) => {
        const newTag: Tag = {
            id: `tag-${Date.now()}`,
            name
        };
        setTags(prev => [...prev, newTag]);
    }, []);

    const removeTag = useCallback((id: string) => {
        setTags(prev => prev.filter(tag => tag.id !== id));
    }, []);

    const refreshCategories = useCallback(async () => {
        await fetchCategories();
    }, [fetchCategories]);

    const refreshDivisions = useCallback(async () => {
        await fetchDivisions();
    }, [fetchDivisions]);

    const value = useMemo(() => ({
        categories,
        divisions,
        tags,
        loading,
        error,
        addCategory,
        removeCategory,
        addDivision,
        removeDivision,
        addTag,
        removeTag,
        setCategories,
        setDivisions,
        setTags,
        refreshCategories,
        refreshDivisions,
    }), [
        categories,
        divisions,
        tags,
        loading,
        error,
        addCategory,
        removeCategory,
        addDivision,
        removeDivision,
        addTag,
        removeTag,
        refreshCategories,
        refreshDivisions,
    ]);

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
