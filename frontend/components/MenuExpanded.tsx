"use client";

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

    const handleSignIn = () => {
        router.push('/signin');
        onClose();
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Menu Container */}
            <div className="w-[48.25rem] relative h-[47.375rem] text-left text-[3.75rem] text-linen font-lato animate-fade-in-0 duration-300">
                {/* Background */}
                <div className="absolute top-[0rem] left-[0rem] rounded-[49px] bg-darkslategray w-[48.25rem] h-[47.375rem]" />

                {/* Navigation Links */}
                <button
                    onClick={() => handleNavigation('/')}
                    className="absolute top-[4.188rem] left-[3.75rem] font-bold hover:text-peru transition-colors duration-200"
                >
                    Home
                </button>
                <button
                    onClick={() => handleNavigation('/guides')}
                    className="absolute top-[11.063rem] left-[3.75rem] font-bold hover:text-peru transition-colors duration-200"
                >
                    Guides
                </button>
                <button
                    onClick={() => handleNavigation('/destinations')}
                    className="absolute top-[17.938rem] left-[3.75rem] font-bold hover:text-peru transition-colors duration-200"
                >
                    Destinations
                </button>
                <button
                    onClick={() => handleNavigation('/about')}
                    className="absolute top-[24.813rem] left-[3.75rem] font-bold hover:text-peru transition-colors duration-200"
                >
                    About us
                </button>
                <button
                    onClick={() => handleNavigation('/contact')}
                    className="absolute top-[31.688rem] left-[3.75rem] font-bold hover:text-peru transition-colors duration-200"
                >
                    Contact
                </button>

                {/* Sign In Button */}
                <div className="absolute top-[1.875rem] left-[28.5rem] w-[18.563rem] h-[5.75rem] text-[3rem] text-black font-schibsted-grotesk">
                    <button
                        onClick={handleSignIn}
                        className="group w-full h-full transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute top-[0rem] left-[0rem] rounded-[52px] bg-gainsboro w-[18.563rem] h-[5.75rem] group-hover:bg-opacity-80" />
                        <div className="absolute top-[0.938rem] left-[2.438rem] z-10">Sign In</div>
                        <div className="absolute top-[0.75rem] left-[13.75rem] rounded-[50%] bg-peru w-[4.125rem] h-[4.313rem] group-hover:bg-opacity-80" />
                        <img
                            className="absolute h-[35.22%] w-[10.37%] top-[34.47%] right-[9.54%] bottom-[30.31%] left-[80.09%] max-w-full overflow-hidden max-h-full z-10"
                            alt="Arrow"
                            src="/images/Arrow.svg"
                        />
                    </button>
                </div>

                {/* Close Menu Button */}
                <div className="absolute top-[8.438rem] left-[30.563rem] w-[16.5rem] h-[5.75rem] text-[3rem] text-black font-schibsted-grotesk">
                    <button
                        onClick={onClose}
                        className="group w-full h-full transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute top-[0rem] left-[0rem] rounded-[52px] bg-gainsboro w-[16.5rem] h-[5.75rem] group-hover:bg-opacity-80" />
                        <div className="absolute top-[0.844rem] left-[11.688rem] rounded-[50%] bg-peru w-[4.125rem] h-[4.125rem] group-hover:bg-opacity-80" />
                        <div className="absolute top-[2.688rem] left-[12.625rem] rounded-[3.5px] bg-linen w-[2.25rem] h-[0.438rem]" />
                        <div className="absolute top-[1.125rem] left-[2.125rem] inline-block w-[7.813rem] h-[3.5rem] z-10">Menu</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuExpanded;
