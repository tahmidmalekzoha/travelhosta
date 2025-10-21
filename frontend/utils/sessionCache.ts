/**
 * Session Cache Manager
 * Reduces API calls by caching session data in localStorage with expiry
 */

import { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '../services/authService';

// =====================================================
// CONSTANTS
// =====================================================

const STORAGE_KEYS = {
    SESSION_TIMESTAMP: 'travelhosta-session-timestamp',
    CACHED_PROFILE: 'travelhosta-cached-profile',
    SESSION_EXPIRY: 'travelhosta-session-expiry',
} as const;

// Session timeout: 1 day (24 hours)
const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface CachedSessionData {
    timestamp: number;
    expiresAt: number;
    profile: UserProfile;
}

// =====================================================
// CACHE MANAGEMENT
// =====================================================

/**
 * Check if the current session has expired
 */
export const isSessionExpired = (): boolean => {
    try {
        const cachedData = localStorage.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        
        if (!cachedData) {
            return true; // No session data = expired
        }

        const sessionData: CachedSessionData = JSON.parse(cachedData);
        const now = Date.now();

        // Check if session has passed expiry time
        if (now > sessionData.expiresAt) {
            console.log('⏰ Session expired - clearing cache');
            clearSessionCache();
            return true;
        }

        const timeRemaining = sessionData.expiresAt - now;
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        console.log(`✅ Session valid - expires in ${hoursRemaining}h ${minutesRemaining}m`);
        return false;
    } catch (error) {
        console.error('Error checking session expiry:', error);
        return true; // On error, consider expired
    }
};

/**
 * Get cached profile data if session is still valid
 */
export const getCachedProfile = (): UserProfile | null => {
    try {
        // First check if session is expired
        if (isSessionExpired()) {
            return null;
        }

        const cachedData = localStorage.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        
        if (!cachedData) {
            return null;
        }

        const sessionData: CachedSessionData = JSON.parse(cachedData);
        
        console.log('📦 Using cached profile data for:', sessionData.profile.email);
        return sessionData.profile;
    } catch (error) {
        console.error('Error getting cached profile:', error);
        return null;
    }
};

/**
 * Save session data to cache with timestamp
 */
export const saveSessionCache = (profile: UserProfile): void => {
    try {
        const now = Date.now();
        const expiresAt = now + SESSION_TIMEOUT_MS;

        const sessionData: CachedSessionData = {
            timestamp: now,
            expiresAt: expiresAt,
            profile: profile,
        };

        localStorage.setItem(STORAGE_KEYS.SESSION_TIMESTAMP, JSON.stringify(sessionData));
        
        const expiryDate = new Date(expiresAt);
        console.log(`💾 Session cached - expires at: ${expiryDate.toLocaleString()}`);
    } catch (error) {
        console.error('Error saving session cache:', error);
    }
};

/**
 * Clear all session cache data
 */
export const clearSessionCache = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        localStorage.removeItem(STORAGE_KEYS.CACHED_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
        console.log('🧹 Session cache cleared');
    } catch (error) {
        console.error('Error clearing session cache:', error);
    }
};

/**
 * Get session expiry time
 */
export const getSessionExpiryTime = (): Date | null => {
    try {
        const cachedData = localStorage.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        
        if (!cachedData) {
            return null;
        }

        const sessionData: CachedSessionData = JSON.parse(cachedData);
        return new Date(sessionData.expiresAt);
    } catch (error) {
        console.error('Error getting session expiry time:', error);
        return null;
    }
};

/**
 * Get time remaining in session (in milliseconds)
 */
export const getSessionTimeRemaining = (): number | null => {
    try {
        const cachedData = localStorage.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        
        if (!cachedData) {
            return null;
        }

        const sessionData: CachedSessionData = JSON.parse(cachedData);
        const now = Date.now();
        const remaining = sessionData.expiresAt - now;

        return remaining > 0 ? remaining : 0;
    } catch (error) {
        console.error('Error getting session time remaining:', error);
        return null;
    }
};

/**
 * Extend session expiry (e.g., on user activity)
 * This resets the expiry to 1 day from now
 */
export const extendSession = (profile: UserProfile): void => {
    try {
        const now = Date.now();
        const expiresAt = now + SESSION_TIMEOUT_MS;

        const sessionData: CachedSessionData = {
            timestamp: now,
            expiresAt: expiresAt,
            profile: profile,
        };

        localStorage.setItem(STORAGE_KEYS.SESSION_TIMESTAMP, JSON.stringify(sessionData));
        
        console.log('🔄 Session extended by 24 hours');
    } catch (error) {
        console.error('Error extending session:', error);
    }
};

/**
 * Check if we should validate with Supabase
 * Returns true if session is expired OR no cached data exists
 */
export const shouldValidateWithSupabase = (): boolean => {
    const expired = isSessionExpired();
    const hasCache = !!localStorage.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
    
    if (!hasCache) {
        console.log('🔍 No cached session - will validate with Supabase');
        return true;
    }
    
    if (expired) {
        console.log('⏰ Session expired - will validate with Supabase');
        return true;
    }
    
    console.log('✅ Session cached and valid - skipping Supabase validation');
    return false;
};

// =====================================================
// EXPORTS
// =====================================================

export const sessionCache = {
    isSessionExpired,
    getCachedProfile,
    saveSessionCache,
    clearSessionCache,
    getSessionExpiryTime,
    getSessionTimeRemaining,
    extendSession,
    shouldValidateWithSupabase,
};

export default sessionCache;
