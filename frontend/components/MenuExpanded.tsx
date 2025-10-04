"use client";

import { FunctionComponent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface MenuExpandedProps {
    isOpen: boolean;
    onClose: () => void;
}

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
                fontSize: '3.75rem',
                color: '#f2eee9',
                fontFamily: 'Lato, sans-serif'
            }}
        >
            {/* Background */}
            <div
                className="absolute rounded-[49px]"
                style={{
                    backgroundColor: '#cd8453',
                    width: '48.25rem',
                    height: '47.375rem',
                    top: '-30px',
                    right: '-16px'
                }}
            />

            {/* Navigation Menu Items */}
            <button
                onClick={() => handleNavigation('/')}
                className="absolute cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                    top: '4.188rem',
                    left: '3.75rem',
                    fontSize: '3.75rem',
                    color: '#f2eee9',
                    fontFamily: 'Lato, sans-serif',
                    background: 'none',
                    border: 'none'
                }}
            >
                Home
            </button>

            <button
                onClick={() => handleNavigation('/guides')}
                className="absolute cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                    top: '11.063rem',
                    left: '3.75rem',
                    fontSize: '3.75rem',
                    color: '#f2eee9',
                    fontFamily: 'Lato, sans-serif',
                    background: 'none',
                    border: 'none'
                }}
            >
                Guides
            </button>

            <button
                onClick={() => handleNavigation('/destinations')}
                className="absolute cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                    top: '17.938rem',
                    left: '3.75rem',
                    fontSize: '3.75rem',
                    color: '#f2eee9',
                    fontFamily: 'Lato, sans-serif',
                    background: 'none',
                    border: 'none'
                }}
            >
                Destinations
            </button>

            <button
                onClick={() => handleNavigation('/about')}
                className="absolute cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                    top: '24.813rem',
                    left: '3.75rem',
                    fontSize: '3.75rem',
                    color: '#f2eee9',
                    fontFamily: 'Lato, sans-serif',
                    background: 'none',
                    border: 'none'
                }}
            >
                About us
            </button>

            <button
                onClick={() => handleNavigation('/contact')}
                className="absolute cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                    top: '31.688rem',
                    left: '3.75rem',
                    fontSize: '3.75rem',
                    color: '#f2eee9',
                    fontFamily: 'Lato, sans-serif',
                    background: 'none',
                    border: 'none'
                }}
            >
                Contact
            </button>
        </div>
    );
};

export default MenuExpanded;
