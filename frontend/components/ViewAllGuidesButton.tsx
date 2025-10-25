"use client";

import { FunctionComponent, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * "View All Guides" button component with animated hover effects
 * Features background color transitions and sliding text animation
 * Navigates to the Guides page when clicked
 */
const ViewAllGuidesButton: FunctionComponent = () => {
    const router = useRouter();
    
    const handleClick = useCallback(() => {
        router.push('/guides');
    }, [router]);

    return (
        <button
            onClick={handleClick}
            className="group w-[160px] sm:w-[200px] md:w-[250px] lg:w-[297px] h-[50px] sm:h-[60px] md:h-[76px] lg:h-[92px] relative text-left text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px] text-[#f2eee9] font-['Schibsted_Grotesk'] border-none bg-transparent cursor-pointer active:scale-95 transition-transform"
            aria-label="View all travel guides"
        >
            {/* Background */}
            <div className="absolute top-0 left-0 rounded-[32px] sm:rounded-[40px] md:rounded-[46px] lg:rounded-[52px] bg-[#1b3c44] w-full h-full transition-colors duration-300 group-hover:bg-[#0f2a30]" />

            {/* Circle */}
            <div className="absolute top-[6px] sm:top-[8px] md:top-[10px] lg:top-[12px] right-[8px] sm:right-[10px] md:right-[12px] lg:right-[15px] bg-[#f2eee9] w-[38px] sm:w-[44px] md:w-[55px] lg:w-[66px] h-[38px] sm:h-[44px] md:h-[56px] lg:h-[69px] rounded-full transition-colors duration-300 group-hover:bg-[#ebe6e0]" />

            {/* Text with sliding animation */}
            <div className="absolute top-[6px] sm:top-[8px] md:top-[10px] lg:top-[12px] left-[16px] sm:left-[20px] md:left-[30px] lg:left-[39px] right-[60px] sm:right-[70px] md:right-[85px] lg:right-[100px] h-[38px] sm:h-[44px] md:h-[56px] lg:h-[68px] overflow-hidden z-10">
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className="h-1/2 flex items-center justify-start text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-none text-[#f2eee9] whitespace-nowrap">
                        See All
                    </div>
                    <div className="h-1/2 flex items-center justify-start text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-none text-[#f2eee9] whitespace-nowrap">
                        See All
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <img
                className="absolute top-1/2 -translate-y-1/2 right-[18px] sm:right-[21px] md:right-[26px] lg:right-[32px] w-[18px] sm:w-[20px] md:w-[26px] lg:w-[31px] h-[18px] sm:h-[20px] md:h-[26px] lg:h-[32px] z-10 transition-transform duration-500 group-hover:rotate-12"
                alt="Arrow"
                src="Group.svg"
            />
        </button>
    );
};

export default ViewAllGuidesButton;
