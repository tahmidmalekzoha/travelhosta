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
        'All guides are free',
        'Exclusive offers',
        'Everyday new guide uploads',
        'Lifetime access',
        'No recurring payments',
        'Support local travel content',
    ];

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-lg mx-auto relative animate-fade-in">
            {showCloseButton && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
            )}

            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Unlock All Travel Guides
                </h2>
                <p className="text-gray-600">
                    Get lifetime access to our entire collection
                </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 text-white text-center mb-6">
                <div className="text-5xl font-bold mb-2">৳149</div>
                <div className="text-lg opacity-90">One-time payment</div>
                <div className="text-sm opacity-75 mt-1">Lifetime access • No subscriptions</div>
            </div>

            <div className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                    <div
                        key={benefit}
                        className="flex items-center gap-3"
                    >
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Check className="text-emerald-600" size={16} />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => {
                        // TODO: Implement payment flow
                        alert('Payment integration coming soon! Please contact admin for manual subscription.');
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                    Subscribe Now
                </button>
                
                <p className="text-xs text-center text-gray-500">
                    Secure payment via bKash, Nagad, or Card
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">What you get:</h3>
                <p className="text-sm text-gray-600">
                    Access to all current and future travel guides for Bangladesh. 
                    Discover hidden gems, plan perfect itineraries, and explore like a local. 
                    4 featured guides are always free!
                </p>
            </div>
        </div>
    );
};

export default SubscriptionPrompt;
