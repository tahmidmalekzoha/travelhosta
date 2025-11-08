/**
 * Hero images data service
 */

import { supabase } from '../utils/supabase';
import type { HeroImage } from '../types';
import type { Database } from '../types/supabase';
import { handleSupabaseError, withSupabase } from './serviceHelpers';

type DbHeroImage = Database['public']['Tables']['hero_images']['Row'];
type DbHeroImageInsert = Database['public']['Tables']['hero_images']['Insert'];

type HeroInsertPayload = Omit<DbHeroImageInsert, 'id' | 'created_at'>;

type HeroUpdatePayload = Partial<HeroInsertPayload>;

const HERO_ENDPOINT = '/hero-images';

const mapHero = (hero: DbHeroImage): HeroImage => ({
    id: hero.id.toString(),
    imageUrl: hero.image_url,
    title: hero.title,
    subtitle: hero.subtitle,
    isActive: hero.is_active ?? false,
    uploadedAt: hero.created_at ?? new Date().toISOString(),
});

const heroToInsert = (hero: Omit<HeroImage, 'id' | 'uploadedAt'>): HeroInsertPayload => ({
    image_url: hero.imageUrl,
    title: hero.title,
    subtitle: hero.subtitle,
    is_active: hero.isActive,
});

const heroToUpdate = (hero: Partial<Omit<HeroImage, 'id' | 'uploadedAt'>>): HeroUpdatePayload => {
    const payload: HeroUpdatePayload = {};

    if (hero.imageUrl !== undefined) payload.image_url = hero.imageUrl;
    if (hero.title !== undefined) payload.title = hero.title;
    if (hero.subtitle !== undefined) payload.subtitle = hero.subtitle;
    if (typeof hero.isActive === 'boolean') payload.is_active = hero.isActive;

    return payload;
};

export async function fetchHeroImages(): Promise<HeroImage[]> {
    const data = await withSupabase<DbHeroImage[]>({
        action: 'fetch hero images',
        endpoint: HERO_ENDPOINT,
        method: 'GET',
        fallbackMessage: 'Failed to fetch hero images',
    }, () =>
        supabase
            .from('hero_images')
            .select('*')
            .order('created_at', { ascending: false })
    );

    return (data ?? []).map(mapHero);
}

export async function createHeroImage(hero: Omit<HeroImage, 'id' | 'uploadedAt'>): Promise<HeroImage> {
    const payload = heroToInsert(hero);

    const data = await withSupabase<DbHeroImage>({
        action: 'create hero image',
        endpoint: HERO_ENDPOINT,
        method: 'POST',
        payload,
        fallbackMessage: 'Failed to create hero image',
        successStatus: 201,
    }, () =>
        supabase
            .from('hero_images')
            .insert(payload)
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('create hero image', new Error('No hero image returned after insert'));
    }

    return mapHero(data);
}

export async function updateHeroImage(
    id: string,
    hero: Partial<Omit<HeroImage, 'id' | 'uploadedAt'>>
): Promise<HeroImage> {
    const payload = heroToUpdate(hero);

    const data = await withSupabase<DbHeroImage>({
        action: 'update hero image',
        endpoint: `${HERO_ENDPOINT}/${id}`,
        method: 'PATCH',
        payload,
        fallbackMessage: 'Failed to update hero image',
    }, () =>
        supabase
            .from('hero_images')
            .update(payload)
            .eq('id', parseInt(id, 10))
            .select()
            .single()
    );

    if (!data) {
        handleSupabaseError('update hero image', new Error('No hero image returned after update'));
    }

    return mapHero(data);
}

export async function deleteHeroImage(id: string): Promise<void> {
    await withSupabase<null>({
        action: 'delete hero image',
        endpoint: `${HERO_ENDPOINT}/${id}`,
        method: 'DELETE',
        fallbackMessage: 'Failed to delete hero image',
    }, () =>
        supabase
            .from('hero_images')
            .delete()
            .eq('id', parseInt(id, 10))
    );
}

export async function setActiveHero(id: string): Promise<void> {
    await withSupabase<null>({
        action: 'deactivate hero images',
        endpoint: HERO_ENDPOINT,
        method: 'PATCH',
        fallbackMessage: 'Failed to reset hero images',
    }, () =>
        supabase
            .from('hero_images')
            .update({ is_active: false })
            .neq('id', 0)
    );

    await withSupabase<null>({
        action: 'activate hero image',
        endpoint: `${HERO_ENDPOINT}/${id}`,
        method: 'PATCH',
        fallbackMessage: 'Failed to activate hero image',
    }, () =>
        supabase
            .from('hero_images')
            .update({ is_active: true })
            .eq('id', parseInt(id, 10))
    );
}

export async function refreshHeroImages(): Promise<HeroImage[]> {
    return fetchHeroImages();
}

export const heroService = {
    fetchHeroImages,
    createHeroImage,
    updateHeroImage,
    deleteHeroImage,
    setActiveHero,
    refreshHeroImages,
};

export default heroService;
