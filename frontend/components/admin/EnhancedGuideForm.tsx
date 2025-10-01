import { FunctionComponent, useState, useEffect } from 'react';
import { GuideData, ContentBlock } from '../../types';
import { parseGuideContent, contentToText, validateContent, sampleContent } from '../../utils/contentParser';
import ContentRenderer from '../ContentRenderer';
import TableEditor from './TableEditor';
import { Eye, EyeOff, AlertCircle, FileText, Image, Layout, Calendar, Table } from 'lucide-react';

interface EnhancedGuideFormProps {
    guide?: GuideData;
    onSubmit: (data: Omit<GuideData, 'id'>) => void;
    onCancel: () => void;
    divisions: string[];
    categories: string[];
}

/**
 * Enhanced guide form with flexible content blocks support
 * Supports: text, timeline, images, and galleries in any order
 */
const EnhancedGuideForm: FunctionComponent<EnhancedGuideFormProps> = ({
    guide,
    onSubmit,
    onCancel,
    divisions,
    categories
}) => {
    const [formData, setFormData] = useState<Omit<GuideData, 'id'>>({
        title: guide?.title || '',
        description: guide?.description || '',
        division: guide?.division || '',
        category: guide?.category || '',
        imageUrl: guide?.imageUrl || '',
        content: guide?.content || []
    });

    const [contentText, setContentText] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [contentErrors, setContentErrors] = useState<string[]>([]);
    const [showHelp, setShowHelp] = useState(false);
    const [showTableEditor, setShowTableEditor] = useState(false);

    // Initialize content text from existing guide
    useEffect(() => {
        if (guide?.content) {
            setContentText(contentToText(guide.content));
        }
    }, [guide]);

    // Parse content text and update form data
    useEffect(() => {
        if (contentText.trim()) {
            const parsedBlocks = parseGuideContent(contentText);
            const errors = validateContent(parsedBlocks);
            setContentErrors(errors);
            setFormData(prev => ({ ...prev, content: parsedBlocks }));
        } else {
            setFormData(prev => ({ ...prev, content: [] }));
            setContentErrors([]);
        }
    }, [contentText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.division) {
            alert('Please fill in all required fields');
            return;
        }

        if (contentErrors.length > 0) {
            alert('Please fix the content errors before submitting');
            return;
        }

        onSubmit(formData);
    };

    const insertTemplate = (template: string) => {
        const cursorPos = (document.getElementById('content-editor') as HTMLTextAreaElement)?.selectionStart || contentText.length;
        const before = contentText.substring(0, cursorPos);
        const after = contentText.substring(cursorPos);
        setContentText(before + '\n\n' + template + '\n\n' + after);
    };

    const templates = {
        text: `:::text [heading="Section Title"]
Write your content here. You can use **bold** and *italic* text.

Add multiple paragraphs as needed.
:::`,
        timeline: `:::timeline [title="Day 1: Journey"]
## Location A to Location B
- Transportation: Cost
- Duration: Time
- Notes: Additional info

## Location B to Location C
- Transportation: Cost
- Tips: Helpful advice
:::`,
        image: `:::image
url: https://example.com/your-image.jpg
caption: Describe your image
alt: Alternative text for accessibility
:::`,
        gallery: `:::gallery [title="Photo Highlights"]
url: https://example.com/image1.jpg
caption: First photo
---
url: https://example.com/image2.jpg
caption: Second photo
---
url: https://example.com/image3.jpg
caption: Third photo
:::`,
        table: `:::table [title="Price Comparison" caption="All prices in Taka"]
Item | Budget | Mid-Range | Luxury
---
Hotel | 800 | 3000 | 8000
Food | 300 | 600 | 1500
Transport | 500 | 1000 | 3000
:::`
    };

    const handleTableInsert = (tableText: string) => {
        insertTemplate(tableText);
    };

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">
                    {guide ? 'Edit Guide' : 'Create New Guide'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="Enter guide title..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Division *
                            </label>
                            <select
                                value={formData.division}
                                onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                required
                            >
                                <option value="">Select Division</option>
                                {divisions.map((division) => (
                                    <option key={division} value={division}>{division}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                            placeholder="Enter guide description..."
                            required
                        />
                    </div>

                    {/* Content Section */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#1b3c44]">Guide Content</h3>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowHelp(!showHelp)}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <AlertCircle size={16} />
                                    {showHelp ? 'Hide Help' : 'Show Help'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                            </div>
                        </div>

                        {/* Quick Insert Buttons */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Quick Insert:</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => insertTemplate(templates.text)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FileText size={16} />
                                    Text Block
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTemplate(templates.timeline)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Calendar size={16} />
                                    Timeline
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTemplate(templates.image)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Image size={16} />
                                    Single Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTemplate(templates.gallery)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Layout size={16} />
                                    Image Gallery
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowTableEditor(true)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Table size={16} />
                                    Table (Visual Editor)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setContentText(sampleContent)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                                >
                                    Load Sample
                                </button>
                            </div>
                        </div>

                        {/* Help Section */}
                        {showHelp && (
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-3">Content Block Guide</h4>
                                <div className="space-y-3 text-sm text-blue-800">
                                    <div>
                                        <p className="font-medium mb-1">📝 Text Block:</p>
                                        <p className="ml-4">Add paragraphs, descriptions, or any narrative content. Supports **bold** and *italic* formatting.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">🗺️ Timeline Block:</p>
                                        <p className="ml-4">Create step-by-step itineraries with routes and details. Perfect for travel schedules.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">🖼️ Image Block:</p>
                                        <p className="ml-4">Insert single images with captions throughout your guide.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">🎨 Gallery Block:</p>
                                        <p className="ml-4">Create photo galleries with multiple images in a grid layout.</p>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-blue-300">
                                        <p className="font-medium">💡 Pro Tips:</p>
                                        <ul className="ml-4 mt-1 space-y-1 list-disc">
                                            <li>Mix and match blocks in any order</li>
                                            <li>Add multiple timelines for multi-day trips</li>
                                            <li>Use text blocks between timelines for context</li>
                                            <li>Add images to break up long content</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content Editor
                                </label>
                                <textarea
                                    id="content-editor"
                                    value={contentText}
                                    onChange={(e) => setContentText(e.target.value)}
                                    rows={20}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent font-mono text-sm"
                                    placeholder="Start typing or use Quick Insert buttons above..."
                                />

                                {/* Errors */}
                                {contentErrors.length > 0 && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                                            <AlertCircle size={16} />
                                            Content Errors:
                                        </div>
                                        <ul className="text-sm text-red-700 space-y-1">
                                            {contentErrors.map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Stats */}
                                {formData.content && formData.content.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
                                        <span>📦 {formData.content.length} block{formData.content.length !== 1 ? 's' : ''}</span>
                                        <span>📝 {formData.content.filter(b => b.type === 'text').length} text</span>
                                        <span>🗺️ {formData.content.filter(b => b.type === 'timeline').length} timeline</span>
                                        <span>🖼️ {formData.content.filter(b => b.type === 'image').length} image</span>
                                        <span>🎨 {formData.content.filter(b => b.type === 'imageGallery').length} gallery</span>
                                        <span>📊 {formData.content.filter(b => b.type === 'table').length} table</span>
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Live Preview
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-6 bg-[#f2eee9] max-h-[600px] overflow-y-auto">
                                        {formData.content && formData.content.length > 0 ? (
                                            <ContentRenderer blocks={formData.content} />
                                        ) : (
                                            <div className="text-gray-500 text-center py-8">
                                                No content to preview. Start adding blocks on the left.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                        >
                            {guide ? 'Update Guide' : 'Create Guide'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table Editor Modal */}
            {showTableEditor && (
                <TableEditor
                    onInsert={handleTableInsert}
                    onClose={() => setShowTableEditor(false)}
                />
            )}
        </div>
    );
};

export default EnhancedGuideForm;
