"use client";

import { FunctionComponent } from 'react';
import TravelCard from './shared/TravelCard';

/**
 * Travel card component displaying information about hidden gems for solo travelers
 */
const Card4: FunctionComponent = () => {
    const handleViewClick = () => {
        console.log('View card 4 clicked');
        // Add your navigation logic here
    };

    return (
        <TravelCard
            cardId="solo-travel-gems"
            year="2025"
            title="Hidden Gems Around the World for Solo Travelers"
            imageUrl="/images/dummy.jpg"
            onViewClick={handleViewClick}
        />
    );
};

export default Card4;
