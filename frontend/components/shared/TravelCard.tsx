"use client";

import { FunctionComponent } from 'react';
import type { ClickHandler } from '../../types';

interface TravelCardProps {
    /** Year or date to display */
    year: string;
    /** Main title of the card */
    title: string;
    /** Background image URL */
    imageUrl: string;
    /** Click handler for the view button */
    onViewClick: ClickHandler;
    /** Unique identifier for analytics/tracking */
    cardId?: string;
}

/**
 * Reusable travel card component displaying a destination or article preview
 * with an image background, title, year, and view button.
 */
const TravelCard: FunctionComponent<TravelCardProps> = ({
    year,
    title,
    imageUrl,
    onViewClick,
    cardId
}) => {
    const handleViewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log(`View clicked for card: ${cardId || 'unknown'}`);
        onViewClick();
    };

    return (
        <div className="w-full relative h-[521px] md:h-[400px] rounded-[47px] overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
            <div
                style={{ backgroundImage: `url("${imageUrl}")` }}
                className="w-full h-full rounded-[47px] bg-cover bg-center relative overflow-hidden shadow-lg transition-all duration-400 hover:shadow-2xl"
                role="img"
                aria-label={title}
            >
                {/* Gradient Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-black/20 rounded-[47px] transition-all duration-300 hover:from-black/75 hover:to-black/15" />
                
                {/* Content Container */}
                <div className="absolute bottom-6 md:bottom-4 left-6 md:left-4 right-6 md:right-4 z-[2] flex flex-col gap-4 md:gap-3">
                    <div className="text-white/80 font-['Schibsted_Grotesk'] text-lg md:text-base font-medium leading-tight uppercase tracking-wider">
                        {year}
                    </div>
                    <h3 className="text-white font-['Schibsted_Grotesk'] text-[32px] md:text-2xl font-bold leading-tight m-0 flex-grow">
                        {title}
                    </h3>
                    <button
                        onClick={handleViewClick}
                        className="flex items-center justify-between bg-white/10 border border-white/20 rounded-[32px] py-3 px-6 md:py-2.5 md:px-5 cursor-pointer transition-all duration-300 backdrop-blur-md min-h-[56px] md:min-h-[48px] hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 group"
                        aria-label={`View details for ${title}`}
                    >
                        <div className="text-white font-['Schibsted_Grotesk'] text-xl md:text-lg font-semibold flex-grow">
                            <div>View</div>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110">
                            <div className="flex items-center justify-center w-full h-full">
                                <svg
                                    className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 15 15"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TravelCard;
