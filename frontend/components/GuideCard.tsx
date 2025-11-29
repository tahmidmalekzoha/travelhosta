"use client";

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { GuideData } from '@/types';
import { Lock } from 'lucide-react';
import { isValidImageUrl } from '../utils/imageUtils';
import BookmarkButton from './shared/BookmarkButton';

interface GuideCardProps {
    guide: GuideData;
    isFeatured?: boolean;
    isBlurred?: boolean;
    onClick?: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ 
    guide, 
    isFeatured = false,
    isBlurred = false,
    onClick 
}) => {
    const router = useRouter();

    const handleViewClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (isBlurred && onClick) {
            onClick();
        } else {
            router.push(`/guides/${guide.id}`);
        }
    }, [router, guide.id, isBlurred, onClick]);

    const handleCardClick = useCallback(() => {
        if (isBlurred && onClick) {
            onClick();
        } else {
            router.push(`/guides/${guide.id}`);
        }
    }, [router, guide.id, isBlurred, onClick]);

    const hasValidImage = useMemo(() => isValidImageUrl(guide.imageUrl), [guide.imageUrl]);
    
    // Determine background style based on image availability
    const backgroundStyle = useMemo(() => {
        if (hasValidImage) {
            return { backgroundImage: `url("${guide.imageUrl}")` };
        }
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    }, [hasValidImage, guide.imageUrl]);

    return (
        <div 
            onClick={handleCardClick}
            className={`w-full relative rounded-[24px] sm:rounded-[32px] md:rounded-[38px] lg:rounded-[47px] overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl ${
                isBlurred ? 'cursor-pointer' : 'cursor-pointer'
            }`}
        >
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
                
                {/* Gradient Overlay - darker for blurred cards */}
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-t ${
                    isBlurred 
                        ? 'from-black/95 via-black/70 to-black/30' 
                        : 'from-black/85 via-black/40 to-transparent'
                } rounded-[24px] sm:rounded-[32px] md:rounded-[38px] lg:rounded-[47px] transition-all duration-300 hover:from-black/80 hover:via-black/35`} />

                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-5 md:left-5 z-10 bg-yellow-400 text-yellow-900 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold shadow-lg">
                        FREE
                    </div>
                )}

                {/* Bookmark Button - top right corner */}
                {!isBlurred && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 z-10">
                        <BookmarkButton guideId={guide.id} />
                    </div>
                )}

                {/* Locked Overlay */}
                {isBlurred && (
                    <div className="absolute inset-0 flex items-center justify-center z-[5]">
                        <div className="bg-white/95 rounded-full p-4 sm:p-5 md:p-6 lg:p-7 shadow-2xl animate-pulse">
                            <Lock className="text-gray-800 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" />
                        </div>
                    </div>
                )}
                
                {/* Content Container - completely hidden for blurred cards */}
                {!isBlurred && (
                    <div className="absolute bottom-0 left-0 right-0 z-[2] flex flex-col p-3 sm:p-4 md:p-5 lg:p-6">
                        {/* Category */}
                        <div className="text-white/80 font-['Schibsted_Grotesk'] text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base font-medium leading-tight uppercase tracking-wider mb-1 sm:mb-1.5">
                            {guide.category}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-white font-['Schibsted_Grotesk'] text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold leading-tight m-0 line-clamp-2 mb-1.5 sm:mb-2 md:mb-2">
                            {guide.title}
                        </h3>
                        
                        {/* Division */}
                        <div className="text-white/80 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium font-['Schibsted_Grotesk'] mb-1.5 sm:mb-2 md:mb-3">
                            {guide.division}
                        </div>
                        
                        {/* Tags */}
                        {guide.tags && guide.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                                {guide.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {/* Show 3rd tag on medium+ screens */}
                                {guide.tags.length > 2 && (
                                    <span className="hidden md:inline-block px-2 md:px-2.5 lg:px-3 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] lg:text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']">
                                        {guide.tags[2]}
                                    </span>
                                )}
                                {guide.tags.length > 3 && (
                                    <span className="hidden md:inline-block px-2 md:px-2.5 lg:px-3 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] lg:text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']">
                                        +{guide.tags.length - 3}
                                    </span>
                                )}
                                {guide.tags.length > 2 && (
                                    <span className="md:hidden inline-block px-1.5 sm:px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']">
                                        +{guide.tags.length - 2}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {/* View Button */}
                        <button
                            onClick={handleViewClick}
                            className="flex items-center justify-between bg-white/10 border border-white/20 rounded-[14px] sm:rounded-[18px] md:rounded-[22px] lg:rounded-[26px] xl:rounded-[30px] py-1.5 px-2 sm:py-2 sm:px-3 md:py-2.5 md:px-4 lg:py-3 lg:px-5 cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 group"
                            aria-label={`View details for ${guide.title}`}
                        >
                            <div className="text-white font-['Schibsted_Grotesk'] text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold flex-grow">
                                View Guide
                            </div>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110">
                                <svg
                                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 text-white transition-transform duration-300 group-hover:translate-x-0.5"
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
                        </button>
                    </div>
                )}

                {/* Locked Message Overlay at Bottom - for blurred cards only */}
                {isBlurred && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 md:p-5 lg:p-6 text-center z-[6]">
                        <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold font-['Schibsted_Grotesk'] mb-2">
                            Premium Guide
                        </p>
                        <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium font-['Schibsted_Grotesk'] mb-3 sm:mb-4 md:mb-5">
                            Subscribe for ৳149 to unlock
                        </p>
                        <button
                            onClick={handleViewClick}
                            className="flex items-center justify-between bg-white/15 border border-white/30 rounded-[14px] sm:rounded-[18px] md:rounded-[22px] lg:rounded-[26px] xl:rounded-[30px] py-2 px-3 sm:py-2.5 sm:px-4 md:py-3 md:px-5 lg:py-3.5 lg:px-6 cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/25 hover:border-white/40 hover:-translate-y-0.5 group mx-auto w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px]"
                            aria-label="Subscribe to unlock this guide"
                        >
                            <div className="text-white font-['Schibsted_Grotesk'] text-xs sm:text-sm md:text-base lg:text-lg font-semibold flex-grow">
                                Subscribe Now
                            </div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:bg-white/40 group-hover:scale-110">
                                <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white" />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideCard;
