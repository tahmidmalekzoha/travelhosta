"use client";

import { FunctionComponent, useState, useCallback, useMemo } from 'react';
import { GuideData, Language } from '../../types';
import { useGuides } from '../../contexts/GuidesContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { Plus, Edit, Trash2, Search, Calendar, MapPin, Tag, Sparkles, Languages } from 'lucide-react';
import EnhancedGuideForm from './EnhancedGuideForm';
import Timeline from '../Timeline';
import ContentRenderer from '../ContentRenderer';
import Toast, { ToastType } from '../shared/Toast';
import { isValidImageUrl } from '../../utils/imageUtils';

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
 * Guides management component for creating, editing, and deleting guides
 * Provides CRUD operations and preview functionality
 */
const GuidesManagement: FunctionComponent = () => {
    const { guides, addGuide, updateGuide, deleteGuide } = useGuides();
    const { categories, divisions } = useCategories();
    const [showForm, setShowForm] = useState(false);
    const [editingGuide, setEditingGuide] = useState<GuideData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingGuide, setViewingGuide] = useState<GuideData | null>(null);
    const [viewLanguage, setViewLanguage] = useState<Language>('en');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // Extract division and category names for the form
    const divisionNames = useMemo(() => divisions.map(d => d.name), [divisions]);
    const categoryNames = useMemo(() => categories.map(c => c.name), [categories]);
    
    // Memoize filtered guides to avoid recalculating on every render
    const filteredGuides = useMemo(
        () => filterGuides(guides, searchTerm),
        [guides, searchTerm]
    );

    const handleSubmit = useCallback((formData: Omit<GuideData, 'id'>) => {
        if (editingGuide) {
            updateGuide(editingGuide.id, formData);
            setToast({ message: 'Guide updated successfully!', type: 'success' });
            // Keep the form open with updated data
            setEditingGuide({ ...formData, id: editingGuide.id });
        } else {
            addGuide(formData);
            setToast({ message: 'Guide created successfully!', type: 'success' });
            // Close form after creating new guide
            setEditingGuide(null);
            setShowForm(false);
        }
    }, [editingGuide, updateGuide, addGuide]);

    const handleEdit = useCallback((guide: GuideData) => {
        setEditingGuide(guide);
        setShowForm(true);
    }, []);

    const handleDelete = useCallback((id: number) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            deleteGuide(id);
            setToast({ message: 'Guide deleted successfully!', type: 'success' });
        }
    }, [deleteGuide]);

    const resetForm = useCallback(() => {
        setEditingGuide(null);
        setShowForm(false);
    }, []);

    const handleCreateNew = useCallback(() => {
        setEditingGuide(null);
        setShowForm(true);
    }, []);

    // If viewing a specific guide's details
    if (viewingGuide) {
        const hasBengaliContent = viewingGuide.titleBn || viewingGuide.descriptionBn || (viewingGuide.contentBn && viewingGuide.contentBn.length > 0);
        
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setViewingGuide(null)}
                            className="text-[#cd8453] hover:text-[#1b3c44] font-medium"
                        >
                            ← Back to Guides
                        </button>
                        <h1 className={`text-3xl font-bold text-[#1b3c44] ${
                            viewLanguage === 'bn' ? "font-['Bengali']" : ''
                        }`}>
                            {viewLanguage === 'en' ? viewingGuide.title : (viewingGuide.titleBn || viewingGuide.title)}
                        </h1>
                        {viewingGuide.content && viewingGuide.content.length > 0 && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                <Sparkles size={12} />
                                Enhanced Content
                            </span>
                        )}
                    </div>

                    {/* Language Toggle for Admin View */}
                    {hasBengaliContent && (
                        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md border border-gray-200">
                            <button
                                onClick={() => setViewLanguage('en')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    viewLanguage === 'en'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Languages size={14} />
                                English
                            </button>
                            <button
                                onClick={() => setViewLanguage('bn')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all font-['Bengali'] ${
                                    viewLanguage === 'bn'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Languages size={14} />
                                বাংলা
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2">
                            {viewingGuide.imageUrl && viewingGuide.imageUrl !== '' && viewingGuide.imageUrl !== 'dummy.jpg' && viewingGuide.imageUrl !== '/images/dummy.jpg' && viewingGuide.imageUrl !== 'images/dummy.jpg' && !viewingGuide.imageUrl.endsWith('dummy.jpg') ? (
                                <img
                                    src={viewingGuide.imageUrl}
                                    alt={viewingGuide.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg">
                                    <div className="text-center text-gray-500">
                                        <svg className="w-20 h-20 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-base">No Image Available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={18} />
                                <span>{viewingGuide.division}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Tag size={18} />
                                <span>{viewingGuide.category}</span>
                            </div>
                            <p className={`text-gray-700 ${viewLanguage === 'bn' ? "font-['Bengali']" : ''}`}>
                                {viewLanguage === 'en' ? viewingGuide.description : (viewingGuide.descriptionBn || viewingGuide.description)}
                            </p>
                        </div>
                    </div>

                    {/* New flexible content format */}
                    {((viewLanguage === 'en' && viewingGuide.content && viewingGuide.content.length > 0) ||
                      (viewLanguage === 'bn' && viewingGuide.contentBn && viewingGuide.contentBn.length > 0)) && (
                        <div className={viewLanguage === 'bn' ? "font-['Bengali']" : ''}>
                            <h3 className="text-xl font-semibold text-[#1b3c44] mb-4">
                                {viewLanguage === 'en' ? 'Guide Content' : 'গাইড কন্টেন্ট'}
                            </h3>
                            <ContentRenderer blocks={viewLanguage === 'en' ? viewingGuide.content! : viewingGuide.contentBn!} />
                        </div>
                    )}

                    {/* Legacy itinerary format */}
                    {!viewingGuide.content && viewingGuide.itinerary && viewingGuide.itinerary.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-[#1b3c44] mb-4">Travel Itinerary</h3>
                            <Timeline steps={viewingGuide.itinerary} />
                        </div>
                    )}
                </div>

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
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
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1b3c44]">Guides Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage travel guides with itineraries</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                >
                    <Plus size={20} />
                    Create New Guide
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search guides by title, division, or category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                    <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-200 overflow-hidden">
                            {guide.imageUrl && guide.imageUrl !== '' && guide.imageUrl !== 'dummy.jpg' && guide.imageUrl !== '/images/dummy.jpg' && guide.imageUrl !== 'images/dummy.jpg' && !guide.imageUrl.endsWith('dummy.jpg') ? (
                                <img
                                    src={guide.imageUrl}
                                    alt={guide.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onClick={() => setViewingGuide(guide)}
                                />
                            ) : (
                                <div 
                                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 cursor-pointer"
                                    onClick={() => setViewingGuide(guide)}
                                >
                                    <div className="text-center text-gray-500">
                                        <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm">No Image</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4">
                            <h3 className="font-semibold text-[#1b3c44] mb-2 line-clamp-1">{guide.title}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span>{guide.division}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag size={12} />
                                    <span>{guide.category}</span>
                                </div>
                                {guide.itinerary && guide.itinerary.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{guide.itinerary.length} steps</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setViewingGuide(guide)}
                                    className="text-[#cd8453] hover:text-[#1b3c44] text-sm font-medium"
                                >
                                    View Details
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(guide)}
                                        className="p-2 text-[#cd8453] hover:text-[#1b3c44] hover:bg-gray-100 rounded"
                                        title="Edit Guide"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(guide.id)}
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                        title="Delete Guide"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredGuides.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <div className="text-gray-400 mb-4">
                        <Calendar size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? 'No guides match your search criteria.' : 'Create your first travel guide to get started!'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                        >
                            <Plus size={20} />
                            Create New Guide
                        </button>
                    )}
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default GuidesManagement;
