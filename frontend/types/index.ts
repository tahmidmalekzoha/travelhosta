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
