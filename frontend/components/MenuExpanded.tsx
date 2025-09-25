"use client";

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import SigninButton from './SigninButton';
import AnimatedButton from './shared/AnimatedButton';
import { NAVIGATION_LINKS } from '../constants';

interface MenuExpandedProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Expanded menu overlay component with navigation links
 * Features animated entrance/exit and navigation functionality
 */
const MenuExpanded: FunctionComponent<MenuExpandedProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-[220px] right-8 w-[400px] bg-slate-800/95 backdrop-blur-sm rounded-[25px] shadow-2xl text-white overflow-hidden transition-all duration-300 ease-out animate-in slide-in-from-top-3 fade-in-0 z-40">
            {/* Navigation Links */}
            <div className="px-8 py-8 space-y-6">
                {NAVIGATION_LINKS.map((link) => (
                    <button
                        key={link.path}
                        onClick={() => handleNavigation(link.path)}
                        className="block w-full text-left text-3xl font-regular hover:text-orange-300 transition-all duration-300 hover:translate-x-2 hover:scale-105"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                        {link.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MenuExpanded;
