"use client";

import { FunctionComponent } from 'react';
import TravelCard from './shared/TravelCard';

/**
 * Travel card component displaying information about budget destinations
 */
const Card2: FunctionComponent = () => {
    const handleViewClick = () => {
        // Add your navigation logic here
    };

    return (
        <TravelCard
            cardId="budget-destinations"
            year="2025"
            title="Explore New Destinations That Cost Less Than Standard"
            imageUrl="images/dummy.jpg"
            onViewClick={handleViewClick}
        />
    );
};

export default Card2;
