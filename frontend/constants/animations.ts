/**
 * Animation configuration constants
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
