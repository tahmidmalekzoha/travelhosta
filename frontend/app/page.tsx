"use client";

import { useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import ViewAllGuidesButton from '../components/ViewAllGuidesButton';
import GuideCard from '../components/shared/GuideCard';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import StickyNavbar from '../components/StickyNavbar';
import { useGuides } from '../contexts/GuidesContext';

/**
 * Main homepage containing all sections
 * Features responsive design with hero, description, cards, FAQ, and footer sections
 */
export default function Home() {
    const { getFeaturedGuides } = useGuides();
    
    // Memoize featured guides to avoid recalculation on every render
    const featuredGuides = useMemo(() => getFeaturedGuides(), [getFeaturedGuides]);
    
    return (
        <div className="w-full relative overflow-hidden text-left text-black min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#f2eee9] to-[#ede8e0] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation Buttons */}
            <StickyNavbar />

            {/* Hero Section */}
            <div className="w-full p-3 md:p-[18px] h-[60vh] md:h-[80vh] lg:h-[98vh] box-border">
                <HeroSection />
            </div>

            {/* Description Section */}
            <div className="w-full min-h-[60vh] md:min-h-[80vh] lg:min-h-[100vh] flex items-center justify-center py-12 md:py-16 lg:py-[120px] px-4 md:px-8">
                <div className="w-full px-4 md:px-12 lg:px-20">
                    <ScrollReveal
                        enableBlur={true}
                        blurStrength={3}
                        textClassName="text-2xl md:text-4xl lg:text-5xl xl:text-[64px] font-medium text-left leading-tight md:leading-snug lg:leading-[1.2]"
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
            <div className="w-full px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-20">
                {/* Section Header */}
                <div className="flex flex-row justify-between items-center mb-8 md:mb-12 lg:mb-16 xl:mb-20 gap-4 md:gap-6 lg:gap-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight text-[#1b3c44] flex-shrink min-w-0">
                        Featured Travel Guides
                    </h2>

                    {/* See All Button */}
                    <div className="flex-shrink-0">
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
            <div className="w-full min-h-screen flex items-center justify-center bg-[#213c44]">
                <FAQSection />
            </div>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
