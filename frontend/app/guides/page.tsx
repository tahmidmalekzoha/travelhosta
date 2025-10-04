'use client';

import { useState, useMemo } from 'react';
import StickyNavbar from '../../components/StickyNavbar';
import GuideCard from '../../components/shared/GuideCard';
import Footer from '../../components/Footer';
import { useGuides } from '../../contexts/GuidesContext';
import { useCategories } from '../../contexts/CategoriesContext';
import type { GuideData } from '../../types';

export default function Guides() {
    const { guides } = useGuides();
    const { categories, divisions } = useCategories();
    const [selectedDivision, setSelectedDivision] = useState('All Divisions');
    const [selectedCategory, setSelectedCategory] = useState('All Guides');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Create arrays with "All" options
    const divisionsWithAll = [{ id: 'all-div', name: 'All Divisions' }, ...divisions];
    const categoriesWithAll = [{ id: 'all-cat', name: 'All Guides' }, ...categories];

    // Extract all unique tags from guides
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        guides.forEach(guide => {
            guide.tags?.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
    }, [guides]);

    const filteredGuides = useMemo(() => {
        return guides.filter(guide => {
            const matchesDivision = selectedDivision === 'All Divisions' || guide.division === selectedDivision;
            const matchesCategory = selectedCategory === 'All Guides' || guide.category === selectedCategory;
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => guide.tags?.includes(tag));
            const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                guide.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDivision && matchesCategory && matchesTags && matchesSearch;
        });
    }, [guides, selectedDivision, selectedCategory, selectedTags, searchTerm]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleGuideView = (guide: GuideData) => {
        // Navigation is now handled within GuideCard component
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
                        {divisionsWithAll.map((division) => {
                            const isActive = selectedDivision === division.name;
                            
                            return (
                                <button 
                                    key={division.id}
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
                        {categoriesWithAll.map((category) => {
                            const isActive = selectedCategory === category.name;
                            
                            return (
                                <button 
                                    key={category.id}
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

                    {/* Tags Filter */}
                    {allTags.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-center text-lg font-medium text-gray-700 mb-3 font-['Lato']">
                                Filter by Tags:
                            </h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {allTags.map((tag) => {
                                    const isSelected = selectedTags.includes(tag);
                                    
                                    return (
                                        <button 
                                            key={tag}
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm ${
                                                isSelected 
                                                    ? 'bg-[#cd8453] text-white shadow-md' 
                                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#cd8453]'
                                            }`}
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {isSelected && '✓ '}
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedTags.length > 0 && (
                                <div className="text-center mt-3">
                                    <button
                                        onClick={() => setSelectedTags([])}
                                        className="text-sm text-gray-600 hover:text-[#cd8453] underline"
                                    >
                                        Clear all tags
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {filteredGuides.length > 0 && (
                    <div className="mb-8 text-lg font-['Lato'] text-gray-600">
                        Showing {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} 
                        {selectedDivision !== 'All Divisions' && ` in ${selectedDivision}`}
                        {selectedCategory !== 'All Guides' && ` for ${selectedCategory}`}
                        {selectedTags.length > 0 && ` with tag${selectedTags.length > 1 ? 's' : ''}: ${selectedTags.join(', ')}`}
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
                                setSelectedTags([]);
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
