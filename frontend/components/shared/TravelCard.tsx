"use client";

import { FunctionComponent } from 'react';
import styles from './TravelCard.module.css';
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
        <div className={styles.itemBlog}>
            <div
                style={{ backgroundImage: `url("${imageUrl}")` }}
                className={styles.imageBlog}
                role="img"
                aria-label={title}
            >
                <div className={styles.imageOverlay} />
                <div className={styles.contentBlog}>
                    <div className={styles.paragraph}>{year}</div>
                    <h3 className={styles.h3Styling}>{title}</h3>
                    <button
                        onClick={handleViewClick}
                        className={styles.button}
                        aria-label={`View details for ${title}`}
                    >
                        <div className={styles.buttonText}>
                            <div>View</div>
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

export default TravelCard;
