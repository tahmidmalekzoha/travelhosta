"use client";

import { FunctionComponent } from 'react';
import styles from './SeeAll.module.css';

/**
 * "See All" button component with animated hover effects
 * Features background color transitions and sliding text animation
 */
const SeeAll: FunctionComponent = () => {
    const handleSeeAll = () => {
        console.log('See All clicked');
        // Add your see all logic here
        // Example: navigate to all destinations page
        // window.location.href = '/destinations';
    };

    return (
        <button
            onClick={handleSeeAll}
            className={`group w-full h-full relative text-left text-[48px] color-[#f2eee9] font-['Schibsted_Grotesk'] border-none bg-transparent cursor-pointer ${styles.interactive}`}
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

            {/* Arrow - no animation */}
            <img
                className="absolute top-[32px] left-[238px] w-[31px] h-[32px] z-10"
                alt="Arrow"
                src="Group.svg"
            />
        </button>
    );
};

export default SeeAll;
