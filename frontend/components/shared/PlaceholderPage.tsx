"use client";

import { FunctionComponent } from 'react';
import StickyNavbar from '../StickyNavbar';

interface PlaceholderPageProps {
    /** Main page title */
    title: string;
    /** Optional subtitle or description */
    subtitle?: string;
}

/**
 * Reusable placeholder page component for pages under development
 * Displays a centered message with consistent styling
 * 
 * @example
 * <PlaceholderPage 
 *   title="About Us" 
 *   subtitle="Learn more about TravelHosta and our mission" 
 * />
 */
const PlaceholderPage: FunctionComponent<PlaceholderPageProps> = ({ 
    title, 
    subtitle 
}) => {
    return (
        <div className="min-h-screen bg-[#f2eee9] flex items-center justify-center relative">
            <StickyNavbar />
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[#1b3c44] mb-4 font-['Schibsted_Grotesk']">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl text-[#1b3c44] mb-8 font-['Lato']">
                        {subtitle}
                    </p>
                )}
                <p className="text-lg text-gray-600">
                    Coming soon...
                </p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
