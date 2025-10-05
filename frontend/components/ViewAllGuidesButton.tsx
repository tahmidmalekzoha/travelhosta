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
            className="group w-full h-full relative text-left text-[48px] text-[#f2eee9] font-['Schibsted_Grotesk'] border-none bg-transparent cursor-pointer active:scale-95 transition-transform"
            aria-label="View all travel guides"
        >
            {/* Background */}
            <div className="absolute top-0 left-0 rounded-[52px] bg-[#1b3c44] w-[297px] h-[92px] transition-colors duration-300 group-hover:bg-[#0f2a30]" />

            {/* Circle */}
            <div className="absolute top-[12px] left-[220px] bg-[#f2eee9] w-[66px] h-[69px] transition-colors duration-300 group-hover:bg-[#ebe6e0] rounded-[33px]" />

            {/* Text with sliding animation */}
            <div className="absolute top-[12px] left-[39px] w-[160px] h-[68px] overflow-hidden z-10 px-1">
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className="h-1/2 flex items-center justify-start px-1 text-[48px] leading-none text-[#f2eee9] whitespace-nowrap">
                        See All
                    </div>
                    <div className="h-1/2 flex items-center justify-start px-1 text-[48px] leading-none text-[#f2eee9] whitespace-nowrap">
                        See All
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <img
                className="absolute top-[32px] left-[238px] w-[31px] h-[32px] z-10 transition-transform duration-500 group-hover:rotate-12"
                alt="Arrow"
                src="Group.svg"
            />
        </button>
    );
};

export default ViewAllGuidesButton;
