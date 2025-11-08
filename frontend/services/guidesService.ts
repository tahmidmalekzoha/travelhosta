/**
 * Guides data service
 * Encapsulates Supabase operations for guides and featured guides
 */

import { supabase } from '../utils/supabase';
import type { GuideData } from '../types';
import type { Database } from '../types/supabase';
import { handleSupabaseError, withSupabase } from './serviceHelpers';
import { logger } from '../utils/logger';

type DbGuide = Database['public']['Tables']['guides']['Row'];
type DbGuideInsert = Database['public']['Tables']['guides']['Insert'];
type DbFeaturedGuide = Database['public']['Tables']['featured_guides']['Row'];

type GuideInsertPayload = Omit<DbGuideInsert, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'last_edited_by' | 'last_edited_at'>;

const GUIDES_ENDPOINT = '/guides';
const FEATURED_ENDPOINT = '/featured-guides';
const MAX_FEATURED_GUIDES = 4;

const isDummyImage = (url: string): boolean => {
    if (!url) return true;
    const lowerUrl = url.toLowerCase();
    return (
        lowerUrl === 'dummy.jpg' ||
        lowerUrl === '/images/dummy.jpg' ||
        lowerUrl === 'images/dummy.jpg' ||
        lowerUrl.endsWith('dummy.jpg')
    );
};

const serializeContent = (content: GuideData['content'] | GuideData['itinerary'] | GuideData['contentBn']): any => {
    if (!content) return null;
    if (Array.isArray(content) && content.length === 0) return null;

    if (Array.isArray(content)) {
        return content;
    }

    if (typeof content === 'string') {
        try {
            return JSON.parse(content);
        } catch (error) {
            logger.warn('Failed to parse guide content string during serialization', error);
            return null;
        }
    }

    return content;
};

const guideDataToInsert = (guide: Omit<GuideData, 'id'>): GuideInsertPayload => ({
    title: guide.title,
    description: guide.description,
    division: guide.division,
    category: guide.category,
    image_url: guide.imageUrl && !isDummyImage(guide.imageUrl) ? guide.imageUrl : null,
    tags: guide.tags || null,
    content: serializeContent(guide.content),
    itinerary: serializeContent(guide.itinerary),
    title_bn: guide.titleBn || null,
    description_bn: guide.descriptionBn || null,
    content_bn: serializeContent(guide.contentBn),
});

const dbGuideToGuideData = (dbGuide: DbGuide): GuideData => ({
    id: dbGuide.id,
    title: dbGuide.title,
    description: dbGuide.description,
    division: dbGuide.division,
    category: dbGuide.category,
    imageUrl: dbGuide.image_url,
    tags: dbGuide.tags || undefined,
    content: (dbGuide.content as any) || undefined,
    itinerary: (dbGuide.itinerary as any) || undefined,
    titleBn: dbGuide.title_bn || undefined,
    descriptionBn: dbGuide.description_bn || undefined,
    contentBn: (dbGuide.content_bn as any) || undefined,
    created_at: dbGuide.created_at || undefined,
    updated_at: dbGuide.updated_at || undefined,
    created_by: dbGuide.created_by || undefined,
    last_edited_by: dbGuide.last_edited_by || undefined,
    last_edited_at: dbGuide.last_edited_at || undefined,
});

export async function fetchGuides(): Promise<GuideData[]> {
    const data = await withSupabase<DbGuide[]>({
        action: 'fetch guides',
        endpoint: GUIDES_ENDPOINT,
        method: 'GET',
        fallbackMessage: 'Failed to fetch guides',
    }, () =>
        supabase
            .from('guides')
            .select('*')
            .order('created_at', { ascending: false })
    );

    return (data ?? []).map(dbGuideToGuideData);
}

type FeaturedGuideSummary = Pick<DbFeaturedGuide, 'guide_id' | 'position'>;

export async function fetchFeaturedGuideIds(): Promise<number[]> {
    const data = await withSupabase<FeaturedGuideSummary[]>({
        action: 'fetch featured guides',
        endpoint: FEATURED_ENDPOINT,
        method: 'GET',
        fallbackMessage: 'Failed to fetch featured guides',
    }, () =>
        supabase
            .from('featured_guides')
            .select('guide_id, position')
            .order('position', { ascending: true })
            .limit(MAX_FEATURED_GUIDES)
    );

    return (data ?? []).map(item => item.guide_id);
}

export async function createGuide(guide: Omit<GuideData, 'id'>): Promise<GuideData> {
    const insertPayload = guideDataToInsert(guide);

    const data = await withSupabase<DbGuide>({
        action: 'create guide',
        endpoint: GUIDES_ENDPOINT,
        method: 'POST',
        payload: insertPayload,
        fallbackMessage: 'Failed to create guide',
        successStatus: 201,
    }, () =>
        supabase
            .from('guides')
            .insert(insertPayload)
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('create guide', new Error('No guide data returned after insert'));
    }

    return dbGuideToGuideData(data);
}

export async function updateGuide(id: number, guide: Omit<GuideData, 'id'>): Promise<GuideData> {
    const updatePayload = guideDataToInsert(guide);

    const data = await withSupabase<DbGuide>({
        action: 'update guide',
        endpoint: `${GUIDES_ENDPOINT}/${id}`,
        method: 'PUT',
        payload: updatePayload,
        fallbackMessage: 'Failed to update guide',
    }, () =>
        supabase
            .from('guides')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('update guide', new Error('No guide data returned after update'));
    }

    return dbGuideToGuideData(data);
}

export async function deleteGuide(id: number): Promise<void> {
    await withSupabase<null>({
        action: 'delete guide',
        endpoint: `${GUIDES_ENDPOINT}/${id}`,
        method: 'DELETE',
        fallbackMessage: 'Failed to delete guide',
    }, () =>
        supabase
            .from('guides')
            .delete()
            .eq('id', id)
    );
}

export async function setFeaturedGuides(ids: number[]): Promise<number[]> {
    const limitedIds = ids.slice(0, MAX_FEATURED_GUIDES);

    await withSupabase<null>({
        action: 'clear featured guides',
        endpoint: FEATURED_ENDPOINT,
        method: 'DELETE',
        fallbackMessage: 'Failed to reset featured guides',
    }, () =>
        supabase
            .from('featured_guides')
            .delete()
            .neq('id', 0)
    );

    if (limitedIds.length === 0) {
        return [];
    }

    const payload = limitedIds.map((guideId, index) => ({
        guide_id: guideId,
        position: index + 1,
    }));

    await withSupabase<null>({
        action: 'set featured guides',
        endpoint: FEATURED_ENDPOINT,
        method: 'POST',
        payload,
        fallbackMessage: 'Failed to set featured guides',
        successStatus: 201,
    }, () =>
        supabase
            .from('featured_guides')
            .insert(payload)
    );

    return limitedIds;
}

export async function refreshGuides(): Promise<{ guides: GuideData[]; featuredIds: number[] }> {
    const [guides, featuredIds] = await Promise.all([fetchGuides(), fetchFeaturedGuideIds()]);
    return { guides, featuredIds };
}

export const guidesService = {
    fetchGuides,
    fetchFeaturedGuideIds,
    createGuide,
    updateGuide,
    deleteGuide,
    setFeaturedGuides,
    refreshGuides,
    MAX_FEATURED_GUIDES,
};

export default guidesService;
