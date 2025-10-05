/**
 * Sample data and navigation constants
 */

// Default card data
export const DEFAULT_CARD_IMAGE = '/images/dummy.jpg';
export const DEFAULT_YEAR = '2025';

// Navigation data
export const NAVIGATION_LINKS = [
    { path: '/', label: 'Home' },
    { path: '/guides', label: 'Guides' },
    { path: '/destinations', label: 'Destinations' },
    { path: '/about', label: 'About us' },
    { path: '/contact', label: 'Contact' },
] as const;

// Footer navigation data
export const FOOTER_NAVIGATION = {
    explore: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Destinations', href: '/destinations' },
        { label: 'Our guides', href: '/guides' },
    ],
    resources: [
        { label: 'Blog', href: '/blog' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Reviews', href: '/reviews' },
        { label: 'Contact', href: '/contact' },
    ],
    support: [
        { label: 'Style Guide', href: '/style-guide' },
        { label: 'Help Center', href: '/help' },
        { label: 'How to use', href: '/guide' },
        { label: 'FAQ Guide', href: '/faq' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Licenses', href: '/licenses' },
        { label: 'Cookies', href: '/cookies' },
    ],
} as const;

// Guide categories and divisions  
export const GUIDE_DIVISIONS = [
    { name: 'All Divisions' },
    { name: 'Dhaka' },
    { name: 'Chittagong' },
    { name: 'Khulna' },
    { name: 'Rajshahi' },
    { name: 'Sylhet' },
    { name: 'Barisal' },
    { name: 'Rangpur' }
] as const;

export const GUIDE_CATEGORIES = [
    { name: 'All Guides' },
    { name: 'Day Tour' },
    { name: 'Camping' },
    { name: 'Trekking' },
    { name: 'Staycation' },
    { name: 'Adventure' },
    { name: 'Cultural' },
    { name: 'Beach' }
] as const;
