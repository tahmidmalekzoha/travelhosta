import type { UserProfile } from '@/services/authService';
import { logger } from './logger';

const warn = (method: string) => {
    logger.warn('sessionCache.' + method + ' is deprecated. Supabase persistence now handles sessions.');
};

export const sessionCache = {
    isSessionExpired: () => false,
    getCachedProfile: (): UserProfile | null => null,
    saveSessionCache: (_profile: UserProfile) => warn('saveSessionCache'),
    clearSessionCache: () => warn('clearSessionCache'),
    getSessionExpiryTime: () => null as Date | null,
    getSessionTimeRemaining: () => null as number | null,
    extendSession: (_profile: UserProfile) => warn('extendSession'),
    shouldValidateWithSupabase: () => true,
};

export default sessionCache;
