/**
 * Shared helpers for Supabase-powered services
 */

import type { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { logApiCall, logApiResponse, logger } from '../utils/logger';

interface SupabaseActionOptions {
    action: string;
    endpoint?: string;
    method?: string;
    payload?: unknown;
    fallbackMessage?: string;
    successStatus?: number;
}

type SupabaseResult<T> = PostgrestResponse<T> | PostgrestSingleResponse<T>;

const isPostgrestError = (error: unknown): error is PostgrestError => {
    return Boolean(error) && typeof error === 'object' && 'message' in (error as Record<string, unknown>);
};

export function handleSupabaseError(action: string, error: unknown, fallbackMessage?: string): never {
    if (isPostgrestError(error)) {
        logger.error(`Supabase ${action} failed`, {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
        });
        throw new Error(fallbackMessage ?? error.message ?? `Failed to ${action}`);
    }

    logger.error(`Unexpected error during ${action}`, error);
    if (error instanceof Error) {
        throw error;
    }

    throw new Error(fallbackMessage ?? `Failed to ${action}`);
}

export async function withSupabase<T>(
    options: SupabaseActionOptions,
    operation: () => PromiseLike<SupabaseResult<T>>
): Promise<T | null> {
    const { action, endpoint, method, payload, fallbackMessage, successStatus = 200 } = options;

    try {
        if (endpoint && method) {
            logApiCall(method, endpoint, payload);
        }

    const result = await operation();

        if (endpoint) {
            logApiResponse(endpoint, result.error ? 500 : successStatus, result.data);
        }

        if (result.error) {
            handleSupabaseError(action, result.error, fallbackMessage);
        }

        return (result.data as T) ?? null;
    } catch (error) {
        handleSupabaseError(action, error, fallbackMessage);
    }
}
