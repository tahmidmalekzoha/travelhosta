"use client";

import { FunctionComponent, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuideData, Language } from '../../types';
import { useGuides } from '../../contexts/GuidesContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { Plus, Edit, Trash2, Search, Calendar, MapPin, Tag, Sparkles, Languages } from 'lucide-react';
import EnhancedGuideForm from './EnhancedGuideForm';
import Timeline from '../Timeline';
import ContentRenderer from '../ContentRenderer';
import Toast, { ToastType } from '../shared/Toast';


/**
 * Filters guides based on search term
 */
const filterGuides = (guides: GuideData[], searchTerm: string): GuideData[] => {
    if (!searchTerm.trim()) return guides;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return guides.filter(guide =>
        guide.title.toLowerCase().includes(lowerSearchTerm) ||
        guide.division.toLowerCase().includes(lowerSearchTerm) ||
        guide.category.toLowerCase().includes(lowerSearchTerm)
    );
};

/**
 * Determines whether a guide image URL points to a meaningful asset rather than the shared dummy placeholder.
 */
const hasMeaningfulImage = (imageUrl: string | null | undefined): imageUrl is string => {
    if (!imageUrl) {
        return false;
    }

    const normalizedUrl = imageUrl.trim().toLowerCase();
    if (!normalizedUrl) {
        return false;
    }

    // The UI uses `dummy.jpg` in several locations as a known placeholder. We avoid rendering it to prevent confusion.
    return !normalizedUrl.endsWith('dummy.jpg');
};

const FORM_DATA_STORAGE_KEY = 'guideFormData';
const EDITOR_STATE_STORAGE_KEY = 'guideEditorState';

/**
 * Guides management component for creating, editing, and deleting guides
 * Provides CRUD operations and preview functionality
 * Supports state persistence across page reloads
 */
