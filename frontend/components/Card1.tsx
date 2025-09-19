"use client";

import { FunctionComponent } from 'react';
import TravelCard from './shared/TravelCard';

/**
 * Travel card component displaying information about Canoply Chalet
 */
const Card1: FunctionComponent = () => {
    const handleViewClick = () => {
        // Add your navigation logic here
        // Example: navigate to detailed view
        // window.location.href = '/destinations/canoply-chalet';
    };

    return (
        <TravelCard
            cardId="canoply-chalet"
            year="2025"
            title="How to Make the Most of Your Stay at Canoply Chalet"
            imageUrl="images/dummy.jpg"
            onViewClick={handleViewClick}
        />
    );
};

export default Card1;
