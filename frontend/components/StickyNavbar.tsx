"use client";

import { FunctionComponent, useState, useEffect } from 'react';
import SigninButton from './SigninButton';
import MenuButton from './MenuButton';
import MenuExpanded from './MenuExpanded';

/**
 * Sticky navigation bar positioned at the top-right corner
 * Contains sign-in button and menu button with responsive positioning
 * Hides on scroll down and shows on scroll up with smooth animations
 */
const StickyNavbar: FunctionComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    // Show navbar if scrolling up or at the top
                    // Hide navbar if scrolling down (and not at the very top)
                    if (currentScrollY < lastScrollY) {
                        // Scrolling up
                        setIsVisible(true);
                    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        // Scrolling down and past threshold
                        setIsVisible(false);
                    }

                    // Always show at the very top
                    if (currentScrollY < 50) {
                        setIsVisible(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Blur backdrop for menu focus and closing when clicking outside */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/5 transition-all duration-300"
                    style={{ backdropFilter: 'blur(3px)' }}
                    onClick={handleMenuClose}
                />
            )}

            {/* Fixed positioned buttons with scroll-based visibility */}
            <div 
                className={`fixed top-4 sm:top-8 md:top-12 lg:top-16 xl:top-[82px] right-2 sm:right-4 md:right-6 lg:right-8 xl:right-[50px] z-50 flex flex-col gap-2 md:gap-3 items-end transition-all duration-500 ease-in-out ${
                    isVisible 
                        ? 'translate-y-0 opacity-100' 
                        : '-translate-y-[200%] opacity-0'
                }`}
            >
                <SigninButton />
                <MenuButton onClick={handleMenuToggle} isOpen={isMenuOpen} />
            </div>

            {/* Menu overlay that appears below the fixed buttons */}
            {isMenuOpen && (
                <MenuExpanded isOpen={isMenuOpen} onClose={handleMenuClose} />
            )}
        </>
    );
};

export default StickyNavbar;