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
        <div className={`${className}`}>
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start">
                        {/* Circle container */}
                        <div className="relative mr-6 flex-shrink-0">
                            {/* White circle */}
                            <div className="relative w-8 h-8 rounded-full bg-white shadow-md">
                                {/* Vertical line before - extends from circle center upward */}
                                {index > 0 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-[2px] h-6 bg-[#cd8453]" />
                                )}
                                
                                {/* Vertical line after - extends from circle center downward */}
                                {index < steps.length - 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-[2px] bg-[#cd8453]" style={{ height: 'calc(1.5rem + 24px)' }} />
                                )}
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow">
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
                                            className="inline-block bg-white text-[#1b3c44] px-4 py-2 rounded-lg text-sm mr-2 mb-2 border border-[#1b3c44]/20"
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
