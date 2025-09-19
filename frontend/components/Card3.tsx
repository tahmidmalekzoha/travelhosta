"use client";

import { FunctionComponent } from 'react';
import styles from './Card3.module.css';

/**
 * Travel card component displaying information about budget travel tips
 */
const Card3: FunctionComponent = () => {
    const handleViewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('View card 3 clicked');
        // Add your navigation logic here
    };

    return (
        <div className={styles.itemBlog}>
            <div
                style={{ backgroundImage: 'url("images/dummy.jpg")' }}
                className={styles.imageBlog}
            >
                <div className={styles.imageOverlay}></div>
                <div className={styles.contentBlog}>
                    <div className={styles.paragraph}>2025</div>
                    <h3 className={styles.h3Styling}>
                        Budget Travel Tips for Amazing Adventures
                    </h3>
                    <button onClick={handleViewClick} className={styles.button}>
                        <div className={styles.buttonText}>
                            <div>View</div>
                        </div>
                        <div className={styles.arrowCircle}>
                            <div className={styles.arrowContainer}>
                                <svg className={styles.iconArrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                                    <path fill="currentColor" fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card3;
