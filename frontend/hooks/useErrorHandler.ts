/**
 * Custom hook for error handling in components
 * Provides consistent error handling and toast notifications
 */

'use client';

import { useState, useCallback } from 'react';
import { AppError, handleError, getUserFriendlyMessage, formatErrorForDisplay } from '@/utils/errorHandling';
import { TOAST_TYPES } from '@/constants';

export interface UseErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleError: (error: unknown, context?: string) => string;
  handleAsyncError: <T>(
    promise: Promise<T>,
    context?: string
  ) => Promise<T | null>;
}

/**
 * Hook for handling errors with toast notifications
 */
export const useErrorHandler = (
  showToast?: (message: string, type: typeof TOAST_TYPES[keyof typeof TOAST_TYPES]) => void
): UseErrorHandlerReturn => {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((error: string | null) => {
    setErrorState(error);
    if (error && showToast) {
      showToast(error, TOAST_TYPES.ERROR);
    }
  }, [showToast]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleErrorCallback = useCallback(
    (err: unknown, context?: string): string => {
      const handled = handleError(err, context);
      const message = getUserFriendlyMessage(err);
      setError(message);
      return message;
    },
    [setError]
  );

  const handleAsyncError = useCallback(
    async <T,>(promise: Promise<T>, context?: string): Promise<T | null> => {
      try {
        return await promise;
      } catch (err) {
        handleErrorCallback(err, context);
        return null;
      }
    },
    [handleErrorCallback]
  );

  return {
    error,
    setError,
    clearError,
    handleError: handleErrorCallback,
    handleAsyncError,
  };
};

/**
 * Hook for form error handling
 */
export interface UseFormErrorsReturn {
  errors: Record<string, string>;
  setFieldError: (field: string, message: string) => void;
  clearFieldError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
  getFieldError: (field: string) => string | undefined;
}

export const useFormErrors = (): UseFormErrorsReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback(
    (field: string) => errors[field],
    [errors]
  );

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors,
    getFieldError,
  };
};

/**
 * Hook for API error handling with loading state
 */
export interface UseApiErrorReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: (promise: Promise<T>, context?: string) => Promise<T | null>;
  reset: () => void;
}

export const useApiError = <T = any>(
  showToast?: (message: string, type: typeof TOAST_TYPES[keyof typeof TOAST_TYPES]) => void
): UseApiErrorReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (promise: Promise<T>, context?: string): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await promise;
        setData(result);
        return result;
      } catch (err) {
        const handled = handleError(err, context);
        const message = getUserFriendlyMessage(err);
        setError(message);
        
        if (showToast) {
          showToast(message, TOAST_TYPES.ERROR);
        }
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};
