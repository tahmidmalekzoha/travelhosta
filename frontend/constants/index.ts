/**
 * Application constants and configuration values
 */

// Animation configuration
export const ANIMATION_CONFIG = {
    /** Default scroll animation threshold */
    SCROLL_THRESHOLD: 0.1,
    /** Default root margin for intersection observer */
    SCROLL_ROOT_MARGIN: '0px 0px -50px 0px',
    /** Default blur strength for scroll reveal */
    BLUR_STRENGTH: 3,
    /** Default animation duration */
    ANIMATION_DURATION: 300,
    /** Default scroll scrub value */
    SCROLL_SCRUB: 3,
} as const;

// Scroll reveal animation classes
export const SCROLL_ANIMATION_CLASSES = [
    'scroll-fade-in',
    'scroll-slide-up',
    'scroll-slide-left',
    'scroll-slide-right'
] as const;

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
} as const;

// Color palette
export const COLORS = {
    PRIMARY: '#1b3c44',
    ACCENT: '#cd8453',
    BACKGROUND: '#f2eee9',
    CARD_BACKGROUND: '#e4d9d3',
    TEXT_DARK: '#1b3c44',
    TEXT_LIGHT: '#f2eee9',
} as const;

// Default card data
export const DEFAULT_CARD_IMAGE = 'images/dummy.jpg';
export const DEFAULT_YEAR = '2025';
