/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

import { logger } from './logger';
import { ERROR_MESSAGES, TOAST_TYPES } from '@/constants';

/**
 * Custom error types for better error classification
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTH',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode?: number;
  public readonly context?: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error handler function that processes errors consistently
 */
export const handleError = (
  error: unknown,
  context?: string
): {
  message: string;
  type: ErrorType;
  shouldNotify: boolean;
} => {
  // Log error with context
  logger.error(`Error in ${context || 'unknown context'}:`, error);

  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      type: error.type,
      shouldNotify: true,
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.NETWORK.GENERIC,
      type: ErrorType.UNKNOWN,
      shouldNotify: true,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      type: ErrorType.UNKNOWN,
      shouldNotify: true,
    };
  }

  // Handle unknown error types
  return {
    message: ERROR_MESSAGES.NETWORK.GENERIC,
    type: ErrorType.UNKNOWN,
    shouldNotify: true,
  };
};

/**
 * Network error handler for API calls
 */
export const handleNetworkError = (
  error: any,
  endpoint: string
): AppError => {
  logger.error(`Network error at ${endpoint}:`, error);

  // Check if it's a timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return new AppError(
      ERROR_MESSAGES.NETWORK.TIMEOUT,
      ErrorType.NETWORK,
      408,
      { endpoint }
    );
  }

  // Check if offline
  if (!navigator.onLine) {
    return new AppError(
      ERROR_MESSAGES.NETWORK.OFFLINE,
      ErrorType.NETWORK,
      0,
      { endpoint }
    );
  }

  // Extract status code and message from response
  const statusCode = error.response?.status || error.status;
  const message =
    error.response?.data?.message ||
    error.message ||
    ERROR_MESSAGES.NETWORK.GENERIC;

  // Determine error type based on status code
  let type = ErrorType.NETWORK;
  if (statusCode === 401) type = ErrorType.AUTHENTICATION;
  if (statusCode === 403) type = ErrorType.AUTHORIZATION;
  if (statusCode === 404) type = ErrorType.NOT_FOUND;
  if (statusCode >= 500) type = ErrorType.SERVER;
  if (statusCode >= 400 && statusCode < 500) type = ErrorType.CLIENT;

  return new AppError(message, type, statusCode, { endpoint });
};

/**
 * Validation error handler
 */
export const handleValidationError = (
  field: string,
  message: string
): AppError => {
  return new AppError(message, ErrorType.VALIDATION, 400, { field });
};

/**
 * Authentication error handler
 */
export const handleAuthError = (message?: string): AppError => {
  return new AppError(
    message || ERROR_MESSAGES.AUTH.UNAUTHORIZED,
    ErrorType.AUTHENTICATION,
    401
  );
};

/**
 * Authorization error handler
 */
export const handleAuthorizationError = (message?: string): AppError => {
  return new AppError(
    message || ERROR_MESSAGES.AUTH.FORBIDDEN,
    ErrorType.AUTHORIZATION,
    403
  );
};

/**
 * Not found error handler
 */
export const handleNotFoundError = (resource: string): AppError => {
  return new AppError(
    `${resource} not found`,
    ErrorType.NOT_FOUND,
    404,
    { resource }
  );
};

/**
 * Try-catch wrapper with error handling
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>,
  context: string,
  onError?: (error: AppError) => void
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    const handledError = handleError(error, context);
    
    if (onError && error instanceof AppError) {
      onError(error);
    }
    
    return null;
  }
};

/**
 * Retry logic for failed operations
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  context?: string
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Attempt ${attempt}/${maxRetries}${context ? ` for ${context}` : ''}`);
      return await operation();
    } catch (error) {
      lastError = error as Error;
      logger.warn(
        `Attempt ${attempt}/${maxRetries} failed${context ? ` for ${context}` : ''}:`,
        error
      );

      // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
      if (error instanceof AppError) {
        const shouldRetry =
          error.type === ErrorType.NETWORK ||
          error.statusCode === 408 ||
          error.statusCode === 429 ||
          (error.statusCode && error.statusCode >= 500);

        if (!shouldRetry) {
          throw error;
        }
      }

      // Wait before retrying (with exponential backoff)
      if (attempt < maxRetries) {
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  // All retries failed
  throw new AppError(
    `Operation failed after ${maxRetries} attempts`,
    ErrorType.NETWORK,
    undefined,
    { originalError: lastError!.message }
  );
};

/**
 * Error boundary fallback component props type
 */
export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Extract user-friendly error message
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Map common error messages to user-friendly ones
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK.GENERIC;
    }
    
    if (message.includes('timeout')) {
      return ERROR_MESSAGES.NETWORK.TIMEOUT;
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return ERROR_MESSAGES.AUTH.FORBIDDEN;
    }
    
    return error.message;
  }

  return ERROR_MESSAGES.NETWORK.GENERIC;
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return (
      error.type === ErrorType.NETWORK ||
      error.statusCode === 408 ||
      error.statusCode === 429 ||
      (error.statusCode !== undefined && error.statusCode >= 500)
    );
  }
  return false;
};

/**
 * Format error for display
 */
export const formatErrorForDisplay = (
  error: unknown
): {
  title: string;
  message: string;
  type: typeof TOAST_TYPES[keyof typeof TOAST_TYPES];
} => {
  if (error instanceof AppError) {
    let title = 'Error';
    
    switch (error.type) {
      case ErrorType.AUTHENTICATION:
        title = 'Authentication Error';
        break;
      case ErrorType.AUTHORIZATION:
        title = 'Permission Denied';
        break;
      case ErrorType.VALIDATION:
        title = 'Validation Error';
        break;
      case ErrorType.NOT_FOUND:
        title = 'Not Found';
        break;
      case ErrorType.NETWORK:
        title = 'Network Error';
        break;
      case ErrorType.SERVER:
        title = 'Server Error';
        break;
      default:
        title = 'Error';
    }

    return {
      title,
      message: error.message,
      type: TOAST_TYPES.ERROR,
    };
  }

  return {
    title: 'Error',
    message: getUserFriendlyMessage(error),
    type: TOAST_TYPES.ERROR,
  };
};

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandlers = () => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent default browser behavior
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      logger.error('Global error:', event.error);
    });
  }
};
