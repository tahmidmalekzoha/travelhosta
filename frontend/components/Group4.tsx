"use client";

import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    category: 'general' | 'subscription' | 'privacy';
}

const faqData: FAQItem[] = [
    {
        question: "What is TravelHosta?",
        answer: "TravelHosta is your ultimate travel companion that provides comprehensive guides for every type of traveler, whether you're on a budget or looking for premium experiences. We offer detailed tips on accommodation, food, and safety to help you explore the world with confidence.",
        category: 'general'
    },
    {
        question: "How do I book accommodations through TravelHosta?",
        answer: "TravelHosta provides curated recommendations and guides, but we don't directly handle bookings. We partner with trusted booking platforms and provide direct links to help you secure the best deals on accommodations that match your travel style and budget.",
        category: 'general'
    },
    {
        question: "Are your travel guides suitable for solo travelers?",
        answer: "Absolutely! Our guides are designed with solo travelers in mind, including specific safety tips, solo-friendly accommodation recommendations, and suggestions for meeting other travelers. We understand the unique needs of solo adventurers.",
        category: 'general'
    },
    {
        question: "What subscription plans do you offer?",
        answer: "We offer flexible subscription plans including a free tier with basic guides, a premium monthly plan with exclusive content and personalized recommendations, and an annual plan with additional perks like priority customer support and early access to new destinations.",
        category: 'subscription'
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time through your account settings. If you cancel, you'll continue to have access to premium features until the end of your current billing cycle, and then you'll automatically switch to our free tier.",
        category: 'subscription'
    },
    {
        question: "How do you protect my personal information?",
        answer: "We take your privacy seriously and use industry-standard encryption to protect your data. We never share your personal information with third parties without your consent, and you can review and manage your data preferences in your account settings at any time.",
        category: 'privacy'
    }
];

const Group4 = () => {
    const [activeCategory, setActiveCategory] = useState<'general' | 'subscription' | 'privacy'>('general');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const filteredFAQs = faqData.filter(faq => faq.category === activeCategory);

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <div className="w-full bg-[#213c44] rounded-t-[40px] py-16 px-[70px] min-h-[700px]">
            <div className="w-full max-w-none">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
                    {/* Title and Category Buttons */}
                    <div className="lg:w-[42%] flex flex-col">
                        <h2
                            className="font-bold text-white leading-[1.1] mb-10"
                            style={{ fontFamily: 'Lato, sans-serif', fontSize: '100px' }}
                        >
                            Find answers to<br />your questions
                        </h2>

                        {/* Category Buttons - 2x2 Grid layout like in image */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-fit max-w-md">
                            {[
                                { key: 'general' as const, label: 'General' },
                                { key: 'subscription' as const, label: 'Subscription' },
                                { key: 'privacy' as const, label: 'Privacy' }
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveCategory(key)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-base min-w-[140px] text-center ${activeCategory === key
                                        ? 'bg-white text-[#1b3c44] shadow-lg'
                                        : 'bg-[#3cbd9f] text-white hover:bg-[#2da085]'
                                        }`}
                                    style={{ fontFamily: 'Lato, sans-serif' }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Items - Show 4 fixed questions with even spacing */}
                    <div className="lg:w-[54%] space-y-4 flex-1">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className={`relative bg-[#cd8453] transition-all duration-300 hover:shadow-xl ${expandedFAQ === index ? 'z-50' : 'z-10'
                                    }`}
                                style={{ borderRadius: '36px' }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none"
                                >
                                    <span
                                        className="text-white text-lg md:text-xl font-medium pr-4"
                                        style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                                    >
                                        What is TravelHosta?
                                    </span>
                                    <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transition-transform duration-300">
                                        <svg
                                            className={`w-6 h-6 text-white transition-transform duration-300 ${expandedFAQ === index ? 'rotate-45' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </div>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6">
                                        <p
                                            className="text-white text-opacity-90 leading-relaxed text-base"
                                            style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                                        >
                                            TravelHosta is your ultimate travel companion that provides comprehensive guides for every type of traveler, whether you're on a budget or looking for premium experiences. We offer detailed tips on accommodation, food, and safety to help you explore the world with confidence.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group4;
