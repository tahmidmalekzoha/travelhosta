/**
 * Form Cache utilities
 * Centralized localStorage management for guide form state
 */

export { FormCacheManager, formCacheManager } from './FormCacheManager';
export type {
    CachedFormData,
    CachedContentData,
    FormSession,
} from './types';
export { FORM_CACHE_KEYS, FORM_CACHE_EXPIRY_MS } from './types';
