"use client";

import { FunctionComponent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface MenuExpandedProps {
    isOpen: boolean;
    onClose: () => void;
}

// Navigation menu items configuration
const MENU_ITEMS = [
    { label: 'Home', path: '/' },
    { label: 'Guides', path: '/guides' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'About us', path: '/about' },
    { label: 'Contact', path: '/contact' },
] as const;

// Menu styling constants
const MENU_STYLES = {
    background: {
        color: '#cd8453',
        borderRadius: '49px',
    },
    text: {
        color: '#f2eee9',
        fontFamily: 'Lato, sans-serif',
    },
} as const;

/**
 * Expanded menu overlay component with navigation links
 * Features animated entrance/exit and navigation functionality
 * Positioned at top-right corner below the sticky navbar
 */
const MenuExpanded: FunctionComponent<MenuExpandedProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    const handleNavigation = useCallback((path: string) => {
        router.push(path);
        onClose();
    }, [router, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-[60px] sm:top-[70px] md:top-[82px] right-2 sm:right-4 md:right-8 lg:right-[50px] z-40 transition-all duration-300 ease-out w-[calc(100vw-1rem)] sm:w-[90vw] md:w-[600px] lg:w-[772px] max-w-[772px]"
            style={{
                color: MENU_STYLES.text.color,
                fontFamily: MENU_STYLES.text.fontFamily
            }}
        >
            {/* Background */}
            <div
                className="absolute rounded-[28px] sm:rounded-[35px] md:rounded-[42px] lg:rounded-[49px] inset-0"
                style={{
                    backgroundColor: MENU_STYLES.background.color,
                    top: '-20px',
                    right: '-8px',
                    bottom: '-20px',
                    left: '-8px'
                }}
            />

            {/* Navigation Menu Items */}
            <div className="relative py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className="block w-full text-left cursor-pointer hover:opacity-80 transition-opacity text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.75rem] py-2 sm:py-3"
                        style={{
                            color: MENU_STYLES.text.color,
                            fontFamily: MENU_STYLES.text.fontFamily,
                            background: 'none',
                            border: 'none'
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MenuExpanded;
