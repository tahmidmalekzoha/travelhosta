"use client";

import { FunctionComponent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface MenuExpandedProps {
    isOpen: boolean;
    onClose: () => void;
}

// Navigation menu items configuration
const MENU_ITEMS = [
    { label: 'Home', path: '/', top: '4.188rem' },
    { label: 'Guides', path: '/guides', top: '11.063rem' },
    { label: 'Destinations', path: '/destinations', top: '17.938rem' },
    { label: 'About us', path: '/about', top: '24.813rem' },
    { label: 'Contact', path: '/contact', top: '31.688rem' },
] as const;

// Menu styling constants
const MENU_STYLES = {
    background: {
        color: '#28231d',
        borderRadius: '49px',
    },
    text: {
        color: '#f2eee9',
        fontSize: '3.75rem',
        fontFamily: 'Lato, sans-serif',
    },
    itemLeft: '3.75rem',
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
            className="fixed top-[82px] right-[50px] z-40 transition-all duration-300 ease-out"
            style={{
                width: '48.25rem',
                height: '47.375rem',
                fontSize: MENU_STYLES.text.fontSize,
                color: MENU_STYLES.text.color,
                fontFamily: MENU_STYLES.text.fontFamily
            }}
        >
            {/* Background */}
            <div
                className="absolute rounded-[49px]"
                style={{
                    backgroundColor: MENU_STYLES.background.color,
                    width: '48.25rem',
                    height: '47.375rem',
                    top: '-30px',
                    right: '-16px'
                }}
            />

            {/* Navigation Menu Items */}
            {MENU_ITEMS.map((item) => (
                <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="absolute cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                        top: item.top,
                        left: MENU_STYLES.itemLeft,
                        fontSize: MENU_STYLES.text.fontSize,
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
    );
};

export default MenuExpanded;
