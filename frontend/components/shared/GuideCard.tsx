"use client";

import { FunctionComponent, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TravelCard.module.css';
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
 */
const GuideCard: FunctionComponent<GuideCardProps> = ({ guide }) => {
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
        <div className={styles.itemBlog}>
            <div
                style={backgroundStyle}
                className={styles.imageBlog}
                role="img"
                aria-label={guide.title}
            >
                <div className={styles.imageOverlay} />
                <div className={styles.contentBlog}>
                    {/* Category */}
                    <div className={styles.paragraph}>
                        {guide.category}
                    </div>
                    
                    {/* Title - matching homepage card style */}
                    <h3 className={styles.h3Styling}>
                        {guide.title}
                    </h3>
                    
                    {/* Description - additional info for guides */}
                    <p className="text-white/90 font-['Schibsted_Grotesk'] text-lg leading-tight mb-3">
                        {guide.description}
                    </p>
                    
                    {/* Division & Itinerary info */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-white/80 text-lg font-medium font-['Schibsted_Grotesk']">
                            {guide.division}
                        </span>
                        {guide.itinerary && guide.itinerary.length > 0 && (
                            <span className="text-white/70 text-sm font-['Schibsted_Grotesk']">
                                {guide.itinerary.length} steps
                            </span>
                        )}
                    </div>
                    
                    {/* Tags */}
                    {guide.tags && guide.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {guide.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']"
                                >
                                    {tag}
                                </span>
                            ))}
                            {guide.tags.length > 3 && (
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30 font-['Schibsted_Grotesk']">
                                    +{guide.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* View Button - matching homepage style */}
                    <button
                        onClick={handleViewClick}
                        className={styles.button}
                        aria-label={`View details for ${guide.title}`}
                    >
                        <div className={styles.buttonText}>
                            <div>View Guide</div>
                        </div>
                        <div className={styles.arrowCircle}>
                            <div className={styles.arrowContainer}>
                                <svg
                                    className={styles.iconArrow}
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

export default GuideCard;
