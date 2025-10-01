import { FunctionComponent } from 'react';
import { ItineraryStep } from '../types';

interface TimelineProps {
    steps: ItineraryStep[];
    className?: string;
}

/**
 * Timeline component for displaying travel itinerary
 * Renders as a vertical timeline with orange line and markers
 */
const Timeline: FunctionComponent<TimelineProps> = ({ steps, className = '' }) => {
    if (!steps || steps.length === 0) {
        return (
            <div className={`text-gray-500 text-center py-8 ${className}`}>
                No itinerary steps available
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#cd8453]" />
            
            {/* Steps */}
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start">
                        {/* Orange marker */}
                        <div className="relative z-10 flex-shrink-0">
                            <div className="w-8 h-8 bg-[#cd8453] rounded-full border-4 border-white shadow-md flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="ml-6 flex-grow">
                            {/* Step title */}
                            <h3 className="text-lg font-bold text-[#1b3c44] mb-3">
                                {step.title}
                            </h3>
                            
                            {/* Step details */}
                            {step.details && step.details.length > 0 && (
                                <div className="space-y-2">
                                    {step.details.map((detail, detailIndex) => (
                                        <div
                                            key={detailIndex}
                                            className="inline-block bg-[#1b3c44] text-white px-4 py-2 rounded-lg text-sm mr-2 mb-2"
                                        >
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
