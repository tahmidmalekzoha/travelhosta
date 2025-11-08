"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    categoriesService,
    type CategoryRecord,
    type DivisionRecord,
    type TagRecord,
} from '../services/categoriesService';
import { logger } from '../utils/logger';

export type Category = CategoryRecord;
export type Division = DivisionRecord;
export type Tag = TagRecord;

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
    addTag: (name: string) => Promise<void>;
    removeTag: (id: string) => Promise<void>;
    setCategories: (categories: Category[]) => void;
    setDivisions: (divisions: Division[]) => void;
    setTags: (tags: Tag[]) => void;
    refreshCategories: () => Promise<void>;
    refreshDivisions: () => Promise<void>;
    refreshTags: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const sortByName = <T extends { name: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => a.name.localeCompare(b.name));

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await categoriesService.fetchCategories();
            setCategories(data);
        } catch (caught) {
            logger.error('Failed to fetch categories', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to fetch categories';
            setError(message);
            throw caught;
        }
    }, []);

    const fetchDivisions = useCallback(async () => {
        try {
            const data = await categoriesService.fetchDivisions();
            setDivisions(data);
        } catch (caught) {
            logger.error('Failed to fetch divisions', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to fetch divisions';
            setError(message);
            throw caught;
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            const data = await categoriesService.fetchTags();
            setTags(data);
        } catch (caught) {
            logger.error('Failed to fetch tags', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to fetch tags';
            setError(message);
            throw caught;
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                await Promise.all([fetchCategories(), fetchDivisions(), fetchTags()]);
            } catch {
                // Errors already logged and surfaced through state
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [fetchCategories, fetchDivisions, fetchTags]);

    const addCategory = useCallback(async (name: string) => {
        try {
            setError(null);
            const newCategory = await categoriesService.createCategory(name);
            setCategories(prev => sortByName([...prev, newCategory]));
        } catch (caught) {
            logger.error('Failed to add category', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to add category';
            setError(message);
            throw caught;
        }
    }, []);

    const removeCategory = useCallback(async (id: string) => {
        try {
            setError(null);
            await categoriesService.deleteCategory(id);
            setCategories(prev => prev.filter(category => category.id !== id));
        } catch (caught) {
            logger.error('Failed to remove category', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to remove category';
            setError(message);
            throw caught;
        }
    }, []);

    const addDivision = useCallback(async (name: string) => {
        try {
            setError(null);
            const newDivision = await categoriesService.createDivision(name);
            setDivisions(prev => sortByName([...prev, newDivision]));
        } catch (caught) {
            logger.error('Failed to add division', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to add division';
            setError(message);
            throw caught;
        }
    }, []);

    const removeDivision = useCallback(async (id: string) => {
        try {
            setError(null);
            await categoriesService.deleteDivision(id);
            setDivisions(prev => prev.filter(division => division.id !== id));
        } catch (caught) {
            logger.error('Failed to remove division', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to remove division';
            setError(message);
            throw caught;
        }
    }, []);

    const addTag = useCallback(async (name: string) => {
        try {
            setError(null);
            const newTag = await categoriesService.createTag(name);
            setTags(prev => sortByName([...prev, newTag]));
        } catch (caught) {
            logger.error('Failed to add tag', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to add tag';
            setError(message);
            throw caught;
        }
    }, []);

    const removeTag = useCallback(async (id: string) => {
        try {
            setError(null);
            await categoriesService.deleteTag(id);
            setTags(prev => prev.filter(tag => tag.id !== id));
        } catch (caught) {
            logger.error('Failed to remove tag', caught);
            const message = caught instanceof Error ? caught.message : 'Failed to remove tag';
            setError(message);
            throw caught;
        }
    }, []);

    const refreshCategories = useCallback(async () => {
        await fetchCategories();
    }, [fetchCategories]);

    const refreshDivisions = useCallback(async () => {
        await fetchDivisions();
    }, [fetchDivisions]);

    const refreshTags = useCallback(async () => {
        await fetchTags();
    }, [fetchTags]);

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
        refreshTags,
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
        refreshTags,
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
