/**
 * FAQ (Frequently Asked Questions) constants
 */

import type { FAQItem } from '../types';

// FAQ data
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
