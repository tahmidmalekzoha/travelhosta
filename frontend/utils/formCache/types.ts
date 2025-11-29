/**
 * Type definitions for form cache management
 */

import type { GuideData } from '../../types';

/**
 * Cache data structure for form state
 */
export interface CachedFormData {
    timestamp: number;
    expiresAt: number;
    data: Omit<GuideData, 'id'> & { id?: number };
}

/**
 * Cache data structure for content text
 */
export interface CachedContentData {
    timestamp: number;
    expiresAt: number;
    contentEn: string;
    contentBn: string;
}

/**
 * Editor state for preserving scroll and cursor position
 */
export interface EditorState {
    scrollTop: number;
    cursorStart: number;
    cursorEnd: number;
    language: 'en' | 'bn';
}

/**
 * Session metadata for form editing
 */
export interface FormSession {
    sessionId: string;
    startedAt: number;
    guideId?: number;
}

/**
 * Storage keys for form cache
 */
export const FORM_CACHE_KEYS = {
    FORM_DATA: 'travelhosta:guide:formData',
    CONTENT_EN: 'travelhosta:guide:contentEn',
    CONTENT_BN: 'travelhosta:guide:contentBn',
    SESSION: 'travelhosta:guide:session',
    EDITOR_STATE: 'travelhosta:guide:editorState',
} as const;

/**
 * Cache expiration time (1 hour for active editing)
 */
export const FORM_CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
