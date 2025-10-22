/**
 * Environment-aware Logging Utility
 * Provides conditional logging based on environment
 * Prevents console logs in production builds
 */

import { FEATURES } from '@/constants/app';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug' | 'table' | 'group' | 'groupEnd';

/**
 * Logger class with environment-aware methods
 */
class Logger {
  private isDevelopment = FEATURES.ENABLE_DEBUG_LOGS;
  private prefix = '[TravelHosta]';

  /**
   * Log a message (only in development)
   */
  log(...args: any[]): void {
    if (this.isDevelopment) {
      console.log(this.prefix, ...args);
    }
  }

  /**
   * Log an info message (only in development)
   */
  info(...args: any[]): void {
    if (this.isDevelopment) {
      console.info(this.prefix, ...args);
    }
  }

  /**
   * Log a warning (always shown, but formatted differently in dev)
   */
  warn(...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(this.prefix, ...args);
    } else {
      // In production, still show warnings but without prefix
      console.warn(...args);
    }
  }

  /**
   * Log an error (always shown)
   */
  error(...args: any[]): void {
    console.error(this.prefix, ...args);
    
    // In production, could send to error reporting service
    if (FEATURES.ENABLE_ERROR_REPORTING) {
      this.sendToErrorService(args);
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(this.prefix, '[DEBUG]', ...args);
    }
  }

  /**
   * Log a table (only in development)
   */
  table(data: any): void {
    if (this.isDevelopment) {
      console.log(this.prefix);
      console.table(data);
    }
  }

  /**
   * Start a collapsible group (only in development)
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(this.prefix, label);
    }
  }

  /**
   * Start a collapsed group (only in development)
   */
  groupCollapsed(label: string): void {
    if (this.isDevelopment) {
      console.groupCollapsed(this.prefix, label);
    }
  }

  /**
   * End a group (only in development)
   */
  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Log with timing information (only in development)
   */
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(`${this.prefix} ${label}`);
    }
  }

  /**
   * End timing (only in development)
   */
  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`${this.prefix} ${label}`);
    }
  }

  /**
   * Assert a condition (only in development)
   */
  assert(condition: boolean, ...args: any[]): void {
    if (this.isDevelopment) {
      console.assert(condition, this.prefix, ...args);
    }
  }

  /**
   * Send error to reporting service (placeholder)
   */
  private sendToErrorService(error: any[]): void {
    // TODO: Implement error reporting service integration
    // Examples: Sentry, LogRocket, Rollbar, etc.
    // For now, just a placeholder
  }
}

// Create singleton instance
export const logger = new Logger();

/**
 * Conditional console methods that respect environment
 */
export const devConsole = {
  log: (...args: any[]) => logger.log(...args),
  info: (...args: any[]) => logger.info(...args),
  warn: (...args: any[]) => logger.warn(...args),
  error: (...args: any[]) => logger.error(...args),
  debug: (...args: any[]) => logger.debug(...args),
  table: (data: any) => logger.table(data),
  group: (label: string) => logger.group(label),
  groupCollapsed: (label: string) => logger.groupCollapsed(label),
  groupEnd: () => logger.groupEnd(),
  time: (label: string) => logger.time(label),
  timeEnd: (label: string) => logger.timeEnd(label),
  assert: (condition: boolean, ...args: any[]) => logger.assert(condition, ...args),
};

/**
 * Type-safe log level checker
 */
export const shouldLog = (level: LogLevel = 'log'): boolean => {
  if (level === 'error' || level === 'warn') {
    return true; // Always log errors and warnings
  }
  return FEATURES.ENABLE_DEBUG_LOGS;
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private markers: Map<string, number> = new Map();

  /**
   * Start measuring performance
   */
  start(label: string): void {
    if (FEATURES.ENABLE_PERFORMANCE_MONITORING || FEATURES.ENABLE_DEBUG_LOGS) {
      this.markers.set(label, performance.now());
      logger.debug(`⏱️ Performance: Started "${label}"`);
    }
  }

  /**
   * End measuring and log duration
   */
  end(label: string): number {
    if (FEATURES.ENABLE_PERFORMANCE_MONITORING || FEATURES.ENABLE_DEBUG_LOGS) {
      const startTime = this.markers.get(label);
      if (startTime !== undefined) {
        const duration = performance.now() - startTime;
        logger.debug(`⏱️ Performance: "${label}" took ${duration.toFixed(2)}ms`);
        this.markers.delete(label);
        return duration;
      }
    }
    return 0;
  }

  /**
   * Clear all markers
   */
  clear(): void {
    this.markers.clear();
  }
}

// Create singleton performance monitor
export const perfMonitor = new PerformanceMonitor();

/**
 * Helper to log API calls (only in development)
 */
export const logApiCall = (method: string, endpoint: string, data?: any): void => {
  if (FEATURES.ENABLE_DEBUG_LOGS) {
    logger.group(`🌐 API Call: ${method} ${endpoint}`);
    if (data) {
      logger.log('Payload:', data);
    }
    logger.log('Timestamp:', new Date().toISOString());
    logger.groupEnd();
  }
};

/**
 * Helper to log API response (only in development)
 */
export const logApiResponse = (endpoint: string, status: number, data?: any): void => {
  if (FEATURES.ENABLE_DEBUG_LOGS) {
    const emoji = status >= 200 && status < 300 ? '✅' : '❌';
    logger.group(`${emoji} API Response: ${endpoint} (${status})`);
    if (data) {
      logger.log('Response:', data);
    }
    logger.log('Timestamp:', new Date().toISOString());
    logger.groupEnd();
  }
};

/**
 * Helper to log component lifecycle (only in development)
 */
export const logComponentLifecycle = (componentName: string, event: 'mount' | 'unmount' | 'update'): void => {
  if (FEATURES.ENABLE_DEBUG_LOGS) {
    const emoji = event === 'mount' ? '🎨' : event === 'unmount' ? '🗑️' : '🔄';
    logger.debug(`${emoji} Component: ${componentName} - ${event}`);
  }
};

// Export default logger
export default logger;
