"use client";

import { useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import ViewAllGuidesButton from '../components/ViewAllGuidesButton';
import GuideCard from '../components/shared/GuideCard';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import StickyNavbar from '../components/StickyNavbar';
import { GuidesProvider, useGuides } from '../contexts/GuidesContext';
import { HeroProvider } from '../contexts/HeroContext';

/**
 * Main homepage containing all sections
 * Features responsive design with hero, description, cards, FAQ, and footer sections
 */
function HomeContent() {
    const { getFeaturedGuides } = useGuides();
    
    // Memoize featured guides to avoid recalculation on every render
    const featuredGuides = useMemo(() => getFeaturedGuides(), [getFeaturedGuides]);
    
    return (
        <div className="w-full relative overflow-hidden text-left text-black min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#f2eee9] to-[#ede8e0] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation Buttons */}
            <StickyNavbar />

            {/* Hero Section */}
            <div className="w-full p-2 sm:p-3 md:p-4 lg:p-[18px] h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[80vh] xl:h-[98vh] box-border">
                <HeroSection />
            </div>

            {/* Description Section */}
            <div className="w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[80vh] xl:min-h-[100vh] flex items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-[120px] px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-full px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20">
                    <ScrollReveal
                        enableBlur={true}
                        blurStrength={3}
                        textClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[64px] font-medium text-left leading-tight md:leading-snug lg:leading-[1.2]"
                        containerClassName=""
                    >
                        At TravelHosta, we make exploring easy and affordable. Guides for every
                        traveler budget or premium. With tips on stay, food, and safety. Whether
                        you&apos;re chasing hidden gems or planning your next big escape, we&apos;ve got
                        the roadmap ready for you.
                    </ScrollReveal>
                </div>
            </div>

            {/* Cards Section */}
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 xl:mb-20 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight text-[#1b3c44] flex-shrink min-w-0">
                        Featured Travel Guides
                    </h2>

                    {/* See All Button */}
                    <div className="flex-shrink-0">
                        <ViewAllGuidesButton />
                    </div>
                </div>

                {/* Guide Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                    {featuredGuides.map((guide) => (
                        <GuideCard
                            key={guide.id}
                            guide={guide}
                        />
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="w-full min-h-screen flex items-center justify-center bg-[#213c44]">
                <FAQSection />
            </div>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}

export default function Home() {
    return (
        <GuidesProvider>
            <HeroProvider>
                <HomeContent />
            </HeroProvider>
        </GuidesProvider>
    );
}
