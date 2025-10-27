'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StickyNavbar from '../../components/StickyNavbar';
import GuideCard from '../../components/shared/GuideCard';
import Footer from '../../components/Footer';
import { useGuides } from '../../contexts/GuidesContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { ArrowLeft, ChevronDown, X } from 'lucide-react';

// Constants for filter options
const ALL_DIVISIONS = 'All Divisions';
const ALL_GUIDES = 'All Guides';

/**
 * Guides page component displaying filterable and searchable travel guides
 * Features division, category, and tag filtering with search functionality
 */
export default function Guides() {
    const router = useRouter();
    const { guides } = useGuides();
    const { categories, divisions } = useCategories();
    const [selectedDivision, setSelectedDivision] = useState(ALL_DIVISIONS);
    const [selectedCategory, setSelectedCategory] = useState(ALL_GUIDES);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Accordion state for mobile filters
    const [isDivisionOpen, setIsDivisionOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);

    const handleQueryTag = useCallback((tagFromUrl: string | null) => {
        if (tagFromUrl) {
            setSelectedTags([tagFromUrl]);
        }
    }, []);

    // Create arrays with "All" options
    const divisionsWithAll = useMemo(() => 
        [{ id: 'all-div', name: ALL_DIVISIONS }, ...divisions], 
        [divisions]
    );
    
    const categoriesWithAll = useMemo(() => 
        [{ id: 'all-cat', name: ALL_GUIDES }, ...categories], 
        [categories]
    );

    // Extract all unique tags from guides
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        guides.forEach(guide => {
            guide.tags?.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
    }, [guides]);

    // Filter guides based on all active filters
    const filteredGuides = useMemo(() => {
        return guides.filter(guide => {
            const matchesDivision = selectedDivision === ALL_DIVISIONS || guide.division === selectedDivision;
            const matchesCategory = selectedCategory === ALL_GUIDES || guide.category === selectedCategory;
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => guide.tags?.includes(tag));
            const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                guide.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDivision && matchesCategory && matchesTags && matchesSearch;
        });
    }, [guides, selectedDivision, selectedCategory, selectedTags, searchTerm]);

    // Toggle tag selection
    const toggleTag = useCallback((tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSelectedDivision(ALL_DIVISIONS);
        setSelectedCategory(ALL_GUIDES);
        setSelectedTags([]);
        setSearchTerm('');
    }, []);
    
    // Get active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedDivision !== ALL_DIVISIONS) count++;
        if (selectedCategory !== ALL_GUIDES) count++;
        count += selectedTags.length;
        return count;
    }, [selectedDivision, selectedCategory, selectedTags]);

    const handleBack = () => router.push('/');

    return (
        <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation */}
            <StickyNavbar />

            {/* Main Content */}
            <div className="px-3 sm:px-4 md:px-6 lg:px-12 xl:px-[37px] pt-[55px]">
                <Suspense fallback={null}>
                    <QueryTagSync onTag={handleQueryTag} />
                </Suspense>

                {/* Back Button */}
                <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                    <button onClick={handleBack} className="group relative inline-flex items-center rounded-full bg-[#1b3c44] h-[48px] sm:h-[54px] md:h-[60px] lg:h-[70px] xl:h-[92px] transition-transform duration-200 hover:-translate-x-1 hover:bg-[#152e34]">
                        <span className="absolute left-[6px] sm:left-[7px] md:left-[8px] lg:left-[9px] xl:left-[11.54px] top-1/2 -translate-y-1/2 flex h-[38px] w-[38px] sm:h-[43px] sm:w-[43px] md:h-[48px] md:w-[48px] lg:h-[56px] lg:w-[56px] xl:h-[65.062px] xl:w-[65.062px] items-center justify-center rounded-full bg-[#f2eee9] text-[#1b3c44]">
                            <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" strokeWidth={2.5} />
                        </span>
                        <span className="font-['Schibsted_Grotesk'] font-normal text-[16px] sm:text-[20px] md:text-[24px] lg:text-[32px] xl:text-[48px] text-[#f2eee9] ml-[48px] mr-[12px] sm:ml-[54px] sm:mr-[14px] md:ml-[60px] md:mr-[18px] lg:ml-[70px] lg:mr-[24px] xl:ml-[90px] xl:mr-[32px]">Back</span>
                    </button>
                </div>

                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 sm:mb-10 md:mb-12 gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-[85px] px-2 sm:px-3 md:px-4 lg:px-0">
                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-none text-center">
                        Guides
                    </h1>

                    {/* Search Bar */}
                    <div className="flex justify-center w-full">
                        <div className="relative h-[56px] sm:h-[64px] md:h-[72px] lg:h-[80px] bg-[#aec0c4] rounded-full shadow-lg w-full max-w-[90%] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px]">
                            <svg 
                                className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" 
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
                                className="absolute left-[52px] sm:left-[60px] md:left-[64px] lg:left-[68px] top-1/2 transform -translate-y-1/2 w-[calc(100%-60px)] sm:w-[calc(100%-68px)] md:w-[calc(100%-72px)] lg:w-[calc(100%-76px)] text-base sm:text-lg md:text-xl text-[#f2eee9] placeholder-[#f2eee9] bg-transparent border-none outline-none font-['Lato']"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Categories */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                    {/* Active Filters Display - Mobile Only */}
                    {activeFilterCount > 0 && (
                        <div className="md:hidden mb-4 flex flex-wrap gap-2">
                            {selectedDivision !== ALL_DIVISIONS && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#cd8453] text-white text-xs rounded-full">
                                    {selectedDivision}
                                    <button onClick={() => setSelectedDivision(ALL_DIVISIONS)} className="hover:scale-110">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {selectedCategory !== ALL_GUIDES && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b3c44] text-white text-xs rounded-full">
                                    {selectedCategory}
                                    <button onClick={() => setSelectedCategory(ALL_GUIDES)} className="hover:scale-110">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {selectedTags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#cd8453]/80 text-white text-xs rounded-full">
                                    {tag}
                                    <button onClick={() => toggleTag(tag)} className="hover:scale-110">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className="px-3 py-1.5 text-xs text-gray-600 hover:text-[#cd8453] underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Mobile Accordion Filters */}
                    <div className="md:hidden flex flex-wrap gap-2 justify-center">
                        {/* Division Accordion */}
                        <div className="bg-white rounded-xl shadow-sm flex-1 min-w-[110px] max-w-[140px] relative z-30">
                            <button
                                onClick={() => setIsDivisionOpen(!isDivisionOpen)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 transition-colors rounded-xl"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-[#1b3c44]">Division</span>
                                    {selectedDivision !== ALL_DIVISIONS && (
                                        <span className="px-1.5 py-0.5 bg-[#cd8453] text-white text-[10px] rounded-full">
                                            1
                                        </span>
                                    )}
                                </div>
                                <ChevronDown 
                                    size={14} 
                                    className={`text-gray-600 transition-transform duration-200 flex-shrink-0 ${isDivisionOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isDivisionOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 px-2.5 py-2.5 space-y-1.5 max-h-[180px] overflow-y-auto">
                                    {divisionsWithAll.map((division) => {
                                        const isActive = selectedDivision === division.name;
                                        return (
                                            <button
                                                key={division.id}
                                                onClick={() => {
                                                    setSelectedDivision(division.name);
                                                    setIsDivisionOpen(false);
                                                }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                                    isActive
                                                        ? 'bg-[#cd8453] text-white font-medium'
                                                        : 'bg-gray-50 text-[#1b3c44] hover:bg-gray-100'
                                                }`}
                                            >
                                                {division.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Category Accordion */}
                        <div className="bg-white rounded-xl shadow-sm flex-1 min-w-[110px] max-w-[140px] relative z-20">
                            <button
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 transition-colors rounded-xl"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-[#1b3c44]">Category</span>
                                    {selectedCategory !== ALL_GUIDES && (
                                        <span className="px-1.5 py-0.5 bg-[#1b3c44] text-white text-[10px] rounded-full">
                                            1
                                        </span>
                                    )}
                                </div>
                                <ChevronDown 
                                    size={14} 
                                    className={`text-gray-600 transition-transform duration-200 flex-shrink-0 ${isCategoryOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 px-2.5 py-2.5 space-y-1.5 max-h-[180px] overflow-y-auto">
                                    {categoriesWithAll.map((category) => {
                                        const isActive = selectedCategory === category.name;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    setSelectedCategory(category.name);
                                                    setIsCategoryOpen(false);
                                                }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                                    isActive
                                                        ? 'bg-[#1b3c44] text-white font-medium'
                                                        : 'bg-gray-50 text-[#1b3c44] hover:bg-gray-100'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Tags Accordion */}
                        {allTags.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm flex-1 min-w-[110px] max-w-[140px] relative z-10">
                                <button
                                    onClick={() => setIsTagsOpen(!isTagsOpen)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 transition-colors rounded-xl"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-[#1b3c44]">Tags</span>
                                        {selectedTags.length > 0 && (
                                            <span className="px-1.5 py-0.5 bg-[#cd8453] text-white text-[10px] rounded-full">
                                                {selectedTags.length}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown 
                                        size={14} 
                                        className={`text-gray-600 transition-transform duration-200 flex-shrink-0 ${isTagsOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isTagsOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-50 px-2.5 py-2.5">
                                        <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto">
                                            {allTags.map((tag) => {
                                                const isSelected = selectedTags.includes(tag);
                                                return (
                                                    <button
                                                        key={tag}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                                                            isSelected
                                                                ? 'bg-[#cd8453] text-white shadow-sm'
                                                                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-[#cd8453]'
                                                        }`}
                                                        onClick={() => toggleTag(tag)}
                                                    >
                                                        {isSelected && '✓ '}
                                                        {tag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Button Filters (md and up) */}
                    <div className="hidden md:block space-y-4 sm:space-y-5 md:space-y-6">
                        {/* Division Categories */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
                            {divisionsWithAll.map((division) => {
                                const isActive = selectedDivision === division.name;
                                
                                return (
                                    <button 
                                        key={division.id}
                                        className={`px-4 py-2 sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-200 hover:scale-105 shadow-md ${
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
                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
                            {categoriesWithAll.map((category) => {
                                const isActive = selectedCategory === category.name;
                                
                                return (
                                    <button 
                                        key={category.id}
                                        className={`px-4 py-2 sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-200 hover:scale-105 shadow-md ${
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
                            <div className="mt-4 sm:mt-5 md:mt-6">
                                <h3 className="text-center text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2 sm:mb-3 font-['Lato']">
                                    Filter by Tags:
                                </h3>
                                <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 justify-center">
                                    {allTags.map((tag) => {
                                        const isSelected = selectedTags.includes(tag);
                                        
                                        return (
                                            <button 
                                                key={tag}
                                                className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 lg:px-6 lg:py-2 rounded-full text-xs sm:text-sm md:text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm ${
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
                                    <div className="text-center mt-2 sm:mt-3">
                                        <button
                                            onClick={() => setSelectedTags([])}
                                            className="text-xs sm:text-sm text-gray-600 hover:text-[#cd8453] underline"
                                        >
                                            Clear all tags
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                {filteredGuides.length > 0 && (
                    <div className="mb-6 sm:mb-7 md:mb-8 text-sm sm:text-base md:text-lg font-['Lato'] text-gray-600">
                        Showing {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} 
                        {selectedDivision !== ALL_DIVISIONS && ` in ${selectedDivision}`}
                        {selectedCategory !== ALL_GUIDES && ` for ${selectedCategory}`}
                        {selectedTags.length > 0 && ` with tag${selectedTags.length > 1 ? 's' : ''}: ${selectedTags.join(', ')}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </div>
                )}

                {/* Guide Cards Grid - matching homepage grid pattern */}
                {filteredGuides.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10 pb-12 sm:pb-14 md:pb-16 lg:pb-20">
                        {filteredGuides.map((guide) => (
                            <GuideCard
                                key={guide.id}
                                guide={guide}
                            />
                        ))}
                    </div>
                ) : (
                    /* No Results Message */
                    <div className="text-center py-12 sm:py-16 md:py-20">
                        <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-5 md:mb-6">🔍</div>
                        <h3 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-[#1b3c44] mb-3 sm:mb-4 font-['Lato']">
                            No guides found
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-['Lato'] mb-6 sm:mb-7 md:mb-8 px-4">
                            Try adjusting your filters or search term
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-[#cd8453] text-white rounded-full text-base sm:text-lg font-medium hover:bg-[#b8744a] transition-colors duration-200"
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

function QueryTagSync({ onTag }: { onTag: (tag: string | null) => void }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const tagFromUrl = searchParams.get('tag');
        onTag(tagFromUrl);
    }, [onTag, searchParams]);

    return null;
}
