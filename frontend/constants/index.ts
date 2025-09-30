/**
 * Application constants and configuration values
 */

import type { GuideData } from '../types';

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

// FAQ data
export interface FAQItem {
    question: string;
    answer: string;
    category: 'general' | 'subscription' | 'privacy';
}

export const FAQ_DATA: FAQItem[] = [
    {
        question: "What is TravelHosta?",
        answer: "TravelHosta is your ultimate travel companion that provides comprehensive guides for every type of traveler, whether you're on a budget or looking for premium experiences. We offer detailed tips on accommodation, food, and safety to help you explore the world with confidence.",
        category: 'general'
    },
    {
        question: "How do I book accommodations through TravelHosta?",
        answer: "TravelHosta provides curated recommendations and guides, but we don't directly handle bookings. We partner with trusted booking platforms and provide direct links to help you secure the best deals on accommodations that match your travel style and budget.",
        category: 'general'
    },
    {
        question: "Are your travel guides suitable for solo travelers?",
        answer: "Absolutely! Our guides are designed with solo travelers in mind, including specific safety tips, solo-friendly accommodation recommendations, and suggestions for meeting other travelers. We understand the unique needs of solo adventurers.",
        category: 'general'
    },
    {
        question: "What subscription plans do you offer?",
        answer: "We offer flexible subscription plans including a free tier with basic guides, a premium monthly plan with exclusive content and personalized recommendations, and an annual plan with additional perks like priority customer support and early access to new destinations.",
        category: 'subscription'
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time through your account settings. If you cancel, you'll continue to have access to premium features until the end of your current billing cycle, and then you'll automatically switch to our free tier.",
        category: 'subscription'
    },
    {
        question: "How do you protect my personal information?",
        answer: "We take your privacy seriously and use industry-standard encryption to protect your data. We never share your personal information with third parties without your consent, and you can review and manage your data preferences in your account settings at any time.",
        category: 'privacy'
    }
] as const;

// FAQ categories
export const FAQ_CATEGORIES = [
    { key: 'general' as const, label: 'General' },
    { key: 'subscription' as const, label: 'Subscription' },
    { key: 'privacy' as const, label: 'Privacy' }
] as const;

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

// Sample guide data
export const GUIDES_DATA: GuideData[] = [
    {
        id: 1,
        title: 'Historic Dhaka Tour',
        description: 'Explore Old Dhaka\'s heritage sites and cultural landmarks',
        division: 'Dhaka',
        category: 'Day Tour',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 2,
        title: 'Cox\'s Bazar Beach',
        description: 'World\'s longest natural beach with stunning sunsets',
        division: 'Chittagong',
        category: 'Beach',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 3,
        title: 'Sundarbans Adventure',
        description: 'Royal Bengal Tiger sanctuary and mangrove exploration',
        division: 'Khulna',
        category: 'Adventure',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 4,
        title: 'Tea Garden Trek',
        description: 'Sylhet\'s scenic tea gardens and hill country',
        division: 'Sylhet',
        category: 'Trekking',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 5,
        title: 'Srimangal Nature Walk',
        description: 'Tropical rainforest and wildlife sanctuary',
        division: 'Sylhet',
        category: 'Camping',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 6,
        title: 'Rajshahi Silk Route',
        description: 'Historical silk production and cultural heritage',
        division: 'Rajshahi',
        category: 'Cultural',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 7,
        title: 'Kuakata Beach Retreat',
        description: 'Panoramic sea beach with both sunrise and sunset views',
        division: 'Barisal',
        category: 'Staycation',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 8,
        title: 'Rangpur Countryside',
        description: 'Rural Bangladesh experience with local communities',
        division: 'Rangpur',
        category: 'Cultural',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 9,
        title: 'Bandarban Hill Climbing',
        description: 'Highest peaks and indigenous culture exploration',
        division: 'Chittagong',
        category: 'Adventure',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 10,
        title: 'Paharpur Buddhist Monastery',
        description: 'UNESCO World Heritage archaeological site',
        division: 'Rajshahi',
        category: 'Day Tour',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 11,
        title: 'Rocket Steamer Journey',
        description: 'Historic paddle steamer river cruise experience',
        division: 'Barisal',
        category: 'Cultural',
        imageUrl: 'images/dummy.jpg'
    },
    {
        id: 12,
        title: 'Chittagong Hill Tracts',
        description: 'Indigenous culture and pristine natural beauty',
        division: 'Chittagong',
        category: 'Trekking',
        imageUrl: 'images/dummy.jpg'
    }
] as const;
