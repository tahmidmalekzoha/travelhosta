"use client";

import { FunctionComponent, useState } from 'react';
import { Plus, Trash2, Tag, MapPin } from 'lucide-react';
import { useCategories } from '../../contexts/CategoriesContext';

/**
 * Categories management component for admin panel
 * Allows adding and removing guide categories and divisions
 */
const CategoriesManagement: FunctionComponent = () => {
    const { categories, divisions, addCategory, removeCategory, addDivision, removeDivision } = useCategories();
    
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newDivisionName, setNewDivisionName] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [showDivisionInput, setShowDivisionInput] = useState(false);

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName);
            setNewCategoryName('');
            setShowCategoryInput(false);
        }
    };

    const handleAddDivision = () => {
        if (newDivisionName.trim()) {
            addDivision(newDivisionName);
            setNewDivisionName('');
            setShowDivisionInput(false);
        }
    };

    const handleRemoveCategory = (id: string) => {
        if (confirm('Are you sure you want to remove this category?')) {
            removeCategory(id);
        }
    };

    const handleRemoveDivision = (id: string) => {
        if (confirm('Are you sure you want to remove this division?')) {
            removeDivision(id);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1b3c44] mb-8">Categories & Divisions Management</h1>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Guide Categories Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Tag className="text-[#cd8453]" size={24} />
                                <h2 className="text-2xl font-semibold text-[#1b3c44]">Guide Categories</h2>
                            </div>
                            <button
                                onClick={() => setShowCategoryInput(!showCategoryInput)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87348] transition-colors"
                            >
                                <Plus size={20} />
                                Add
                            </button>
                        </div>

                        {/* Add Category Input */}
                        {showCategoryInput && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                    placeholder="Enter category name..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-[#1b3c44] text-white rounded-lg hover:bg-[#2a5560] transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCategoryInput(false);
                                            setNewCategoryName('');
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Categories List */}
                        <div className="space-y-2">
                            {categories.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No categories yet. Add your first category!</p>
                            ) : (
                                categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-[#1b3c44]">{category.name}</span>
                                        <button
                                            onClick={() => handleRemoveCategory(category.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove category"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                            Total: {categories.length} categories
                        </div>
                    </div>

                    {/* Divisions Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-[#cd8453]" size={24} />
                                <h2 className="text-2xl font-semibold text-[#1b3c44]">Divisions</h2>
                            </div>
                            <button
                                onClick={() => setShowDivisionInput(!showDivisionInput)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87348] transition-colors"
                            >
                                <Plus size={20} />
                                Add
                            </button>
                        </div>

                        {/* Add Division Input */}
                        {showDivisionInput && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="text"
                                    value={newDivisionName}
                                    onChange={(e) => setNewDivisionName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddDivision()}
                                    placeholder="Enter division name..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddDivision}
                                        className="px-4 py-2 bg-[#1b3c44] text-white rounded-lg hover:bg-[#2a5560] transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDivisionInput(false);
                                            setNewDivisionName('');
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Divisions List */}
                        <div className="space-y-2">
                            {divisions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No divisions yet. Add your first division!</p>
                            ) : (
                                divisions.map((division) => (
                                    <div
                                        key={division.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-[#1b3c44]">{division.name}</span>
                                        <button
                                            onClick={() => handleRemoveDivision(division.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove division"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                            Total: {divisions.length} divisions
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-[#1b3c44] mb-2">ℹ️ Information</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Categories and divisions are used to filter guides on the website</li>
                        <li>• Removing a category or division will not delete existing guides</li>
                        <li>• Changes are saved automatically to your browser's local storage</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CategoriesManagement;
