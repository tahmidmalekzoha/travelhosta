/**
 * Rate Limiting Utilities
 * 
 * Provides client-side rate limiting to prevent abuse
 * and protect expensive operations
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

/**
 * In-memory store for rate limit tracking
 * In production, consider using Redis or similar
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiter for client-side operations
 * Prevents users from performing expensive operations too frequently
 * 
 * @param key - Unique identifier for the operation (e.g., 'search', 'upload')
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns True if request is allowed, false if rate limited
 * 
 * @example
 * if (rateLimit('search', 10, 60000)) {
 *   // Perform search
 * } else {
 *   // Show rate limit error
 * }
 */
export function rateLimit(
    key: string,
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minute default
): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    // No entry exists, create one
    if (!entry) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        });
        return true;
    }

    // Reset window has passed
    if (now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        });
        return true;
    }

    // Within window, check count
    if (entry.count < maxRequests) {
        entry.count++;
        return true;
    }

    // Rate limited
    return false;
}

/**
 * Get remaining requests for a rate limit key
 * 
 * @param key - Rate limit key
 * @param maxRequests - Maximum allowed requests
 * @returns Number of remaining requests
 */
export function getRateLimitRemaining(key: string, maxRequests: number): number {
    const entry = rateLimitStore.get(key);
    if (!entry) return maxRequests;

    const now = Date.now();
    if (now > entry.resetTime) return maxRequests;

    return Math.max(0, maxRequests - entry.count);
}

/**
 * Get time until rate limit reset
 * 
 * @param key - Rate limit key
 * @returns Milliseconds until reset, or 0 if not rate limited
 */
export function getRateLimitResetTime(key: string): number {
    const entry = rateLimitStore.get(key);
    if (!entry) return 0;

    const now = Date.now();
    if (now > entry.resetTime) return 0;

    return entry.resetTime - now;
}

/**
 * Reset rate limit for a specific key
 * Useful for testing or admin actions
 * 
 * @param key - Rate limit key to reset
 */
export function resetRateLimit(key: string): void {
    rateLimitStore.delete(key);
}

/**
 * Clear all rate limits
 * Useful for testing or on logout
 */
export function clearAllRateLimits(): void {
    rateLimitStore.clear();
}

/**
 * Debounced rate limiter for search/input operations
 * Combines debouncing with rate limiting
 * 
 * @param callback - Function to call
 * @param delay - Debounce delay in ms
 * @param key - Rate limit key
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Rate limit window
 * @returns Debounced and rate-limited function
 */
export function createDebouncedRateLimiter<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300,
    key: string = 'default',
    maxRequests: number = 10,
    windowMs: number = 60000
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            if (rateLimit(key, maxRequests, windowMs)) {
                callback(...args);
            } else {
                console.warn(`Rate limit exceeded for ${key}. Please try again later.`);
            }
        }, delay);
    };
}

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
    /** For search operations: 30 requests per minute */
    SEARCH: { maxRequests: 30, windowMs: 60000 },
    
    /** For form submissions: 5 requests per minute */
    FORM_SUBMIT: { maxRequests: 5, windowMs: 60000 },
    
    /** For file uploads: 3 requests per 5 minutes */
    FILE_UPLOAD: { maxRequests: 3, windowMs: 300000 },
    
    /** For API calls: 60 requests per minute */
    API_CALL: { maxRequests: 60, windowMs: 60000 },
    
    /** For authentication: 5 attempts per 15 minutes */
    AUTH: { maxRequests: 5, windowMs: 900000 }
} as const;

/**
 * Create a rate-limited function
 * 
 * @param fn - Function to rate limit
 * @param key - Unique identifier
 * @param preset - Rate limit preset or custom config
 * @returns Rate-limited function
 * 
 * @example
 * const limitedSearch = createRateLimitedFunction(
 *   searchFunction,
 *   'user-search',
 *   RateLimitPresets.SEARCH
 * );
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
    fn: T,
    key: string,
    preset: { maxRequests: number; windowMs: number } = RateLimitPresets.API_CALL
): (...args: Parameters<T>) => ReturnType<T> | null {
    return (...args: Parameters<T>): ReturnType<T> | null => {
        if (rateLimit(key, preset.maxRequests, preset.windowMs)) {
            return fn(...args);
        } else {
            const resetTime = getRateLimitResetTime(key);
            const seconds = Math.ceil(resetTime / 1000);
            console.warn(`Rate limit exceeded. Please wait ${seconds} seconds before trying again.`);
            return null;
        }
    };
}
