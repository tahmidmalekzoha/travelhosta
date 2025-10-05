"use client";

import { useMemo } from 'react';
import HeroSection from './HeroSection';
import ViewAllGuidesButton from './ViewAllGuidesButton';
import GuideCard from './shared/GuideCard';
import FAQSection from './FAQSection';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import StickyNavbar from './StickyNavbar';
import { useGuides } from '../contexts/GuidesContext';

// Theme colors used throughout the homepage
const THEME_COLORS = {
    background: 'linear-gradient(135deg, #f8f6f1 0%, #f2eee9 50%, #ede8e0 100%)',
    heading: '#1b3c44',
    faqBackground: '#213c44',
} as const;

/**
 * Main homepage component containing all sections
 * Features responsive design with hero, description, cards, FAQ, and footer sections
 */
export default function HomePage() {
    const { getFeaturedGuides } = useGuides();
    
    // Memoize featured guides to avoid recalculation on every render
    const featuredGuides = useMemo(() => getFeaturedGuides(), [getFeaturedGuides]);
    
    return (
        <div
            className="w-full relative overflow-hidden text-left text-black min-h-screen"
            style={{
                background: THEME_COLORS.background,
                fontFamily: 'Schibsted Grotesk, sans-serif'
            }}
        >
            {/* Sticky Navigation Buttons */}
            <StickyNavbar />

            {/* Hero Section */}
            <div className="w-full p-[18px] h-[98vh] box-border">
                <HeroSection />
            </div>

            {/* Description Section */}
            <div className="w-full h-[100vh] flex items-center justify-center py-[120px]">
                <div className="w-full px-20">
                    <ScrollReveal
                        enableBlur={true}
                        blurStrength={3}
                        textClassName="text-[64px] font-medium text-left leading-[40px]"
                        containerClassName=""
                    >
                        At TravelHosta, we make exploring easy and affordable. Guides for every
                        traveler budget or premium. With tips on stay, food, and safety. Whether
                        you're chasing hidden gems or planning your next big escape, we've got
                        the roadmap ready for you.
                    </ScrollReveal>
                </div>
            </div>

            {/* Cards Section */}
            <div className="w-full px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-20">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 md:mb-16 lg:mb-20 gap-8">
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                        style={{ color: THEME_COLORS.heading }}
                    >
                        Featured Travel Guides
                    </h2>

                    {/* See All Button */}
                    <div className="w-[297px] h-[92px] flex-shrink-0 p-0">
                        <ViewAllGuidesButton />
                    </div>
                </div>

                {/* Guide Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                    {featuredGuides.map((guide) => (
                        <GuideCard
                            key={guide.id}
                            guide={guide}
                        />
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div 
                className="w-full h-[100vh] flex items-center justify-center"
                style={{ backgroundColor: THEME_COLORS.faqBackground }}
            >
                <FAQSection />
            </div>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
