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
                    {faq.question}
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
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-base min-w-[140px] text-center ${activeCategory === category.key
                    ? 'bg-white text-[#1b3c44] shadow-lg'
                    : 'bg-[#3cbd9f] text-white hover:bg-[#2da085]'
                }`}
            style={{ fontFamily: 'Lato, sans-serif' }}
        >
            {category.label}
        </button>
    );

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

                        {/* Category Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-fit max-w-md">
                            {FAQ_CATEGORIES.map(renderCategoryButton)}
                        </div>
                    </div>

                    {/* FAQ Items - Show filtered questions based on active category */}
                    <div className="lg:w-[54%] space-y-4 flex-1">
                        {filteredFAQs.map(renderFAQItem)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group4;
