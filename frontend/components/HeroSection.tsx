"use client";

import { FunctionComponent } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useHero } from '../contexts/HeroContext';

// Constants for default hero section content
const HERO_CONFIG = {
    logoAlt: 'TRAVELHOSTA',
    logoSrc: '/images/logo.svg',
    subtitle: 'Sajek, Hill of Wonders',
    backgroundImage: '/images/hero-background.jpg',
    overlayGradient: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5))',
} as const;

/**
 * Hero section component with animated background image and text elements
 * Features responsive design and scroll-based animations
 * Dynamically loads active hero image from database
 */
const HeroSection: FunctionComponent = () => {
    const { activeHero, loading } = useHero();
    
    // Initialize scroll animations for hero elements
    useScrollAnimation({
        animationClasses: ['scroll-fade-in', 'scroll-slide-up', 'scroll-slide-left'],
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Use active hero if available, otherwise use default config
    const heroImage = activeHero?.imageUrl || HERO_CONFIG.backgroundImage;
    const heroTitle = activeHero?.title || HERO_CONFIG.logoAlt;
    const heroSubtitle = activeHero?.subtitle || HERO_CONFIG.subtitle;

    return (
        <div className="w-full relative h-full rounded-[24px] sm:rounded-[32px] md:rounded-[38px] lg:rounded-[47px] overflow-hidden shadow-2xl scroll-fade-in">
            {/* Hero Background Image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center scroll-slide-up transition-all duration-300"
                style={{
                    backgroundImage: `${HERO_CONFIG.overlayGradient}, url("${heroImage}")`,
                }}
            />

            {/* TRAVELHOSTA Logo */}
            <div className="absolute top-3 sm:top-4 md:top-6 lg:top-8 xl:top-12 left-3 sm:left-4 md:left-6 lg:left-8 xl:left-12 z-10 scroll-slide-left">
                <img
                    src={HERO_CONFIG.logoSrc}
                    alt={heroTitle}
                    className="w-[180px] sm:w-[240px] md:w-[350px] lg:w-[500px] xl:w-[730px] h-[36px] sm:h-[48px] md:h-[70px] lg:h-[90px] xl:h-[130px] drop-shadow-lg"
                />
            </div>

            {/* Subtitle */}
            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-12 left-3 sm:left-4 md:left-6 lg:left-8 xl:left-12 z-10 scroll-slide-up">
                <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-[64px] font-normal tracking-wide drop-shadow-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {heroSubtitle}
                </h2>
            </div>
        </div>
    );
};

export default HeroSection;
