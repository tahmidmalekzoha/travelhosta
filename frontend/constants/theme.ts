/**
 * Theme constants - Colors, breakpoints, and styling
 */

// Color palette
export const COLORS = {
    PRIMARY: '#1b3c44',
    ACCENT: '#cd8453',
    BACKGROUND: '#f2eee9',
    CARD_BACKGROUND: '#e4d9d3',
    TEXT_DARK: '#1b3c44',
    TEXT_LIGHT: '#f2eee9',
} as const;

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
} as const;
