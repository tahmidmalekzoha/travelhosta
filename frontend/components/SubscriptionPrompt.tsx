"use client";

import React from 'react';
import { Check, X } from 'lucide-react';

interface SubscriptionPromptProps {
    onClose?: () => void;
    showCloseButton?: boolean;
}

const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({ 
    onClose, 
    showCloseButton = false 
}) => {
    const benefits = [
        'All guides are available',
        'Exclusive offers',
        'Everyday new guide uploads',
        'Lifetime access',
        'No recurring payments',
        'Support local travel content',
    ];

    return (
        <div className="bg-[#f2eee9] rounded-[24px] sm:rounded-[32px] md:rounded-[38px] shadow-2xl p-6 md:p-8 lg:p-10 max-w-lg mx-auto relative font-['Schibsted_Grotesk']">
            {showCloseButton && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 text-[#1b3c44]/50 hover:text-[#1b3c44] transition-colors duration-200 bg-white/50 hover:bg-white rounded-full p-2"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
            )}

            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1b3c44] mb-2">
                    Unlock All Travel Guides
                </h2>
                <p className="text-[#1b3c44]/70 text-base md:text-lg">
                    Get lifetime access to our entire collection
                </p>
            </div>

            <div className="bg-gradient-to-br from-[#1b3c44] via-[#2a5562] to-[#cd8453] rounded-[20px] md:rounded-[24px] p-6 md:p-8 text-white text-center mb-6 md:mb-8 shadow-lg">
                <div className="text-5xl md:text-6xl font-bold mb-2">৳149</div>
                <div className="text-lg md:text-xl opacity-95 font-medium">One-time payment</div>
                <div className="text-sm md:text-base opacity-80 mt-1">Lifetime access • No subscriptions</div>
            </div>

            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {benefits.map((benefit) => (
                    <div
                        key={benefit}
                        className="flex items-center gap-3 md:gap-4"
                    >
                        <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-[#cd8453]/20 rounded-full flex items-center justify-center">
                            <Check className="text-[#cd8453]" size={18} strokeWidth={3} />
                        </div>
                        <span className="text-[#1b3c44] text-base md:text-lg font-medium">{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-3 md:space-y-4">
                <button
                    onClick={() => {
                        // TODO: Implement payment flow
                        alert('Payment integration coming soon! Please contact admin for manual subscription.');
                    }}
                    className="w-full bg-gradient-to-r from-[#1b3c44] to-[#cd8453] text-white font-bold py-3 md:py-4 px-6 rounded-[18px] md:rounded-[22px] hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-base md:text-lg"
                >
                    Subscribe Now
                </button>
                
                <p className="text-xs md:text-sm text-center text-[#1b3c44]/60">
                    Secure payment via bKash, Nagad, or Card
                </p>
            </div>
        </div>
    );
};

export default SubscriptionPrompt;
