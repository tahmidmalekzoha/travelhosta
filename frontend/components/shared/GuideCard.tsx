"use client";

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TravelCard.module.css';
import type { GuideData } from '../../types';

interface GuideCardProps {
    /** Guide data */
    guide: GuideData;
}

/**
 * Reusable guide card component displaying a guide preview
 * with image background, title, duration, and view button.
 * Styled consistently with the homepage travel cards.
 */
const GuideCard: FunctionComponent<GuideCardProps> = ({ guide }) => {
    const router = useRouter();

    const handleViewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/guides/${guide.id}`);
    };

    const hasValidImage = guide.imageUrl && guide.imageUrl !== '' && guide.imageUrl !== 'dummy.jpg' && guide.imageUrl !== '/images/dummy.jpg';

    return (
        <div className={styles.itemBlog}>
            <div
                style={hasValidImage ? { backgroundImage: `url("${guide.imageUrl}")` } : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
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
