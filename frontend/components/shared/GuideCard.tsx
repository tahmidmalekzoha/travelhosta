"use client";

import { FunctionComponent, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import type { GuideData } from '../../types';
import { isValidImageUrl } from '../../utils/imageUtils';

interface GuideCardProps {
    /** Guide data to display */
    guide: GuideData;
}

/**
 * Reusable guide card component displaying a guide preview
 * Features image background, title, description, and view button
 * Styled consistently with the homepage travel cards
 * Memoized to prevent unnecessary re-renders
 */
const GuideCard: FunctionComponent<GuideCardProps> = memo(({ guide }) => {
    const router = useRouter();

    const handleViewClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/guides/${guide.id}`);
    }, [router, guide.id]);

    const hasValidImage = useMemo(() => isValidImageUrl(guide.imageUrl), [guide.imageUrl]);
    
    // Determine background style based on image availability
    const backgroundStyle = useMemo(() => {
        if (hasValidImage) {
            return { backgroundImage: `url("${guide.imageUrl}")` };
        }
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }, [hasValidImage, guide.imageUrl]);

    return (
        <div className="w-full relative rounded-[24px] sm:rounded-[32px] md:rounded-[38px] lg:rounded-[47px] overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
            {/* 3:4 aspect ratio container */}
            <div className="aspect-[3/4] rounded-[24px] sm:rounded-[32px] md:rounded-[38px] lg:rounded-[47px] overflow-hidden shadow-lg transition-all duration-400 hover:shadow-2xl relative bg-gradient-to-br from-gray-200 to-gray-300">
                {hasValidImage && (
                    <img 
                        src={guide.imageUrl!} 
                        alt={guide.title}
                        className="w-full h-full object-cover"
                    />
                )}
                {!hasValidImage && (
                    <div 
                        style={backgroundStyle}
                        className="w-full h-full"
                        role="img"
                        aria-label={guide.title}
                    />
                )}
                {/* Gradient Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-black/20 rounded-[24px] sm:rounded-[32px] md:rounded-[38px] lg:rounded-[47px] transition-all duration-300 hover:from-black/75 hover:to-black/15" />
                
                {/* Content Container */}
                <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 left-2 sm:left-3 md:left-4 lg:left-6 right-2 sm:right-3 md:right-4 lg:right-6 z-[2] flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4">
                    {/* Category */}
                    <div className="text-white/80 font-['Schibsted_Grotesk'] text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-medium leading-tight uppercase tracking-wider">
                        {guide.category}
                    </div>
                    
                    {/* Title - matching homepage card style */}
                    <h3 className="text-white font-['Schibsted_Grotesk'] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-[32px] font-bold leading-tight m-0 flex-grow line-clamp-2">
                        {guide.title}
                    </h3>
                    
                    {/* Division & Itinerary info */}
                    <div className="flex items-center justify-between mb-1 sm:mb-1.5 md:mb-2 lg:mb-3 xl:mb-4">
                        <span className="text-white/80 text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-medium font-['Schibsted_Grotesk']">
                            {guide.division}
                        </span>
                        {guide.itinerary && guide.itinerary.length > 0 && (
                            <span className="text-white/70 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-['Schibsted_Grotesk']">
                                {guide.itinerary.length} steps
                            </span>
                        )}
                    </div>
                    
                    {/* Tags */}
                    {guide.tags && guide.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-1.5 md:mb-2 lg:mb-3 xl:mb-4">
                            {guide.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 bg-white/20 backdrop-blur-sm text-white text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']"
                                >
                                    {tag}
                                </span>
                            ))}
                            {guide.tags.length > 3 && (
                                <span className="inline-block px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 md:py-1 bg-white/20 backdrop-blur-sm text-white text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']">
                                    +{guide.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* View Button - matching homepage style */}
                    <button
                        onClick={handleViewClick}
                        className="flex items-center justify-between bg-white/10 border border-white/20 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] lg:rounded-[28px] xl:rounded-[32px] py-1.5 px-2 sm:py-2 sm:px-3 md:py-2.5 md:px-4 lg:py-3 lg:px-5 xl:py-3 xl:px-6 cursor-pointer transition-all duration-300 backdrop-blur-md min-h-[32px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[56px] hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 group"
                        aria-label={`View details for ${guide.title}`}
                    >
                        <div className="text-white font-['Schibsted_Grotesk'] text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold flex-grow">
                            <div>View Guide</div>
                        </div>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110">
                            <div className="flex items-center justify-center w-full h-full">
                                <svg
                                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5"
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
});

GuideCard.displayName = 'GuideCard';

export default GuideCard;
