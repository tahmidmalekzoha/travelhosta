/**
 * Type definitions for TravelHosta application
 */

// Travel card related types
export interface TravelCardData {
    /** Unique identifier for analytics/tracking */
    cardId: string;
    /** Year or date to display */
    year: string;
    /** Main title of the card */
    title: string;
    /** Background image URL */
    imageUrl: string;
    /** Brief description (optional) */
    description?: string;
}

// Guide related types
export interface ItineraryStep {
    id: string;
    title: string;
    details: string[];
    tips?: string[]; // Optional tips for this specific step
    notes?: string[]; // Optional notes for this specific step
}

// Content block types for flexible guide structure
export type ContentBlockType = 'text' | 'timeline' | 'image' | 'imageGallery' | 'table' | 'tips' | 'notes';

export interface TextBlock {
    type: 'text';
    id: string;
    content: string; // Markdown supported
    heading?: string; // Optional heading for the text block
}

export interface TipsBlock {
    type: 'tips';
    id: string;
    title?: string; // Optional title for the tips section
    tips: string[]; // Array of tip strings
}

export interface NotesBlock {
    type: 'notes';
    id: string;
    title?: string; // Optional title for the notes section
    notes: string[]; // Array of note strings
}

export interface TimelineBlock {
    type: 'timeline';
    id: string;
    title?: string; // Optional title for the timeline section
    steps: ItineraryStep[];
}

export interface ImageBlock {
    type: 'image';
    id: string;
    url: string;
    caption?: string;
    alt?: string;
}

export interface ImageGalleryBlock {
    type: 'imageGallery';
    id: string;
    images: {
        url: string;
        caption?: string;
        alt?: string;
    }[];
    title?: string;
}

export interface TableBlock {
    type: 'table';
    id: string;
    title?: string; // Optional title for the table
    headers: string[]; // Column headers
    rows: string[][]; // Array of row data
    caption?: string; // Optional caption below table
}

export type ContentBlock = TextBlock | TimelineBlock | ImageBlock | ImageGalleryBlock | TableBlock | TipsBlock | NotesBlock;

// Language support types
export type Language = 'en' | 'bn';

export interface GuideTranslations {
    title: string;
    description: string;
    content?: ContentBlock[];
}

export interface GuideData {
    id: number;
    title: string;
    description: string;
    division: string;
    category: string;
    imageUrl: string | null; // Optional cover image - can be null if not provided
    tags?: string[]; // Optional tags for filtering guides
    itinerary?: ItineraryStep[]; // Legacy support
    content?: ContentBlock[]; // New flexible content structure (English by default)
    // Bilingual support
    titleBn?: string; // Bengali title
    descriptionBn?: string; // Bengali description
    contentBn?: ContentBlock[]; // Bengali content
}

// Animation related types
export interface ScrollAnimationOptions {
    /** CSS class names to observe for animation */
    animationClasses?: string[];
    /** Intersection observer threshold */
    threshold?: number;
    /** Root margin for the observer */
    rootMargin?: string;
}

export interface ScrollRevealConfig {
    /** Enable blur effect during animation */
    enableBlur?: boolean;
    /** Blur strength in pixels */
    blurStrength?: number;
    /** Container element for scroll tracking */
    scrollContainer?: HTMLElement | null;
    /** Animation start trigger point */
    startTrigger?: string;
    /** Animation end trigger point */
    endTrigger?: string;
    /** Scrub value for scroll-linked animation */
    scrubValue?: number;
}

// Component prop types
export interface HeroSectionProps {
    /** Background image URL (optional) */
    backgroundImage?: string;
    /** Hero title text (optional) */
    title?: string;
    /** Hero subtitle text (optional) */
    subtitle?: string;
}

export interface LayoutProps {
    /** Page content to render between navbar and footer */
    children: React.ReactNode;
    /** Additional CSS classes for the layout */
    className?: string;
}

// Event handler types
export type ClickHandler = () => void;
export type MenuToggleHandler = (isOpen: boolean) => void;
export type ScrollHandler = (scrollY: number) => void;

// Navigation types
export interface NavigationLink {
    path: string;
    label: string;
}

export interface FooterLink {
    label: string;
    href: string;
}

// FAQ types
export type FAQCategory = 'general' | 'subscription' | 'privacy';

export interface FAQItem {
    question: string;
    answer: string;
    category: FAQCategory;
}

export interface FAQCategoryOption {
    key: FAQCategory;
    label: string;
}

// Admin types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    createdAt: string;
    lastLogin?: string;
}

export interface HeroImage {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    isActive: boolean;
    uploadedAt: string;
}

export interface AnalyticsData {
    totalUsers: number;
    totalGuides: number;
    pageViews: number;
    popularGuides: {
        id: number;
        title: string;
        views: number;
    }[];
    userGrowth: {
        date: string;
        count: number;
    }[];
    recentActivity: {
        id: string;
        type: 'user_signup' | 'guide_view' | 'guide_created';
        description: string;
        timestamp: string;
    }[];
}
