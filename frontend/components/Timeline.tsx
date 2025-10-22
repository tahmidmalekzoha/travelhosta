import { FunctionComponent, memo } from 'react';
import { ItineraryStep } from '../types';
import { Lightbulb, Info } from 'lucide-react';

interface TimelineProps {
    steps: ItineraryStep[];
    className?: string;
    variant?: string; // Added variant prop to support theming
}

/**
 * Timeline component for displaying travel itinerary
 * Renders as a vertical timeline with orange line and markers
 * Memoized to prevent unnecessary re-renders
 */
const Timeline: FunctionComponent<TimelineProps> = memo(({ steps, className = '' }) => {
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
                                <div className="space-y-2 mb-4">
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
                            
                            {/* Step tips - compact display */}
                            {step.tips && step.tips.length > 0 && (
                                <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3">
                                    <div className="space-y-2">
                                        {step.tips.map((tip, tipIndex) => (
                                            <div key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                                <Lightbulb className="text-amber-600 flex-shrink-0 mt-0.5" size={14} />
                                                <span className="flex-grow">{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Step notes - compact display */}
                            {step.notes && step.notes.length > 0 && (
                                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3">
                                    <div className="space-y-2">
                                        {step.notes.map((note, noteIndex) => (
                                            <div key={noteIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={14} />
                                                <span className="flex-grow">{note}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

Timeline.displayName = 'Timeline';

export default Timeline;
