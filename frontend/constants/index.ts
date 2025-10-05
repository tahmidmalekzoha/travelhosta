/**
 * Central export point for all constants
 * Application constants and configuration values
 * Re-exports from individual constant modules
 */

// Theme constants
export { COLORS, BREAKPOINTS } from './theme';

// Animation constants
export { ANIMATION_CONFIG, SCROLL_ANIMATION_CLASSES } from './animations';

// FAQ constants
export { FAQ_DATA, FAQ_CATEGORIES } from './faq';

// Navigation and misc constants
export {
    DEFAULT_CARD_IMAGE,
    DEFAULT_YEAR,
    NAVIGATION_LINKS,
    FOOTER_NAVIGATION,
    GUIDE_DIVISIONS,
    GUIDE_CATEGORIES,
} from './navigation';

// Note: GUIDES_DATA has been removed as guides are now stored in Supabase database
// Use the GuidesContext to fetch guides instead
