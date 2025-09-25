"use client";

import { FunctionComponent, useState } from 'react';
import SigninButton from './SigninButton';
import MenuButton from './MenuButton';
import MenuExpanded from './MenuExpanded';

/**
 * Sticky navigation bar positioned at the top-right corner
 * Contains sign-in button and menu button with responsive positioning
 */
const StickyNavbar: FunctionComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

            {/* Fixed positioned buttons that never move */}
            <div className="fixed top-8 right-8 z-50 flex flex-col gap-2 md:gap-3 items-end">
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