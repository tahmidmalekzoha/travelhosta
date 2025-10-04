"use client";

import { FunctionComponent, useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Search, Check } from 'lucide-react';
import { useGuides } from '../../contexts/GuidesContext';

// Maximum number of featured guides allowed
const MAX_FEATURED_GUIDES = 4;

/**
 * Checks if two arrays of IDs are equal (order-independent)
 */
const areIdsEqual = (ids1: number[], ids2: number[]): boolean => {
    return JSON.stringify([...ids1].sort()) === JSON.stringify([...ids2].sort());
};

/**
 * Featured guides management component for admin panel
 * Allows selecting exactly 4 guides to feature on the homepage
 */
const FeaturedGuidesManagement: FunctionComponent = () => {
    const { guides, featuredGuideIds, setFeaturedGuides, getFeaturedGuides } = useGuides();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>(featuredGuideIds);

    // Sync selectedIds with context when featuredGuideIds changes
    useEffect(() => {
        setSelectedIds(featuredGuideIds);
    }, [featuredGuideIds]);

    // Check if there are unsaved changes
    const hasChanges = useMemo(
        () => !areIdsEqual(selectedIds, featuredGuideIds),
        [selectedIds, featuredGuideIds]
    );

    // Filter guides based on search term
    const filteredGuides = useMemo(() => {
        if (!searchTerm.trim()) return guides;
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        return guides.filter(guide =>
            guide.title.toLowerCase().includes(lowerSearchTerm) ||
            guide.division.toLowerCase().includes(lowerSearchTerm) ||
            guide.category.toLowerCase().includes(lowerSearchTerm)
        );
    }, [guides, searchTerm]);

    const toggleGuide = useCallback((id: number) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                // Remove guide from selection
                return prev.filter(guideId => guideId !== id);
            } else {
                // Add guide to selection if under limit
                if (prev.length < MAX_FEATURED_GUIDES) {
                    return [...prev, id];
                } else {
                    alert(`You can only feature ${MAX_FEATURED_GUIDES} guides. Please deselect one first.`);
                    return prev;
                }
            }
        });
    }, []);

    const handleSave = useCallback(() => {
        if (selectedIds.length !== MAX_FEATURED_GUIDES) {
            alert(`Please select exactly ${MAX_FEATURED_GUIDES} guides. Currently selected: ${selectedIds.length}`);
            return;
        }
        setFeaturedGuides(selectedIds);
        alert('Featured guides updated successfully!');
    }, [selectedIds, setFeaturedGuides]);

    const handleReset = useCallback(() => {
        setSelectedIds(featuredGuideIds);
    }, [featuredGuideIds]);

    const featuredGuides = useMemo(() => getFeaturedGuides(), [getFeaturedGuides]);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1b3c44] mb-2">Featured Guides</h1>
                    <p className="text-gray-600">Select exactly 4 guides to feature on the homepage</p>
                </div>

                {/* Current Featured Guides */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="text-[#cd8453]" size={24} />
                        <h2 className="text-xl font-semibold text-[#1b3c44]">Current Featured Guides</h2>
                    </div>
                    
                    {featuredGuides.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No featured guides selected yet</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {featuredGuides.map((guide) => (
                                <div key={guide.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#cd8453] transition-colors">
                                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                        {guide.imageUrl && guide.imageUrl !== '' && !guide.imageUrl.endsWith('dummy.jpg') ? (
                                            <img 
                                                src={guide.imageUrl} 
                                                alt={guide.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-[#1b3c44] mb-1 truncate">{guide.title}</h3>
                                    <p className="text-sm text-gray-600">{guide.division}</p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-[#cd8453]/10 text-[#cd8453] text-xs rounded">
                                        {guide.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Selected: {selectedIds.length}/4 guides
                        </span>
                        {hasChanges && (
                            <span className="text-sm text-orange-600 font-medium">
                                Unsaved changes
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={selectedIds.length !== 4}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                                selectedIds.length === 4
                                    ? 'bg-[#cd8453] text-white hover:bg-[#1b3c44]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <Check size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search guides by title, division, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Guides Grid */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-[#1b3c44] mb-6">All Guides</h2>
                    
                    {filteredGuides.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            {searchTerm ? 'No guides found matching your search.' : 'No guides available.'}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredGuides.map((guide) => {
                                const isSelected = selectedIds.includes(guide.id);
                                const isFeatured = featuredGuideIds.includes(guide.id);
                                
                                return (
                                    <div
                                        key={guide.id}
                                        onClick={() => toggleGuide(guide.id)}
                                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                            isSelected
                                                ? 'border-[#cd8453] bg-[#cd8453]/5'
                                                : 'border-gray-200 hover:border-[#cd8453]/50'
                                        }`}
                                    >
                                        {/* Selection indicator */}
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            isSelected
                                                ? 'bg-[#cd8453] border-[#cd8453]'
                                                : 'border-gray-300'
                                        }`}>
                                            {isSelected && <Check size={14} className="text-white" />}
                                        </div>

                                        {/* Featured badge */}
                                        {isFeatured && (
                                            <div className="absolute top-2 left-2 bg-[#cd8453] text-white px-2 py-1 rounded text-xs font-medium">
                                                Featured
                                            </div>
                                        )}

                                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                            {guide.imageUrl && guide.imageUrl !== '' && !guide.imageUrl.endsWith('dummy.jpg') ? (
                                                <img 
                                                    src={guide.imageUrl} 
                                                    alt={guide.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 className="font-semibold text-[#1b3c44] mb-2 truncate">{guide.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{guide.description}</p>
                                        <p className="text-sm text-[#cd8453] font-medium">{guide.division}</p>
                                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {guide.category}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-[#1b3c44] mb-2">ℹ️ Information</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Featured guides will appear on the homepage in a dedicated section</li>
                        <li>• You must select exactly 4 guides to feature</li>
                        <li>• Click on any guide card to select or deselect it</li>
                        <li>• Changes are only saved when you click "Save Changes"</li>
                        <li>• Featured guides are stored in your browser's local storage</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FeaturedGuidesManagement;
