'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import StickyNavbar from '../../components/StickyNavbar';

export default function Guides() {
    const [selectedDivision, setSelectedDivision] = useState('All Divisions');
    const [selectedCategory, setSelectedCategory] = useState('All Guides');
    const [searchTerm, setSearchTerm] = useState('');

    const divisions = [
        { name: 'All Divisions' },
        { name: 'Dhaka' },
        { name: 'Chittagong' },
        { name: 'Khulna' },
        { name: 'Rajshahi' }
    ];

    const categories = [
        { name: 'All Guides' },
        { name: 'Day Tour' },
        { name: 'Camping' },
        { name: 'Trekking' },
        { name: 'Staycation' }
    ];

    const allGuides = [
        { 
            id: 1, 
            title: 'Historic Dhaka Tour', 
            description: 'Explore Old Dhaka\'s heritage sites', 
            division: 'Dhaka', 
            category: 'Day Tour',
            duration: '6 hours',
            price: '$45'
        },
        { 
            id: 2, 
            title: 'Cox\'s Bazar Beach', 
            description: 'World\'s longest natural beach', 
            division: 'Chittagong', 
            category: 'Staycation',
            duration: '3 days',
            price: '$120'
        },
        { 
            id: 3, 
            title: 'Sundarbans Adventure', 
            description: 'Royal Bengal Tiger sanctuary', 
            division: 'Khulna', 
            category: 'Trekking',
            duration: '2 days',
            price: '$200'
        },
        { 
            id: 4, 
            title: 'Tea Garden Trek', 
            description: 'Sylhet\'s scenic tea gardens', 
            division: 'Rajshahi', 
            category: 'Camping',
            duration: '4 days',
            price: '$150'
        }
    ];

    const filteredGuides = useMemo(() => {
        return allGuides.filter(guide => {
            const matchesDivision = selectedDivision === 'All Divisions' || guide.division === selectedDivision;
            const matchesCategory = selectedCategory === 'All Guides' || guide.category === selectedCategory;
            const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                guide.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDivision && matchesCategory && matchesSearch;
        });
    }, [selectedDivision, selectedCategory, searchTerm]);

    return (
        <div className="w-full relative bg-[#f2eee9] h-[1422px] overflow-hidden text-left text-[32px] text-[#1b3c44] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation */}
            <StickyNavbar />

            {/* Main Title */}
            <div className="absolute top-[65px] left-[85px] text-[140px] leading-none">
                Guides
            </div>

            {/* Search Bar */}
            <div className="absolute top-[92px] left-[620px] w-[865px] h-[87px] text-[#f2eee9] font-['Lato']">
                <div className="absolute top-0 left-0 rounded-[88px] bg-[#aec0c4] w-[865px] h-[87px]"></div>
                <svg className="absolute top-[19px] left-[19px] w-[50px] h-[50px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Search guides..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="absolute top-[24px] left-[88px] w-[750px] text-[32px] text-[#f2eee9] placeholder-[#f2eee9] bg-transparent border-none outline-none font-['Lato']"
                />
            </div>

            {/* Division Categories */}
            <div className="absolute top-[298px] left-[90px] flex gap-4 h-[88px] font-['Schibsted_Grotesk']">
                {divisions.map((division) => {
                    const isActive = selectedDivision === division.name;
                    
                    return (
                        <div 
                            key={division.name}
                            className={`h-[88px] cursor-pointer transition-all duration-200 hover:scale-105 ${
                                isActive ? 'text-white' : 'text-[#1b3c44]'
                            }`}
                            onClick={() => setSelectedDivision(division.name)}
                        >
                            <div 
                                className={`shadow-[1px_2px_8.4px_rgba(0,0,0,0.25)] rounded-[44px] h-[88px] px-[44px] flex items-center justify-center transition-colors duration-200 ${
                                    isActive ? 'bg-[#cd8453]' : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <span className="pointer-events-none whitespace-nowrap">
                                    {division.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Guide Categories */}
            <div className="absolute top-[416px] left-[90px] flex gap-4 h-[88px] font-['Schibsted_Grotesk']">
                {categories.map((category) => {
                    const isActive = selectedCategory === category.name;
                    
                    return (
                        <div 
                            key={category.name}
                            className={`h-[88px] cursor-pointer transition-all duration-200 hover:scale-105 ${
                                isActive ? 'text-white' : 'text-[#1b3c44]'
                            }`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            <div 
                                className={`shadow-[1px_2px_8.4px_rgba(0,0,0,0.25)] rounded-[44px] h-[88px] px-[44px] flex items-center justify-center transition-colors duration-200 ${
                                    isActive ? 'bg-[#1b3c44]' : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <span className="pointer-events-none whitespace-nowrap">
                                    {category.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Guide Cards */}
            {filteredGuides.map((guide, index) => {
                const positions = ['94px', '532px', '970px', '1408px'];
                
                return (
                    <div 
                        key={guide.id}
                        className="absolute top-[600px] w-[403px] h-[520px] cursor-pointer transition-all duration-300 hover:scale-105 group"
                        style={{ 
                            left: positions[index],
                            boxShadow: '0px 6px 14.6px rgba(0, 0, 0, 0.25)'
                        }}
                    >
                        {/* Card Background */}
                        <div className="absolute top-0 left-0 w-[403px] h-[520px] bg-[#d9d9d9] rounded-[47px]"></div>
                        
                        {/* Background Image */}
                        <img 
                            className="absolute w-[570.28px] h-[760.38px] -left-[83.04px] -top-[119.69px] object-cover"
                            src="https://via.placeholder.com/570x760/cd8453/ffffff?text=Guide+Image"
                            alt={guide.title}
                        />
                        
                        {/* Gradient Overlay */}
                        <div 
                            className="absolute left-0 top-[196px] w-[403px] h-[324px] rounded-b-[47px]"
                            style={{
                                background: 'linear-gradient(180deg, rgba(102, 102, 102, 0) 0%, rgba(51, 51, 51, 0.49) 24%, rgba(0, 0, 0, 0.60) 100%)'
                            }}
                        ></div>
                        
                        {/* View Button */}
                        <div className="absolute left-[21px] top-[439px] w-[359px] h-[58px] bg-[#1b3c44] rounded-[45px] cursor-pointer hover:bg-[#0f2a30] transition-colors duration-200">
                            <div className="absolute left-[155px] top-[16px] text-[#f2eee9] text-[20px] font-['Schibsted_Grotesk'] font-bold">
                                View
                            </div>
                            <div className="absolute left-[333px] top-[12px] w-[34.12px] h-[34.65px] bg-[#f2eee9] rounded-full flex items-center justify-center">
                                <svg className="w-[16.57px] h-[16.83px] text-[#1b3c44]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                                </svg>
                            </div>
                        </div>
                        
                        {/* Title */}
                        <div className="absolute left-[20px] top-[306px] w-[360px] h-[116px] text-center text-white text-[24px] font-['Schibsted_Grotesk'] font-bold break-words leading-tight">
                            {guide.title}: {guide.description} - Only {guide.price}
                        </div>
                        
                        {/* Year */}
                        <div 
                            className="absolute left-[179px] top-[269px] text-white text-[18px] font-['Schibsted_Grotesk'] font-normal"
                            style={{ textShadow: '0px 2px 8px rgba(0, 0, 0, 0.56)' }}
                        >
                            2025
                        </div>
                    </div>
                );
            })}

            {/* No Results Message */}
            {filteredGuides.length === 0 && (
                <div className="absolute top-[650px] left-[50%] transform -translate-x-1/2 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-[#1b3c44] mb-2 font-['Lato']">
                        No guides found
                    </h3>
                    <p className="text-gray-600 font-['Lato']">
                        Try adjusting your filters or search term
                    </p>
                </div>
            )}

            {/* Results Count */}
            {filteredGuides.length > 0 && (
                <div className="absolute top-[540px] left-[90px] text-lg font-['Lato'] text-gray-600">
                    Showing {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} 
                    {selectedDivision !== 'All Divisions' && ` in ${selectedDivision}`}
                    {selectedCategory !== 'All Guides' && ` for ${selectedCategory}`}
                </div>
            )}


        </div>
    );
}