const GuidesManagement: FunctionComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { guides, addGuide, updateGuide, deleteGuide } = useGuides();
    const { categories, divisions } = useCategories();
    
    const [showForm, setShowForm] = useState(false);
    const [editingGuide, setEditingGuide] = useState<GuideData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingGuide, setViewingGuide] = useState<GuideData | null>(null);
    const [viewLanguage, setViewLanguage] = useState<Language>('en');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Restore state from URL and localStorage on mount
    useEffect(() => {
        if (isInitialized || guides.length === 0) return;

        const mode = searchParams.get('mode'); // 'create', 'edit', 'view'
        const guideId = searchParams.get('guideId');

        if (mode === 'create') {
            // Restore form data from localStorage if available
            try {
                const savedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setEditingGuide(parsedData);
                }
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
            setShowForm(true);
        } else if (mode === 'edit' && guideId) {
            const guide = guides.find(g => g.id === parseInt(guideId));
            if (guide) {
                // Try to restore form data from localStorage (user's unsaved changes)
                try {
                    const savedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
                    if (savedData) {
                        const parsedData = JSON.parse(savedData);
                        // Only restore if it's the same guide
                        if (parsedData.id === guide.id) {
                            setEditingGuide(parsedData);
                        } else {
                            setEditingGuide(guide);
                        }
                    } else {
                        setEditingGuide(guide);
                    }
                } catch (error) {
                    console.error('Error restoring form data:', error);
                    setEditingGuide(guide);
                }
                setShowForm(true);
            }
        } else if (mode === 'view' && guideId) {
            const guide = guides.find(g => g.id === parseInt(guideId));
            if (guide) {
                setViewingGuide(guide);
            }
        }

        setIsInitialized(true);
    }, [searchParams, guides, isInitialized]);

    // Save form state to localStorage when editing
    useEffect(() => {
        if (showForm && editingGuide) {
            try {
                localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(editingGuide));
            } catch (error) {
                console.error('Error saving form data:', error);
            }
        }
    }, [showForm, editingGuide]);

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
    }, []);

    const closeToast = useCallback(() => setToast(null), []);

    // Update URL when state changes
    const updateURL = useCallback((mode: 'list' | 'create' | 'edit' | 'view', guideId?: number) => {
        const params = new URLSearchParams();
        if (mode !== 'list') {
            params.set('mode', mode);
            if (guideId) {
                params.set('guideId', guideId.toString());
            }
        }
        const queryString = params.toString();
        router.push(`/admin/guides${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }, [router]);

    // Clear form data from localStorage
    const clearFormData = useCallback(() => {
        try {
            localStorage.removeItem(FORM_DATA_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing form data:', error);
        }
    }, []);

    const handleViewGuide = useCallback((guide: GuideData) => {
        setViewingGuide(guide);
        updateURL('view', guide.id);
    }, [updateURL]);

    // Extract division and category names for the form
    const divisionNames = useMemo(() => divisions.map(d => d.name), [divisions]);
    const categoryNames = useMemo(() => categories.map(c => c.name), [categories]);
    
    // Memoize filtered guides to avoid recalculating on every render
    const filteredGuides = useMemo(
        () => filterGuides(guides, searchTerm),
        [guides, searchTerm]
    );

    const hasBengaliContent = useMemo(() => {
        if (!viewingGuide) {
            return false;
        }

        return Boolean(
            viewingGuide.titleBn ||
            viewingGuide.descriptionBn ||
            (viewingGuide.contentBn && viewingGuide.contentBn.length > 0)
        );
    }, [viewingGuide]);

    const toastComponent = toast ? (
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
        />
    ) : null;

    const handleSubmit = useCallback((formData: Omit<GuideData, 'id'>) => {
        if (editingGuide && editingGuide.id) {
            updateGuide(editingGuide.id, formData);
            showToast('Guide updated successfully!', 'success');
            // Clear localStorage after successful save
            clearFormData();
            // Keep the form open with updated data
            const updatedGuide = { ...formData, id: editingGuide.id };
            setEditingGuide(updatedGuide);
            updateURL('edit', editingGuide.id);
        } else {
            addGuide(formData);
            showToast('Guide created successfully!', 'success');
            // Clear localStorage and close form after creating new guide
            clearFormData();
            setEditingGuide(null);
            setShowForm(false);
            updateURL('list');
        }
    }, [editingGuide, updateGuide, addGuide, showToast, clearFormData, updateURL]);

    const handleEdit = useCallback((guide: GuideData) => {
        clearFormData(); // Clear any previous form data
        setEditingGuide(guide);
        setShowForm(true);
        updateURL('edit', guide.id);
    }, [clearFormData, updateURL]);

    const handleDelete = useCallback((id: number) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            deleteGuide(id);
            showToast('Guide deleted successfully!', 'success');
            // If we're currently editing the deleted guide, clear form data
            if (editingGuide && editingGuide.id === id) {
                clearFormData();
                setEditingGuide(null);
                setShowForm(false);
                updateURL('list');
            }
        }
    }, [deleteGuide, showToast, editingGuide, clearFormData, updateURL]);

    const resetForm = useCallback(() => {
        clearFormData();
        setEditingGuide(null);
        setShowForm(false);
        updateURL('list');
    }, [clearFormData, updateURL]);

    const handleCreateNew = useCallback(() => {
        clearFormData(); // Clear any previous form data
        setEditingGuide(null);
        setShowForm(true);
        updateURL('create');
    }, [clearFormData, updateURL]);

    // If viewing a specific guide's details
    if (viewingGuide) {
    const detailImageUrl = hasMeaningfulImage(viewingGuide.imageUrl) ? viewingGuide.imageUrl : undefined;
        const showEnhancedContentBadge = Boolean(viewingGuide.content && viewingGuide.content.length > 0);
        const displayedTitle = viewLanguage === 'en'
            ? viewingGuide.title
            : (viewingGuide.titleBn || viewingGuide.title);
        const displayedDescription = viewLanguage === 'en'
            ? viewingGuide.description
            : (viewingGuide.descriptionBn || viewingGuide.description);
        const renderedContentBlocks = viewLanguage === 'en'
            ? viewingGuide.content
            : viewingGuide.contentBn;
        
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => {
                                setViewingGuide(null);
                                updateURL('list');
                            }}
                            className="text-[#cd8453] hover:text-[#1b3c44] font-medium self-start"
                        >
                            ← Back to Guides
                        </button>
                        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-[#1b3c44] ${
                            viewLanguage === 'bn' ? "font-bengali" : ''
                        }`}>
                            {displayedTitle}
                        </h1>
                        {showEnhancedContentBadge && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit">
                                <Sparkles size={12} />
                                Enhanced Content
                            </span>
                        )}
                    </div>

                    {/* Language Toggle for Admin View */}
                    {hasBengaliContent && (
                        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md border border-gray-200 w-fit">
                            <button
                                onClick={() => setViewLanguage('en')}
                                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                    viewLanguage === 'en'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Languages size={14} />
                                <span className="hidden sm:inline">English</span>
                                <span className="sm:hidden">EN</span>
                            </button>
                            <button
                                onClick={() => setViewLanguage('bn')}
                                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all font-bengali ${
                                    viewLanguage === 'bn'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Languages size={14} />
                                <span className="hidden sm:inline">বাংলা</span>
                                <span className="sm:hidden">বাং</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="lg:col-span-2">
                            {detailImageUrl ? (
                                <img
                                    src={detailImageUrl}
                                    alt={viewingGuide.title}
                                    className="w-full h-48 sm:h-64 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-48 sm:h-64 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg">
                                    <div className="text-center text-gray-500">
                                        <svg className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm sm:text-base">No Image Available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                                <MapPin size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                <span>{viewingGuide.division}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                                <Tag size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                <span>{viewingGuide.category}</span>
                            </div>
                            
                            {/* Tags Display */}
                            {viewingGuide.tags && viewingGuide.tags.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs sm:text-sm font-medium text-gray-700">Tags:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {viewingGuide.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-block px-2 sm:px-3 py-1 bg-[#1b3c44] text-white text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <p className={`text-sm sm:text-base text-gray-700 ${viewLanguage === 'bn' ? "font-bengali" : ''}`}>
                                {displayedDescription}
                            </p>
                        </div>
                    </div>

                    {/* New flexible content format */}
                    {renderedContentBlocks && renderedContentBlocks.length > 0 && (
                        <div className={viewLanguage === 'bn' ? "font-bengali" : ''}>
                            <h3 className="text-lg sm:text-xl font-semibold text-[#1b3c44] mb-4">
                                {viewLanguage === 'en' ? 'Guide Content' : 'গাইড কন্টেন্ট'}
                            </h3>
                            <ContentRenderer blocks={renderedContentBlocks} />
                        </div>
                    )}

                    {/* Legacy itinerary format */}
                    {!viewingGuide.content && viewingGuide.itinerary && viewingGuide.itinerary.length > 0 && (
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-[#1b3c44] mb-4">Travel Itinerary</h3>
                            <Timeline steps={viewingGuide.itinerary} />
                        </div>
                    )}
                </div>

                {/* Toast Notification */}
                {toastComponent}
            </div>
        );
    }

    // If showing the form
    if (showForm) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={resetForm}
                        className="text-[#cd8453] hover:text-[#1b3c44] font-medium"
                    >
                        ← Back to Guides
                    </button>
                </div>
                <EnhancedGuideForm
                    guide={editingGuide || undefined}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    divisions={divisionNames}
                    categories={categoryNames}
                />

                {/* Toast Notification */}
                {toastComponent}
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3c44]">Guides Management</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage travel guides with itineraries</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                    Create New Guide
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search guides by title, division, or category..."
                        className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredGuides.map((guide) => {
                    const cardImageUrl = hasMeaningfulImage(guide.imageUrl) ? guide.imageUrl : undefined;

                    return (
                        <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                                {cardImageUrl ? (
                                    <img
                                        src={cardImageUrl}
                                        alt={guide.title}
                                        className="w-full h-full object-contain hover:scale-105 transition-transform cursor-pointer"
                                        onClick={() => handleViewGuide(guide)}
                                    />
                                ) : (
                                    <div 
                                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 cursor-pointer"
                                        onClick={() => handleViewGuide(guide)}
                                    >
                                        <div className="text-center text-gray-500">
                                            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs sm:text-sm">No Image</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 sm:p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-[#1b3c44] mb-2 line-clamp-1">{guide.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
                                
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        <span className="truncate">{guide.division}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Tag size={12} />
                                        <span className="truncate">{guide.category}</span>
                                    </div>
                                    {guide.itinerary && guide.itinerary.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{guide.itinerary.length} steps</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleViewGuide(guide)}
                                        className="text-[#cd8453] hover:text-[#1b3c44] text-xs sm:text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => handleEdit(guide)}
                                            className="p-1.5 sm:p-2 text-[#cd8453] hover:text-[#1b3c44] hover:bg-gray-100 rounded"
                                            title="Edit Guide"
                                        >
                                            <Edit size={14} className="sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(guide.id)}
                                            className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            title="Delete Guide"
                                        >
                                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredGuides.length === 0 && (
                <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-md">
                    <div className="text-gray-400 mb-4">
                        <Calendar size={40} className="mx-auto sm:w-12 sm:h-12" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No guides found</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                        {searchTerm ? 'No guides match your search criteria.' : 'Create your first travel guide to get started!'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors text-sm sm:text-base"
                        >
                            <Plus size={18} className="sm:w-5 sm:h-5" />
                            Create New Guide
                        </button>
                    )}
                </div>
            )}

            {/* Toast Notification */}
            {toastComponent}
        </div>
    );
};

export default GuidesManagement;
