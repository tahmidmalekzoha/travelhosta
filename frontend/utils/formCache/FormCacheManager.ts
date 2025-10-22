/**
 * Form Cache Manager
 * Centralized localStorage management for guide form state
 * Handles form data, content, and session persistence with expiration
 */

import type { GuideData } from '../../types';
import type {
    CachedFormData,
    CachedContentData,
    FormSession,
} from './types';
import { FORM_CACHE_KEYS, FORM_CACHE_EXPIRY_MS } from './types';

export class FormCacheManager {
    /**
     * Check if localStorage is available
     */
    private isLocalStorageAvailable(): boolean {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    /**
     * Safely get item from localStorage
     */
    private getItem(key: string): string | null {
        if (!this.isLocalStorageAvailable()) return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return null;
        }
    }

    /**
     * Safely set item in localStorage
     */
    private setItem(key: string, value: string): boolean {
        if (!this.isLocalStorageAvailable()) return false;
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded. Clearing old data...');
                this.clearAll();
                try {
                    localStorage.setItem(key, value);
                    return true;
                } catch (retryError) {
                    console.error('Failed to save to localStorage even after clearing:', retryError);
                    return false;
                }
            }
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }

    /**
     * Safely remove item from localStorage
     */
    private removeItem(key: string): void {
        if (!this.isLocalStorageAvailable()) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    }

    /**
     * Check if cached data is expired
     */
    private isExpired(expiresAt: number): boolean {
        return Date.now() > expiresAt;
    }

    /**
     * Save form data to cache
     */
    saveFormData(data: Omit<GuideData, 'id'> & { id?: number }): boolean {
        const now = Date.now();
        const cached: CachedFormData = {
            timestamp: now,
            expiresAt: now + FORM_CACHE_EXPIRY_MS,
            data,
        };

        const success = this.setItem(FORM_CACHE_KEYS.FORM_DATA, JSON.stringify(cached));
        if (success) {
            console.log('✅ Form data cached successfully');
        }
        return success;
    }

    /**
     * Load form data from cache
     */
    loadFormData(): (Omit<GuideData, 'id'> & { id?: number }) | null {
        const cached = this.getItem(FORM_CACHE_KEYS.FORM_DATA);
        if (!cached) return null;

        try {
            const parsed: CachedFormData = JSON.parse(cached);
            
            if (this.isExpired(parsed.expiresAt)) {
                console.log('⏰ Cached form data expired, clearing...');
                this.clearFormData();
                return null;
            }

            console.log('📦 Loaded cached form data');
            return parsed.data;
        } catch (error) {
            console.error('Error parsing cached form data:', error);
            this.clearFormData();
            return null;
        }
    }

    /**
     * Clear form data from cache
     */
    clearFormData(): void {
        this.removeItem(FORM_CACHE_KEYS.FORM_DATA);
        console.log('🧹 Form data cache cleared');
    }

    /**
     * Save content text to cache
     */
    saveContentText(contentEn: string, contentBn: string): boolean {
        const now = Date.now();
        const cached: CachedContentData = {
            timestamp: now,
            expiresAt: now + FORM_CACHE_EXPIRY_MS,
            contentEn,
            contentBn,
        };

        const success = this.setItem(FORM_CACHE_KEYS.CONTENT_EN, JSON.stringify(cached));
        if (success) {
            console.log('✅ Content text cached successfully');
        }
        return success;
    }

    /**
     * Load content text from cache
     */
    loadContentText(): { contentEn: string; contentBn: string } | null {
        const cached = this.getItem(FORM_CACHE_KEYS.CONTENT_EN);
        if (!cached) return null;

        try {
            const parsed: CachedContentData = JSON.parse(cached);
            
            if (this.isExpired(parsed.expiresAt)) {
                console.log('⏰ Cached content text expired, clearing...');
                this.clearContentText();
                return null;
            }

            console.log('📦 Loaded cached content text');
            return {
                contentEn: parsed.contentEn,
                contentBn: parsed.contentBn,
            };
        } catch (error) {
            console.error('Error parsing cached content text:', error);
            this.clearContentText();
            return null;
        }
    }

    /**
     * Clear content text from cache
     */
    clearContentText(): void {
        this.removeItem(FORM_CACHE_KEYS.CONTENT_EN);
        console.log('🧹 Content text cache cleared');
    }

    /**
     * Save session metadata
     */
    saveSession(sessionId: string, guideId?: number): boolean {
        const session: FormSession = {
            sessionId,
            startedAt: Date.now(),
            guideId,
        };

        return this.setItem(FORM_CACHE_KEYS.SESSION, JSON.stringify(session));
    }

    /**
     * Load session metadata
     */
    loadSession(): FormSession | null {
        const cached = this.getItem(FORM_CACHE_KEYS.SESSION);
        if (!cached) return null;

        try {
            return JSON.parse(cached);
        } catch (error) {
            console.error('Error parsing cached session:', error);
            this.clearSession();
            return null;
        }
    }

    /**
     * Clear session metadata
     */
    clearSession(): void {
        this.removeItem(FORM_CACHE_KEYS.SESSION);
    }

    /**
     * Clear all form-related cache
     */
    clearAll(): void {
        this.clearFormData();
        this.clearContentText();
        this.clearSession();
        console.log('🧹 All form cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats(): {
        hasFormData: boolean;
        hasContentText: boolean;
        hasSession: boolean;
        formDataExpiry: Date | null;
        contentTextExpiry: Date | null;
    } {
        const formData = this.getItem(FORM_CACHE_KEYS.FORM_DATA);
        const contentText = this.getItem(FORM_CACHE_KEYS.CONTENT_EN);
        const session = this.getItem(FORM_CACHE_KEYS.SESSION);

        let formDataExpiry: Date | null = null;
        let contentTextExpiry: Date | null = null;

        try {
            if (formData) {
                const parsed: CachedFormData = JSON.parse(formData);
                formDataExpiry = new Date(parsed.expiresAt);
            }
            if (contentText) {
                const parsed: CachedContentData = JSON.parse(contentText);
                contentTextExpiry = new Date(parsed.expiresAt);
            }
        } catch (error) {
            console.error('Error parsing cache stats:', error);
        }

        return {
            hasFormData: !!formData,
            hasContentText: !!contentText,
            hasSession: !!session,
            formDataExpiry,
            contentTextExpiry,
        };
    }
}

// Export singleton instance
export const formCacheManager = new FormCacheManager();

// Export class for testing
export default FormCacheManager;
