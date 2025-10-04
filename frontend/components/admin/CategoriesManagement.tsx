"use client";

import { FunctionComponent, useState, useEffect } from 'react';
import { Plus, Trash2, Tag, MapPin, Hash, Save, RotateCcw } from 'lucide-react';
import { useCategories } from '../../contexts/CategoriesContext';
import { Category, Division, Tag as TagType } from '../../contexts/CategoriesContext';

/**
 * Categories management component for admin panel
 * Allows adding and removing guide categories, divisions, and tags
 */
const CategoriesManagement: FunctionComponent = () => {
    const { 
        categories: savedCategories, 
        divisions: savedDivisions, 
        tags: savedTags, 
        addCategory, 
        removeCategory, 
        addDivision, 
        removeDivision, 
        addTag, 
        removeTag,
        setCategories,
        setDivisions,
        setTags
    } = useCategories();
    
    // Local state for pending changes
    const [localCategories, setLocalCategories] = useState<Category[]>([]);
    const [localDivisions, setLocalDivisions] = useState<Division[]>([]);
    const [localTags, setLocalTags] = useState<TagType[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newDivisionName, setNewDivisionName] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [showDivisionInput, setShowDivisionInput] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize local state from saved state only once on mount
    useEffect(() => {
        if (!isInitialized) {
            setLocalCategories([...savedCategories]);
            setLocalDivisions([...savedDivisions]);
            setLocalTags([...savedTags]);
            setIsInitialized(true);
        }
    }, [savedCategories, savedDivisions, savedTags, isInitialized]);

    // Check if there are changes
    useEffect(() => {
        const categoriesChanged = JSON.stringify(localCategories) !== JSON.stringify(savedCategories);
        const divisionsChanged = JSON.stringify(localDivisions) !== JSON.stringify(savedDivisions);
        const tagsChanged = JSON.stringify(localTags) !== JSON.stringify(savedTags);
        setHasChanges(categoriesChanged || divisionsChanged || tagsChanged);
    }, [localCategories, localDivisions, localTags, savedCategories, savedDivisions, savedTags]);

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory: Category = {
                id: `cat-${Date.now()}`,
                name: newCategoryName.trim(),
            };
            setLocalCategories(prev => [...prev, newCategory]);
            setNewCategoryName('');
            setShowCategoryInput(false);
        }
    };

    const handleAddDivision = () => {
        if (newDivisionName.trim()) {
            const newDivision: Division = {
                id: `div-${Date.now()}`,
                name: newDivisionName.trim(),
            };
            setLocalDivisions(prev => [...prev, newDivision]);
            setNewDivisionName('');
            setShowDivisionInput(false);
        }
    };

    const handleAddTag = () => {
        if (newTagName.trim()) {
            const newTag: TagType = {
                id: `tag-${Date.now()}`,
                name: newTagName.trim(),
            };
            setLocalTags(prev => [...prev, newTag]);
            setNewTagName('');
            setShowTagInput(false);
        }
    };

    const handleRemoveCategory = (id: string) => {
        setLocalCategories(prev => prev.filter(cat => cat.id !== id));
    };

    const handleRemoveDivision = (id: string) => {
        setLocalDivisions(prev => prev.filter(div => div.id !== id));
    };

    const handleRemoveTag = (id: string) => {
        setLocalTags(prev => prev.filter(tag => tag.id !== id));
    };

    const handleSaveChanges = () => {
        // Directly update the context with the local arrays
        setCategories(localCategories);
        setDivisions(localDivisions);
        setTags(localTags);
        setHasChanges(false);
    };

    const handleDiscardChanges = () => {
        setLocalCategories([...savedCategories]);
        setLocalDivisions([...savedDivisions]);
        setLocalTags([...savedTags]);
        setHasChanges(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3c44]">Categories, Divisions & Tags Management</h1>
                    
                    {/* Save/Discard Buttons */}
                    {hasChanges && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveChanges}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                            <button
                                onClick={handleDiscardChanges}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                            >
                                <RotateCcw size={18} />
                                Discard
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Guide Categories Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
                            <div className="flex items-center gap-2">
                                <Tag className="text-[#cd8453] flex-shrink-0" size={20} />
                                <h2 className="text-xl sm:text-2xl font-semibold text-[#1b3c44]">Guide Categories</h2>
                            </div>
                            <button
                                onClick={() => setShowCategoryInput(!showCategoryInput)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87348] transition-colors text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Plus size={18} className="sm:w-5 sm:h-5" />
                                Add
                            </button>
                        </div>

                        {/* Add Category Input */}
                        {showCategoryInput && (
                            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                    placeholder="Enter category name..."
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddCategory}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-[#1b3c44] text-white rounded-lg hover:bg-[#2a5560] transition-colors text-sm sm:text-base"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCategoryInput(false);
                                            setNewCategoryName('');
                                        }}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Categories List */}
                        <div className="space-y-2">
                            {localCategories.length === 0 ? (
                                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No categories yet. Add your first category!</p>
                            ) : (
                                localCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-[#1b3c44] text-sm sm:text-base truncate pr-2">{category.name}</span>
                                        <button
                                            onClick={() => handleRemoveCategory(category.id)}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            title="Remove category"
                                        >
                                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 text-xs sm:text-sm text-gray-500">
                            Total: {localCategories.length} categories
                        </div>
                    </div>

                    {/* Divisions Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-[#cd8453] flex-shrink-0" size={20} />
                                <h2 className="text-xl sm:text-2xl font-semibold text-[#1b3c44]">Divisions</h2>
                            </div>
                            <button
                                onClick={() => setShowDivisionInput(!showDivisionInput)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87348] transition-colors text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Plus size={18} className="sm:w-5 sm:h-5" />
                                Add
                            </button>
                        </div>

                        {/* Add Division Input */}
                        {showDivisionInput && (
                            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="text"
                                    value={newDivisionName}
                                    onChange={(e) => setNewDivisionName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddDivision()}
                                    placeholder="Enter division name..."
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddDivision}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-[#1b3c44] text-white rounded-lg hover:bg-[#2a5560] transition-colors text-sm sm:text-base"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDivisionInput(false);
                                            setNewDivisionName('');
                                        }}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Divisions List */}
                        <div className="space-y-2">
                            {localDivisions.length === 0 ? (
                                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No divisions yet. Add your first division!</p>
                            ) : (
                                localDivisions.map((division) => (
                                    <div
                                        key={division.id}
                                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-[#1b3c44] text-sm sm:text-base truncate pr-2">{division.name}</span>
                                        <button
                                            onClick={() => handleRemoveDivision(division.id)}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            title="Remove division"
                                        >
                                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 text-xs sm:text-sm text-gray-500">
                            Total: {localDivisions.length} divisions
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
                            <div className="flex items-center gap-2">
                                <Hash className="text-[#cd8453] flex-shrink-0" size={20} />
                                <h2 className="text-xl sm:text-2xl font-semibold text-[#1b3c44]">Tags</h2>
                            </div>
                            <button
                                onClick={() => setShowTagInput(!showTagInput)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87348] transition-colors text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Plus size={18} className="sm:w-5 sm:h-5" />
                                Add
                            </button>
                        </div>

                        {/* Add Tag Input */}
                        {showTagInput && (
                            <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                    placeholder="Enter tag name..."
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddTag}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-[#1b3c44] text-white rounded-lg hover:bg-[#2a5560] transition-colors text-sm sm:text-base"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowTagInput(false);
                                            setNewTagName('');
                                        }}
                                        className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tags List */}
                        <div className="space-y-2">
                            {localTags.length === 0 ? (
                                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No tags yet. Add your first tag!</p>
                            ) : (
                                localTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-[#1b3c44] text-sm sm:text-base truncate pr-2">{tag.name}</span>
                                        <button
                                            onClick={() => handleRemoveTag(tag.id)}
                                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            title="Remove tag"
                                        >
                                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 text-xs sm:text-sm text-gray-500">
                            Total: {localTags.length} tags
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold text-[#1b3c44] mb-2 text-sm sm:text-base">ℹ️ Information</h3>
                    <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <li>• Categories, divisions, and tags are used to filter and organize guides on the website</li>
                        <li>• Make all your changes (add/remove) then click "Save Changes" to apply them</li>
                        <li>• Click "Discard" to revert all unsaved changes</li>
                        <li>• Removing a category, division, or tag will not delete existing guides</li>
                        <li>• Data is stored in your browser's local storage</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CategoriesManagement;
