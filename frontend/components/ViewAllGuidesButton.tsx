"use client";

import { FunctionComponent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ViewAllGuidesButton.module.css';

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
            className={`group w-full h-full relative text-left text-[48px] color-[#f2eee9] font-['Schibsted_Grotesk'] border-none bg-transparent cursor-pointer ${styles.interactive}`}
            aria-label="View all travel guides"
        >
            {/* Background */}
            <div className="absolute top-0 left-0 rounded-[52px] bg-[#1b3c44] w-[297px] h-[92px] transition-colors duration-300 group-hover:bg-[#0f2a30]" />

            {/* Circle */}
            <div className="absolute top-[12px] left-[220px] bg-[#f2eee9] w-[66px] h-[69px] transition-colors duration-300 group-hover:bg-[#ebe6e0]" style={{ borderRadius: '33px / 34.5px' }} />

            {/* Text with sliding animation */}
            <div className={styles.textTrackContainer}>
                <div className={styles.textTrack}>
                    <div className="text-[#f2eee9] whitespace-nowrap text-[48px]">See All</div>
                    <div className="text-[#f2eee9] whitespace-nowrap text-[48px]">See All</div>
                </div>
            </div>

            {/* Arrow */}
            <img
                className="absolute top-[32px] left-[238px] w-[31px] h-[32px] z-10"
                alt="Arrow"
                src="Group.svg"
            />
        </button>
    );
};

export default ViewAllGuidesButton;
