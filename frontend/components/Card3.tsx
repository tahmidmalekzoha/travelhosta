"use client";

import { FunctionComponent } from 'react';
import TravelCard from './shared/TravelCard';

/**
 * Travel card component displaying information about budget travel tips
 */
const Card3: FunctionComponent = () => {
    const handleViewClick = () => {
        console.log('View card 3 clicked');
        // Add your navigation logic here
    };

    return (
        <TravelCard
            cardId="budget-travel-tips"
            year="2025"
            title="Budget Travel Tips for Amazing Adventures"
            imageUrl="images/dummy.jpg"
            onViewClick={handleViewClick}
        />
    );
};

export default Card3;
