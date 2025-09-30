'use client';

import { useState, useMemo } from 'react';
import StickyNavbar from '../../components/StickyNavbar';
import GuideCard from '../../components/shared/GuideCard';
import Footer from '../../components/Footer';
import { GUIDE_DIVISIONS, GUIDE_CATEGORIES } from '../../constants';
import { useGuides } from '../../contexts/GuidesContext';
import type { GuideData } from '../../types';

export default function Guides() {
    const { guides } = useGuides();
    const [selectedDivision, setSelectedDivision] = useState('All Divisions');
    const [selectedCategory, setSelectedCategory] = useState('All Guides');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGuides = useMemo(() => {
        return guides.filter(guide => {
            const matchesDivision = selectedDivision === 'All Divisions' || guide.division === selectedDivision;
            const matchesCategory = selectedCategory === 'All Guides' || guide.category === selectedCategory;
            const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                guide.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDivision && matchesCategory && matchesSearch;
        });
    }, [selectedDivision, selectedCategory, searchTerm]);

    const handleGuideView = (guide: GuideData) => {
        console.log('View guide clicked:', guide.title);
        // TODO: Navigate to guide detail page
        // router.push(`/guides/${guide.id}`);
    };

    return (
        <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation */}
            <StickyNavbar />

            {/* Main Content */}
            <div className="pt-24 md:pt-32 lg:pt-[167px] px-6 md:px-12 lg:px-20">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-12 gap-8 lg:gap-[85px]">
                    {/* Main Title */}
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none text-center">
                        Guides
                    </h1>

                    {/* Search Bar */}
                    <div className="flex justify-center w-full">
                        <div className="relative h-20 bg-[#aec0c4] rounded-full shadow-lg w-full max-w-[600px]">
                            <svg 
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search guides..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="absolute left-16 top-1/2 transform -translate-y-1/2 w-[calc(100%-4rem)] text-xl text-[#f2eee9] placeholder-[#f2eee9] bg-transparent border-none outline-none font-['Lato']"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Categories */}
                <div className="space-y-6 mb-12">
                    {/* Division Categories */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {GUIDE_DIVISIONS.map((division) => {
                            const isActive = selectedDivision === division.name;
                            
                            return (
                                <button 
                                    key={division.name}
                                    className={`px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105 shadow-md ${
                                        isActive 
                                            ? 'bg-[#cd8453] text-white shadow-lg' 
                                            : 'bg-white text-[#1b3c44] hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedDivision(division.name)}
                                >
                                    {division.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Guide Categories */}
                    <div className="flex flex-wrap gap-4 justify-center">
                        {GUIDE_CATEGORIES.map((category) => {
                            const isActive = selectedCategory === category.name;
                            
                            return (
                                <button 
                                    key={category.name}
                                    className={`px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105 shadow-md ${
                                        isActive 
                                            ? 'bg-[#1b3c44] text-white shadow-lg' 
                                            : 'bg-white text-[#1b3c44] hover:bg-gray-50'
                                    }`}
                                    onClick={() => setSelectedCategory(category.name)}
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Results Count */}
                {filteredGuides.length > 0 && (
                    <div className="mb-8 text-lg font-['Lato'] text-gray-600">
                        Showing {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} 
                        {selectedDivision !== 'All Divisions' && ` in ${selectedDivision}`}
                        {selectedCategory !== 'All Guides' && ` for ${selectedCategory}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </div>
                )}

                {/* Guide Cards Grid */}
                {filteredGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                        {filteredGuides.map((guide) => (
                            <GuideCard
                                key={guide.id}
                                guide={guide}
                                onViewClick={() => handleGuideView(guide)}
                            />
                        ))}
                    </div>
                ) : (
                    /* No Results Message */
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-3xl font-semibold text-[#1b3c44] mb-4 font-['Lato']">
                            No guides found
                        </h3>
                        <p className="text-xl text-gray-600 font-['Lato'] mb-8">
                            Try adjusting your filters or search term
                        </p>
                        <button
                            onClick={() => {
                                setSelectedDivision('All Divisions');
                                setSelectedCategory('All Guides');
                                setSearchTerm('');
                            }}
                            className="px-8 py-4 bg-[#cd8453] text-white rounded-full text-lg font-medium hover:bg-[#b8744a] transition-colors duration-200"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
