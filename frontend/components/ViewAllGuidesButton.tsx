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
            className="group w-[130px] sm:w-[150px] md:w-[180px] lg:w-[220px] xl:w-[297px] h-[44px] sm:h-[50px] md:h-[60px] lg:h-[70px] xl:h-[92px] relative text-left text-[20px] sm:text-[24px] md:text-[30px] lg:text-[38px] xl:text-[48px] text-[#f2eee9] font-['Schibsted_Grotesk'] border-none bg-transparent cursor-pointer active:scale-95 transition-transform"
            aria-label="View all travel guides"
        >
            {/* Background */}
            <div className="absolute top-0 left-0 rounded-[24px] sm:rounded-[28px] md:rounded-[36px] lg:rounded-[44px] xl:rounded-[52px] bg-[#1b3c44] w-full h-full transition-colors duration-300 group-hover:bg-[#0f2a30]" />

            {/* Circle */}
            <div className="absolute top-[4px] sm:top-[6px] md:top-[8px] lg:top-[10px] xl:top-[12px] right-[6px] sm:right-[8px] md:right-[10px] lg:right-[12px] xl:right-[15px] bg-[#f2eee9] w-[36px] sm:w-[38px] md:w-[44px] lg:w-[50px] xl:w-[66px] h-[36px] sm:h-[38px] md:h-[44px] lg:h-[50px] xl:h-[69px] rounded-full transition-colors duration-300 group-hover:bg-[#ebe6e0]" />

            {/* Text with sliding animation */}
            <div className="absolute top-[4px] sm:top-[6px] md:top-[8px] lg:top-[10px] xl:top-[12px] left-[12px] sm:left-[14px] md:left-[18px] lg:left-[25px] xl:left-[39px] right-[50px] sm:right-[54px] md:right-[62px] lg:right-[72px] xl:right-[100px] h-[36px] sm:h-[38px] md:h-[44px] lg:h-[50px] xl:h-[68px] overflow-hidden z-10">
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className="h-1/2 flex items-center justify-start text-[20px] sm:text-[24px] md:text-[30px] lg:text-[38px] xl:text-[48px] leading-none text-[#f2eee9] whitespace-nowrap">
                        See All
                    </div>
                    <div className="h-1/2 flex items-center justify-start text-[20px] sm:text-[24px] md:text-[30px] lg:text-[38px] xl:text-[48px] leading-none text-[#f2eee9] whitespace-nowrap">
                        See All
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <img
                className="absolute top-1/2 -translate-y-1/2 right-[14px] sm:right-[16px] md:right-[20px] lg:right-[24px] xl:right-[32px] w-[16px] sm:w-[18px] md:w-[20px] lg:w-[24px] xl:w-[31px] h-[16px] sm:h-[18px] md:h-[20px] lg:h-[24px] xl:h-[32px] z-10 transition-transform duration-500 group-hover:rotate-12"
                alt="Arrow"
                src="Group.svg"
            />
        </button>
    );
};

export default ViewAllGuidesButton;
