/**
 * Categories, divisions, and tags data service
 */

import { supabase } from '../utils/supabase';
import type { Database } from '../types/supabase';
import { handleSupabaseError, withSupabase } from './serviceHelpers';

type DbCategory = Database['public']['Tables']['categories']['Row'];
type DbDivision = Database['public']['Tables']['divisions']['Row'];
type DbTag = Database['public']['Tables']['tags']['Row'];

type DbInsert<T extends { Insert: any }> = T['Insert'];

type CategoryInsert = DbInsert<Database['public']['Tables']['categories']>;
type DivisionInsert = DbInsert<Database['public']['Tables']['divisions']>;
type TagInsert = DbInsert<Database['public']['Tables']['tags']>;

export interface CategoryRecord {
    id: string;
    name: string;
}

export interface DivisionRecord {
    id: string;
    name: string;
}

export interface TagRecord {
    id: string;
    name: string;
}

const CATEGORIES_ENDPOINT = '/categories';
const DIVISIONS_ENDPOINT = '/divisions';
const TAGS_ENDPOINT = '/tags';

const mapCategory = (category: DbCategory): CategoryRecord => ({
    id: category.id.toString(),
    name: category.name,
});

const mapDivision = (division: DbDivision): DivisionRecord => ({
    id: division.id.toString(),
    name: division.name,
});

const mapTag = (tag: DbTag): TagRecord => ({
    id: tag.id.toString(),
    name: tag.name,
});

export async function fetchCategories(): Promise<CategoryRecord[]> {
    const data = await withSupabase<DbCategory[]>({
        action: 'fetch categories',
        endpoint: CATEGORIES_ENDPOINT,
        method: 'GET',
        fallbackMessage: 'Failed to fetch categories',
    }, () =>
        supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })
    );

    return (data ?? []).map(mapCategory);
}

export async function fetchDivisions(): Promise<DivisionRecord[]> {
    const data = await withSupabase<DbDivision[]>({
        action: 'fetch divisions',
        endpoint: DIVISIONS_ENDPOINT,
        method: 'GET',
        fallbackMessage: 'Failed to fetch divisions',
    }, () =>
        supabase
            .from('divisions')
            .select('*')
            .order('name', { ascending: true })
    );

    return (data ?? []).map(mapDivision);
}

export async function fetchTags(): Promise<TagRecord[]> {
    const data = await withSupabase<DbTag[]>({
        action: 'fetch tags',
        endpoint: TAGS_ENDPOINT,
        method: 'GET',
        fallbackMessage: 'Failed to fetch tags',
    }, () =>
        supabase
            .from('tags')
            .select('*')
            .order('name', { ascending: true })
    );

    return (data ?? []).map(mapTag);
}

export async function createCategory(name: string): Promise<CategoryRecord> {
    const payload: CategoryInsert = { name };

    const data = await withSupabase<DbCategory>({
        action: 'create category',
        endpoint: CATEGORIES_ENDPOINT,
        method: 'POST',
        payload,
        fallbackMessage: 'Failed to create category',
        successStatus: 201,
    }, () =>
        supabase
            .from('categories')
            .insert(payload)
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('create category', new Error('No category returned from insert'));
    }

    return mapCategory(data);
}

export async function deleteCategory(id: string): Promise<void> {
    await withSupabase<null>({
        action: 'delete category',
        endpoint: `${CATEGORIES_ENDPOINT}/${id}`,
        method: 'DELETE',
        fallbackMessage: 'Failed to delete category',
    }, () =>
        supabase
            .from('categories')
            .delete()
            .eq('id', parseInt(id, 10))
    );
}

export async function createDivision(name: string): Promise<DivisionRecord> {
    const payload: DivisionInsert = { name };

    const data = await withSupabase<DbDivision>({
        action: 'create division',
        endpoint: DIVISIONS_ENDPOINT,
        method: 'POST',
        payload,
        fallbackMessage: 'Failed to create division',
        successStatus: 201,
    }, () =>
        supabase
            .from('divisions')
            .insert(payload)
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('create division', new Error('No division returned from insert'));
    }

    return mapDivision(data);
}

export async function deleteDivision(id: string): Promise<void> {
    await withSupabase<null>({
        action: 'delete division',
        endpoint: `${DIVISIONS_ENDPOINT}/${id}`,
        method: 'DELETE',
        fallbackMessage: 'Failed to delete division',
    }, () =>
        supabase
            .from('divisions')
            .delete()
            .eq('id', parseInt(id, 10))
    );
}

export async function createTag(name: string): Promise<TagRecord> {
    const payload: TagInsert = { name };

    const data = await withSupabase<DbTag>({
        action: 'create tag',
        endpoint: TAGS_ENDPOINT,
        method: 'POST',
        payload,
        fallbackMessage: 'Failed to create tag',
        successStatus: 201,
    }, () =>
        supabase
            .from('tags')
            .insert(payload)
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('create tag', new Error('No tag returned from insert'));
    }

    return mapTag(data);
}

export async function deleteTag(id: string): Promise<void> {
    await withSupabase<null>({
        action: 'delete tag',
        endpoint: `${TAGS_ENDPOINT}/${id}`,
        method: 'DELETE',
        fallbackMessage: 'Failed to delete tag',
    }, () =>
        supabase
            .from('tags')
            .delete()
            .eq('id', parseInt(id, 10))
    );
}

export async function refreshTaxonomy(): Promise<{
    categories: CategoryRecord[];
    divisions: DivisionRecord[];
    tags: TagRecord[];
}> {
    const [categories, divisions, tags] = await Promise.all([
        fetchCategories(),
        fetchDivisions(),
        fetchTags(),
    ]);

    return { categories, divisions, tags };
}

export const categoriesService = {
    fetchCategories,
    fetchDivisions,
    fetchTags,
    createCategory,
    deleteCategory,
    createDivision,
    deleteDivision,
    createTag,
    deleteTag,
    refreshTaxonomy,
};

export default categoriesService;
