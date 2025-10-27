"use client";

import React, { useState } from 'react';
import { FAQ_DATA, FAQ_CATEGORIES } from '../constants';
import type { FAQCategory } from '../types';

/**
 * FAQ section component with category filtering and expandable questions
 * Features animated expand/collapse and category switching
 */
const Group4 = () => {
    const [activeCategory, setActiveCategory] = useState<FAQCategory>('general');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    // Filter FAQs by active category
    const filteredFAQs = FAQ_DATA.filter(faq => faq.category === activeCategory);

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const renderFAQItem = (faq: typeof FAQ_DATA[0], index: number) => (
        <div
            key={`${activeCategory}-${index}`}
            className={`relative bg-[#cd8453] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] transition-all duration-300 hover:shadow-xl ${expandedFAQ === index ? 'z-50' : 'z-10'
                }`}
        >
            <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 text-left flex justify-between items-center focus:outline-none"
            >
                <span
                    className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium pr-2 sm:pr-3 md:pr-4"
                    style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                >
                    {faq.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center transition-transform duration-300">
                    <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white transition-transform duration-300 ${expandedFAQ === index ? 'rotate-45' : ''
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
                <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6">
                    <p
                        className="text-white text-opacity-90 leading-relaxed text-xs sm:text-sm md:text-base"
                        style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                    >
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderCategoryButton = (category: typeof FAQ_CATEGORIES[number]) => (
        <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base min-w-[90px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px] text-center ${activeCategory === category.key
                    ? 'bg-white text-[#1b3c44] shadow-lg'
                    : 'bg-[#3cbd9f] text-white hover:bg-[#2da085]'
                }`}
            style={{ fontFamily: 'Lato, sans-serif' }}
        >
            {category.label}
        </button>
    );

    return (
        <div className="w-full bg-[#213c44] rounded-t-[24px] sm:rounded-t-[32px] md:rounded-t-[40px] py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-[70px] min-h-[600px] sm:min-h-[650px] md:min-h-[700px]">
            <div className="w-full max-w-none">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 items-start justify-between">
                    {/* Title and Category Buttons */}
                    <div className="w-full lg:w-[42%] flex flex-col">
                        <h2
                            className="font-bold text-white leading-[1.1] mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                            Find answers to<br />your questions
                        </h2>

                        {/* Category Buttons */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3 w-full max-w-md">
                            {FAQ_CATEGORIES.map(renderCategoryButton)}
                        </div>
                    </div>

                    {/* FAQ Items - Show filtered questions based on active category */}
                    <div className="w-full lg:w-[54%] space-y-2 sm:space-y-3 md:space-y-4 flex-1">
                        {filteredFAQs.map(renderFAQItem)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group4;
