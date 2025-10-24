import { FunctionComponent, memo } from 'react';
import { ItineraryStep } from '../types';
import { Lightbulb, Info } from 'lucide-react';

interface TimelineProps {
    steps: ItineraryStep[];
    className?: string;
    variant?: 'light' | 'dark'; // Added variant prop to support theming
}

/**
 * Timeline component for displaying travel itinerary
 * Renders as a vertical timeline with markers
 * Supports both light and dark themes
 * Memoized to prevent unnecessary re-renders
 */
const Timeline: FunctionComponent<TimelineProps> = memo(({ steps, className = '', variant = 'light' }) => {
    if (!steps || steps.length === 0) {
        return (
            <div className={`${variant === 'dark' ? 'text-[#f2eee9]/70' : 'text-gray-500'} text-center py-8 ${className}`}>
                No itinerary steps available
            </div>
        );
    }

    const isDark = variant === 'dark';

    return (
        <div className={`${className}`}>
            <div className="space-y-[40px]">
                {steps.map((step, index) => {
                    const isLast = index === steps.length - 1;
                    
                    return (
                        <div key={step.id ?? index} className="relative flex items-start gap-[21px]">
                            {/* Connecting line - spans through current item to next */}
                            {index < steps.length - 1 && (
                                <div className={`absolute left-[25px] top-[55px] w-[3px] ${isDark ? 'bg-[#f2eee9]/30' : 'bg-[#cd8453]'}`} style={{ height: 'calc(100% + 45px)' }} />
                            )}
                            
                            <div className="relative z-10 flex-shrink-0 mt-[5px]">
                                {/* White circle with outer ring */}
                                <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white">
                                    {/* Outer ring - centered around the inner circle */}
                                    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] rounded-full border-[2px] ${isDark ? 'border-[#f2eee9]/30' : 'border-[#cd8453]/30'}`}></div>
                                </div>
                                
                                {/* Bottom line for last icon */}
                                {isLast && (
                                    <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-[13px] w-[3px] h-[30px] ${isDark ? 'bg-[#f2eee9]/30' : 'bg-[#cd8453]'}`} />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className={`font-['Schibsted_Grotesk'] font-bold text-[24px] lg:text-[41.961px] leading-[normal] ${isDark ? 'text-[#f2eee9]' : 'text-[#1b3c44]'} mb-[40px] lg:mb-[30px]`}>
                                    {step.title}
                                </h3>

                                {step.details && step.details.length > 0 && (
                                    <div className="flex flex-wrap gap-[10px] mb-[40px] lg:mb-[69px]">
                                        {step.details.map((detail, detailIndex) => (
                                            <div key={`${step.id}-detail-${detailIndex}`} className={`inline-flex items-center justify-center rounded-[39.338px] ${isDark ? 'bg-white' : 'bg-white border border-[#1b3c44]/20'} h-[60px] lg:h-[78px] px-[20px] lg:px-[27px]`}>
                                                <span className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[26.225px] leading-[normal] text-[#1b3c44]">{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {step.tips && step.tips.length > 0 && (
                                    <div className="mb-[40px] lg:mb-[69px]">
                                        <div className={isDark 
                                            ? 'bg-[#D6AD46]/10 border-2 border-[#D6AD46]/30 rounded-[40px] px-[20px] lg:px-[25px] py-[20px] lg:py-[25px]'
                                            : 'bg-amber-50 border-l-4 border-amber-400 rounded-r-lg px-3 py-3'
                                        }>
                                            <div className="flex items-center gap-[12px] mb-[15px]">
                                                <Lightbulb size={24} className={`flex-shrink-0 ${isDark ? 'text-[#D6AD46]' : 'text-amber-600'}`} strokeWidth={2} />
                                                <h4 className={`font-['Schibsted_Grotesk'] font-bold text-[22px] lg:text-[24px] ${isDark ? 'text-[#f2eee9]' : 'text-gray-800'}`}>
                                                    Tips
                                                </h4>
                                            </div>
                                            <div className="space-y-[10px]">
                                                {step.tips.map((tip, tipIndex) => (
                                                    <p key={`${step.id}-tip-${tipIndex}`} className={`font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] ${isDark ? 'text-[#f2eee9]' : 'text-gray-700'}`}>
                                                        • {tip}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step.notes && step.notes.length > 0 && (
                                    <div className="mb-[40px] lg:mb-[69px]">
                                        <div className={isDark
                                            ? 'bg-[#D6AD46]/10 border-2 border-[#D6AD46]/30 rounded-[40px] px-[20px] lg:px-[25px] py-[20px] lg:py-[25px]'
                                            : 'bg-blue-50 border-l-4 border-blue-400 rounded-r-lg px-3 py-3'
                                        }>
                                            <div className="flex items-center gap-[13px] mb-[15px]">
                                                <Info size={24} className={`flex-shrink-0 ${isDark ? 'text-[#D6AD46]' : 'text-blue-600'}`} strokeWidth={2} />
                                                <h4 className={`font-['Schibsted_Grotesk'] font-bold text-[22px] lg:text-[24px] ${isDark ? 'text-[#f2eee9]' : 'text-gray-800'}`}>
                                                    Notes
                                                </h4>
                                            </div>
                                            <div className="space-y-[10px]">
                                                {step.notes.map((note, noteIndex) => (
                                                    <p key={`${step.id}-note-${noteIndex}`} className={`font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] ${isDark ? 'text-[#f2eee9]' : 'text-gray-700'}`}>
                                                        • {note}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

Timeline.displayName = 'Timeline';

export default Timeline;
