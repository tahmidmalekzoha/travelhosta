import { FunctionComponent } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Constants for hero section content
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
 */
const HeroSection: FunctionComponent = () => {
    // Initialize scroll animations for hero elements
    useScrollAnimation({
        animationClasses: ['scroll-fade-in', 'scroll-slide-up', 'scroll-slide-left'],
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    return (
        <div className="w-full relative h-full rounded-[47px] overflow-hidden shadow-2xl scroll-fade-in">
            {/* Hero Background Image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center scroll-slide-up"
                style={{
                    backgroundImage: `${HERO_CONFIG.overlayGradient}, url("${HERO_CONFIG.backgroundImage}")`,
                }}
            />

            {/* TRAVELHOSTA Logo */}
            <div className="absolute top-6 md:top-8 lg:top-12 left-4 md:left-8 lg:left-12 z-10 scroll-slide-left">
                <img
                    src={HERO_CONFIG.logoSrc}
                    alt={HERO_CONFIG.logoAlt}
                    className="w-[300px] md:w-[500px] lg:w-[600px] xl:w-[730px] h-[60px] md:h-[90px] lg:h-[110px] xl:h-[130px] drop-shadow-lg"
                />
            </div>

            {/* Subtitle */}
            <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-4 md:left-8 lg:left-12 z-10 scroll-slide-up">
                <h2 className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-[64px] font-normal tracking-wide drop-shadow-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {HERO_CONFIG.subtitle}
                </h2>
            </div>
        </div>
    );
};

export default HeroSection;
