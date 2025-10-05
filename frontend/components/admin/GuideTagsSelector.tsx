/**
 * GuideTagsSelector component
 * Handles tag selection and management for guides
 */

import { FunctionComponent, useState } from 'react';

interface Tag {
    id: string | number;
    name: string;
}

interface GuideTagsSelectorProps {
    selectedTags: string[];
    availableTags: Tag[];
    onTagsChange: (tags: string[]) => void;
}

const GuideTagsSelector: FunctionComponent<GuideTagsSelectorProps> = ({
    selectedTags,
    availableTags,
    onTagsChange
}) => {
    const [tagInput, setTagInput] = useState('');

    /**
     * Adds a tag to the guide
     */
    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            onTagsChange([...selectedTags, trimmedTag]);
            setTagInput('');
        }
    };

    /**
     * Removes a tag from the guide
     */
    const removeTag = (index: number) => {
        onTagsChange(selectedTags.filter((_, i) => i !== index));
    };

    /**
     * Toggles a managed tag
     */
    const toggleManagedTag = (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            onTagsChange(selectedTags.filter(t => t !== tagName));
        } else {
            onTagsChange([...selectedTags, tagName]);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (for filtering)
            </label>
            
            {/* Quick Select Tags */}
            {availableTags.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Quick select from managed tags:</p>
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.name);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleManagedTag(tag.name)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        isSelected
                                            ? 'bg-[#1b3c44] text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#cd8453] hover:text-[#cd8453]'
                                    }`}
                                >
                                    {tag.name}
                                    {isSelected && ' ✓'}
                                </button>
                            );
                        })}
                    </div>
                    <div className="border-t border-gray-300 my-3"></div>
                </div>
            )}
            
            {/* Custom Tag Input */}
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                    placeholder="Type a custom tag and press Enter"
                />
                <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b8744a] transition-colors"
                >
                    Add Tag
                </button>
            </div>
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#1b3c44] text-white rounded-full text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="ml-1 hover:text-red-300 transition-colors"
                                aria-label={`Remove ${tag} tag`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
                Select from managed tags above or add custom tags. Tags help users filter guides.
            </p>
        </div>
    );
};

export default GuideTagsSelector;
