"use client";

import { FunctionComponent, useState } from 'react';

const MenuButton: FunctionComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log('Menu toggled:', !isMenuOpen);
        // Add your menu logic here
        // Example: show/hide navigation menu
    };

    return (
        <button
            onClick={handleMenuToggle}
            className="group w-[250px] relative h-[92px] text-left text-[48px] text-black font-['Schibsted_Grotesk'] transition-all duration-300 active:scale-95 cursor-pointer border-none bg-transparent"
        >
            {/* Background */}
            <div className="absolute top-0 left-0 rounded-[52px] bg-[#e4d9d3] w-[250px] h-[92px] transition-all duration-300 group-hover:bg-[#ddd2cc]" />

            {/* Text with sliding animation */}
            <div className="absolute top-[12px] left-[39px] w-[140px] h-[68px] z-10 overflow-hidden px-1">
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className="h-1/2 flex items-center justify-start whitespace-nowrap text-[48px] leading-none">Menu</div>
                    <div className="h-1/2 flex items-center justify-start whitespace-nowrap text-[48px] leading-none">Menu</div>
                </div>
            </div>

            {/* Circle Background */}
            <div className={`absolute top-[12px] left-[173px] bg-[#cd8453] w-[66px] h-[69px] transition-all duration-300 group-hover:bg-[#b8743c] ${isMenuOpen ? 'rotate-180' : ''}`} style={{ borderRadius: '33px / 34.5px' }} />

            {/* Menu Icon - no hover animation, only click state */}
            <img
                className={`absolute top-[32px] left-[191px] w-[31px] h-[32px] z-10 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                alt="Menu"
                src="/images/Vector.svg"
            />
        </button>
    );
};

export default MenuButton;
