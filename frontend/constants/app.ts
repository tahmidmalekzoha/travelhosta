/**
 * Application-wide Constants
 * Centralized location for all magic strings, numbers, and configuration values
 * Used throughout the TravelHosta application
 */

// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Helper function to check if user has admin access
export const isAdminRole = (role: string): boolean => {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SUPERADMIN;
};

// ============================================
// ROUTES & PATHS
// ============================================

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  GUIDES: '/guides',
  DESTINATIONS: '/destinations',
  ADMIN: {
    ROOT: '/admin',
    GUIDES: '/admin/guides',
    CATEGORIES: '/admin/categories',
    USERS: '/admin/users',
    FEATURED: '/admin/featured',
    HERO: '/admin/hero',
    PROFILE: '/admin/profile',
    AUDIT: '/admin/audit',
    ITINERARY_DEMO: '/admin/itinerary-demo',
  },
} as const;

// ============================================
// LANGUAGE CODES
// ============================================

export const LANGUAGES = {
  ENGLISH: 'en',
  BENGALI: 'bn',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// ============================================
// CONTENT BLOCK TYPES
// ============================================

export const CONTENT_BLOCK_TYPES = {
  TEXT: 'text',
  TIMELINE: 'timeline',
  IMAGE: 'image',
  IMAGE_GALLERY: 'imageGallery',
  TABLE: 'table',
  TIPS: 'tips',
  NOTES: 'notes',
  PROS_CONS: 'proscons',
} as const;

export type ContentBlockType = typeof CONTENT_BLOCK_TYPES[keyof typeof CONTENT_BLOCK_TYPES];

// ============================================
// TOAST TYPES
// ============================================

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export type ToastType = typeof TOAST_TYPES[keyof typeof TOAST_TYPES];

// ============================================
// GUIDE AUDIT ACTIONS
// ============================================

export const AUDIT_ACTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

// ============================================
// FORM VALIDATION
// ============================================

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-z0-9_-]+$/,
    COOLDOWN_HOURS: 24,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  GUIDE_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  GUIDE_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  DISPLAY_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    COOLDOWN_HOURS: 24,
  },
} as const;

// ============================================
// CACHE & STORAGE
// ============================================

export const CACHE_CONFIG = {
  FORM_DATA_KEY: 'travelhosta_form_data',
  CONTENT_TEXT_KEY: 'travelhosta_content_text',
  CONTENT_TEXT_BN_KEY: 'travelhosta_content_text_bn',
  SESSION_KEY: 'travelhosta_session',
  EXPIRATION_HOURS: 1, // Form cache expiration
  SESSION_EXPIRATION_HOURS: 24, // Session cache expiration
} as const;

// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  GUIDES: '/api/guides',
  CATEGORIES: '/api/categories',
  USERS: '/api/users',
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    SIGNOUT: '/api/auth/signout',
    PROFILE: '/api/auth/profile',
  },
} as const;

// ============================================
// ANIMATION SETTINGS
// ============================================

export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  SCROLL: {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '0px 0px -100px 0px',
  },
} as const;

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_BUTTONS: 7, // Number of page buttons to show
} as const;

// ============================================
// IMAGE SETTINGS
// ============================================

export const IMAGE_CONFIG = {
  PLACEHOLDER: '/images/dummy.jpg',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_WIDTH: 2048,
  MAX_HEIGHT: 2048,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  AUTH: {
    UNAUTHORIZED: 'You must be signed in to access this page',
    FORBIDDEN: 'You do not have permission to access this page',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again',
    INVALID_CREDENTIALS: 'Invalid email or password',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`,
    USERNAME_TOO_SHORT: `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters`,
    INVALID_USERNAME: 'Username can only contain lowercase letters, numbers, hyphens, and underscores',
  },
  NETWORK: {
    GENERIC: 'An error occurred. Please try again',
    TIMEOUT: 'Request timed out. Please check your connection',
    OFFLINE: 'You appear to be offline. Please check your internet connection',
  },
  GUIDE: {
    NOT_FOUND: 'Guide not found',
    CREATION_FAILED: 'Failed to create guide',
    UPDATE_FAILED: 'Failed to update guide',
    DELETE_FAILED: 'Failed to delete guide',
  },
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGNIN: 'Successfully signed in',
    SIGNUP: 'Account created successfully',
    SIGNOUT: 'Successfully signed out',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  GUIDE: {
    CREATED: 'Guide created successfully',
    UPDATED: 'Guide updated successfully',
    DELETED: 'Guide deleted successfully',
    PUBLISHED: 'Guide published successfully',
    UNPUBLISHED: 'Guide unpublished successfully',
  },
} as const;

// ============================================
// TIMING
// ============================================

export const TIMING = {
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  AUTO_SAVE_DELAY: 1000, // 1 second
  SESSION_CHECK_INTERVAL: 60000, // 1 minute
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_PERFORMANCE_MONITORING: false, // To be enabled later
} as const;

// ============================================
// DIVISONS (Bangladesh)
// ============================================

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
] as const;

export type Division = typeof BANGLADESH_DIVISIONS[number];

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULTS = {
  USER_ROLE: USER_ROLES.USER,
  LANGUAGE: LANGUAGES.ENGLISH,
  ITEMS_PER_PAGE: PAGINATION.DEFAULT_PAGE_SIZE,
  SORT_ORDER: 'desc' as const,
  SORT_FIELD: 'updated_at' as const,
} as const;
