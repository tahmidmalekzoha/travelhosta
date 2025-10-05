import { FunctionComponent, useState, useEffect, useRef } from 'react';
import { GuideData, Language, TextBlock, TimelineBlock, ImageBlock, ImageGalleryBlock, TableBlock, TipsBlock, NotesBlock } from '../../types';
import { parseGuideContent, contentToText, validateContent, sampleContent } from '../../utils/contentParser';
import { uploadGuideImage, validateImageFile } from '../../utils/imageUpload';
import ContentRenderer from '../ContentRenderer';
import TableEditor from './TableEditor';
import Toast, { ToastType } from '../shared/Toast';
import { Eye, EyeOff, AlertCircle, FileText, Image, Layout, Calendar, Table, ClipboardPaste, Lightbulb, Languages, Info, Upload, X } from 'lucide-react';
import { previewTableFromClipboard } from '../../utils/tablePasteHandler';
import { useCategories } from '../../contexts/CategoriesContext';

interface EnhancedGuideFormProps {
    guide?: GuideData;
    onSubmit: (data: Omit<GuideData, 'id'>) => void;
    onCancel: () => void;
    divisions: string[];
    categories: string[];
}

/**
 * Enhanced guide form with flexible content blocks support
 * Supports: text, timeline, images, galleries, tables, and tips in any order
 * Features bilingual support (English/Bengali) with live preview and validation
 */
const EnhancedGuideForm: FunctionComponent<EnhancedGuideFormProps> = ({
    guide,
    onSubmit,
    onCancel,
    divisions,
    categories
}) => {
    // Get tags from context
    const { tags: availableTags } = useCategories();
    
    // Language and form state
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [formData, setFormData] = useState<Omit<GuideData, 'id'>>({
        title: guide?.title || '',
        description: guide?.description || '',
        division: guide?.division || '',
        category: guide?.category || '',
        imageUrl: guide?.imageUrl || '',
        tags: guide?.tags || [],
        content: guide?.content || [],
        titleBn: guide?.titleBn || '',
        descriptionBn: guide?.descriptionBn || '',
        contentBn: guide?.contentBn || []
    });

    // Content editor state
    const [contentText, setContentText] = useState('');
    const [contentTextBn, setContentTextBn] = useState('');
    const [contentErrors, setContentErrors] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // UI state
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showTableEditor, setShowTableEditor] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    
    // Image upload state
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Table paste detection state
    const [tablePasteDetected, setTablePasteDetected] = useState(false);
    const [pastedTablePreview, setPastedTablePreview] = useState<string>('');

    // Initialize content text from existing guide
    useEffect(() => {
        if (guide?.content) {
            setContentText(contentToText(guide.content));
        }
        if (guide?.contentBn) {
            setContentTextBn(contentToText(guide.contentBn));
        }
        if (guide?.imageUrl) {
            setImagePreview(guide.imageUrl);
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

    // Parse Bengali content text and update form data
    useEffect(() => {
        if (contentTextBn.trim()) {
            const parsedBlocks = parseGuideContent(contentTextBn);
            setFormData(prev => ({ ...prev, contentBn: parsedBlocks }));
        } else {
            setFormData(prev => ({ ...prev, contentBn: [] }));
        }
    }, [contentTextBn]);

    /**
     * Handle image upload to Supabase Storage
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setToast({ message: validation.error || 'Invalid file', type: 'error' });
            return;
        }

        setUploading(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const imageUrl = await uploadGuideImage(file, formData.title || 'guide');
            setFormData(prev => ({ ...prev, imageUrl }));
            setToast({ message: 'Image uploaded successfully!', type: 'success' });
        } catch (error) {
            console.error('Upload failed:', error);
            setToast({ 
                message: error instanceof Error ? error.message : 'Failed to upload image', 
                type: 'error' 
            });
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    /**
     * Remove uploaded image
     */
    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        setImagePreview(null);
    };

    /**
     * Form submission handler - validates required fields and content before submitting
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.division) {
            setToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        if (contentErrors.length > 0) {
            setToast({ message: 'Please fix the content errors before submitting', type: 'error' });
            return;
        }

        onSubmit(formData);
    };

    /**
     * Inserts a template at the current cursor position in the content editor
     */
    const insertTemplate = (template: string) => {
        const isEnglish = currentLanguage === 'en';
        const currentContent = isEnglish ? contentText : contentTextBn;
        const setContent = isEnglish ? setContentText : setContentTextBn;
        
        const cursorPos = textareaRef.current?.selectionStart || currentContent.length;
        const before = currentContent.substring(0, cursorPos);
        const after = currentContent.substring(cursorPos);
        
        setContent(before + '\n\n' + template + '\n\n' + after);
    };

    /**
     * Handles paste events to detect and format table data
     */
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');

        // Check for table indicators: HTML table tags, tabs (TSV), or pipe separators (Markdown)
        const hasTableIndicators = 
            (htmlData && htmlData.includes('<table')) ||
            (textData && (textData.includes('\t') || textData.includes('|')));
        
        if (!hasTableIndicators) {
            return; // Not a table, use default paste behavior
        }

        const pastedContent = htmlData || textData;
        const result = previewTableFromClipboard(pastedContent);
        
        if (result.success && result.preview) {
            e.preventDefault(); // Prevent default paste
            setPastedTablePreview(result.preview);
            setTablePasteDetected(true);
        }
    };

    /**
     * Confirms and inserts the detected table from paste
     */
    const confirmTablePaste = () => {
        if (pastedTablePreview) {
            insertTemplate(pastedTablePreview);
            setTablePasteDetected(false);
            setPastedTablePreview('');
        }
    };

    /**
     * Cancels the table paste operation
     */
    const cancelTablePaste = () => {
        setTablePasteDetected(false);
        setPastedTablePreview('');
    };

    /**
     * Adds a tag to the guide
     */
    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !(formData.tags || []).includes(trimmedTag)) {
            setFormData(prev => ({ 
                ...prev, 
                tags: [...(prev.tags || []), trimmedTag] 
            }));
            setTagInput('');
        }
    };

    /**
     * Removes a tag from the guide
     */
    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter((_, i) => i !== index) || []
        }));
    };

    /**
     * Updates form field based on current language
     */
    const updateLanguageField = (field: 'title' | 'description', value: string) => {
        const fieldName = currentLanguage === 'en' ? field : `${field}Bn`;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    /**
     * Gets the value of a language-specific field
     */
    const getLanguageFieldValue = (field: 'title' | 'description'): string => {
        return currentLanguage === 'en' ? formData[field] : (formData[`${field}Bn` as keyof typeof formData] as string || '');
    };

    /**
     * Counts blocks of a specific type in the current language content
     */
    const countBlocksByType = (type: string): number => {
        const content = currentLanguage === 'en' ? formData.content : formData.contentBn;
        return content?.filter(b => b.type === type).length || 0;
    };

    /**
     * Gets the current language content
     */
    const getCurrentContent = () => {
        return currentLanguage === 'en' ? formData.content : formData.contentBn;
    };

    /**
     * Finds the line number where a block starts in the editor
     */
    const findBlockLineNumber = (blockIndex: number): number => {
        const text = currentLanguage === 'en' ? contentText : contentTextBn;
        const lines = text.split('\n');
        let currentBlock = -1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith(':::') && !line.match(/^:::$/)) {
                currentBlock++;
                if (currentBlock === blockIndex) {
                    return i + 1; // 1-indexed
                }
            }
        }
        return 1;
    };

    /**
     * Scrolls the textarea to show a specific line
     */
    const scrollToLine = (lineNumber: number) => {
        if (textareaRef.current) {
            const lineHeight = 24; // Match the CSS line-height
            const scrollTop = (lineNumber - 1) * lineHeight;
            textareaRef.current.scrollTop = scrollTop;
            textareaRef.current.focus();
            
            // Try to position cursor at that line
            const text = currentLanguage === 'en' ? contentText : contentTextBn;
            const lines = text.split('\n');
            let position = 0;
            for (let i = 0; i < lineNumber - 1 && i < lines.length; i++) {
                position += lines[i].length + 1; // +1 for newline
            }
            textareaRef.current.setSelectionRange(position, position);
        }
    };

    /**
     * Content block templates for quick insertion
     */
    const templates = {
        text: `:::text [heading="Section Title"]
Write your content here. You can use **bold** and *italic* text.

Add multiple paragraphs as needed.
:::`,
        tips: `:::tips
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
- Keep emergency contact numbers handy
- Pack light but bring layers for changing weather
:::`,
        notes: `:::notes
- Entry times may vary by season - check before visiting
- Some locations require advance booking
- Photography restrictions may apply in certain areas
- Carry a copy of your ID for verification
:::`,
        timeline: `:::timeline [title="Day 1: Journey"]
Location A to Location B
- Transportation: Cost
- Duration: Time
- Notes: Additional info

Location B to Location C
- Transportation: Cost
- Tips: Helpful advice
:::`,
        timelineTips: `[tips]
- Tip for this step
- Another tip
[/tips]`,
        timelineNotes: `[notes]
- Note for this step
- Another note
[/notes]`,
        timelineWithTips: `:::timeline [title="Day 1: Getting There"]
Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
- Departure: 6:30 AM
[tips]
- Book window seats for scenic views
- Carry snacks and water bottles
- Keep ticket accessible for checks
[/tips]

Sylhet Railway Station to Hotel
- CNG Auto: 100 Taka
- Duration: 20 minutes
[tips]
- Use metered CNG or agree on price first
- Save hotel address in Bengali on your phone
[/tips]
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

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">
                    {guide ? 'Edit Guide' : 'Create New Guide'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image Upload Section */}
                    <div className="border-b pb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Image
                        </label>
                        
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-64 h-40 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Upload Button & URL Input */}
                        <div className="flex gap-3 flex-wrap">
                            <label className="flex items-center gap-2 px-4 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#b87344] transition-colors cursor-pointer">
                                <Upload size={18} />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>

                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                                    setImagePreview(e.target.value);
                                }}
                                className="flex-1 min-w-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="Or paste image URL..."
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Upload an image (max 5MB) or paste an external URL
                        </p>
                    </div>

                    {/* Basic Info - Shared fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

                    {/* Tags Section */}
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
                                        const isSelected = formData.tags?.includes(tag.name);
                                        return (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        // Remove tag
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            tags: prev.tags?.filter(t => t !== tag.name) || []
                                                        }));
                                                    } else {
                                                        // Add tag
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            tags: [...(prev.tags || []), tag.name]
                                                        }));
                                                    }
                                                }}
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
                        {formData.tags && formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
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

                        {/* Language Toggle */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Languages size={20} className="text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Writing Language:</span>
                                </div>
                                <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentLanguage('en')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                            currentLanguage === 'en'
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        English
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentLanguage('bn')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all font-bengali ${
                                            currentLanguage === 'bn'
                                                ? 'bg-green-600 text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        বাংলা
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                {currentLanguage === 'en' 
                                    ? 'You are currently writing in English. Switch to Bengali to add translated content.'
                                    : 'আপনি বর্তমানে বাংলায় লিখছেন। ইংরেজি কন্টেন্ট যোগ করতে English এ পরিবর্তন করুন।'
                                }
                            </p>
                        </div>

                        {/* Title and Description fields based on current language */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                {currentLanguage === 'en' ? 'English Content' : 'বাংলা কন্টেন্ট'}
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {currentLanguage === 'en' ? 'Title' : 'শিরোনাম'}
                                    </label>
                                    <input
                                        type="text"
                                        value={getLanguageFieldValue('title')}
                                        onChange={(e) => updateLanguageField('title', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent ${
                                            currentLanguage === 'bn' ? "font-bengali" : ''
                                        }`}
                                        placeholder={currentLanguage === 'en' ? 'Enter guide title...' : 'গাইড শিরোনাম লিখুন...'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {currentLanguage === 'en' ? 'Description' : 'বর্ণনা'}
                                    </label>
                                    <textarea
                                        value={getLanguageFieldValue('description')}
                                        onChange={(e) => updateLanguageField('description', e.target.value)}
                                        rows={2}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent ${
                                            currentLanguage === 'bn' ? "font-bengali" : ''
                                        }`}
                                        placeholder={currentLanguage === 'en' ? 'Enter guide description...' : 'গাইড বর্ণনা লিখুন...'}
                                    />
                                </div>
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
                                    onClick={() => insertTemplate(templates.tips)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-100 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors"
                                >
                                    <Lightbulb size={16} />
                                    Tips Block
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTemplate(templates.notes)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <Info size={16} />
                                    Notes Block
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
                                    onClick={() => insertTemplate(templates.timelineTips)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                                    title="Add tips section inside a timeline step"
                                >
                                    <Lightbulb size={16} />
                                    Timeline Tips
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTemplate(templates.timelineNotes)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Add notes section inside a timeline step"
                                >
                                    <Info size={16} />
                                    Timeline Notes
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
                                    onClick={() => currentLanguage === 'en' ? setContentText(sampleContent) : setContentTextBn(sampleContent)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                                >
                                    Load Sample
                                </button>
                            </div>
                        </div>

                        {/* Table Paste Detection Modal */}
                        {tablePasteDetected && (
                            <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <ClipboardPaste className="text-green-600" size={20} />
                                        <h4 className="font-semibold text-green-900">Table Detected!</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-green-800 mb-3">
                                    We detected a table in your paste. Would you like to insert it as a table block?
                                </p>
                                <div className="bg-white p-3 rounded border border-green-200 mb-3 max-h-40 overflow-auto">
                                    <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                        {pastedTablePreview}
                                    </pre>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={confirmTablePaste}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        Insert Table
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelTablePaste}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

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
                                        <p className="font-medium mb-1">� Tips Block:</p>
                                        <p className="ml-4">Highlight important travel advice, recommendations, and insider tips. Displays with eye-catching amber styling and numbered tips.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">�🗺️ Timeline Block:</p>
                                        <p className="ml-4">Create step-by-step itineraries with routes and details. Perfect for travel schedules. You can also add tips within timeline steps!</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">🖼️ Image Block:</p>
                                        <p className="ml-4">Insert single images with captions throughout your guide.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">🎨 Gallery Block:</p>
                                        <p className="ml-4">Create photo galleries with multiple images in a grid layout.</p>
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">📊 Table Block:</p>
                                        <p className="ml-4">Create tables for pricing, comparisons, schedules, etc.</p>
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
                                    {currentLanguage === 'en' ? 'Content Editor (English)' : 'কন্টেন্ট এডিটর (বাংলা)'}
                                </label>
                                <div className="relative">
                                    {/* Line numbers overlay */}
                                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 border-r border-gray-300 rounded-l-lg overflow-hidden pointer-events-none z-10">
                                        <div className="pt-2 pb-2 text-right pr-2 font-mono text-xs text-gray-500" style={{ lineHeight: '24px' }}>
                                            {(currentLanguage === 'en' ? contentText : contentTextBn).split('\n').map((_, i) => (
                                                <div key={i} style={{ height: '24px' }}>{i + 1}</div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Textarea with padding for line numbers */}
                                    <textarea
                                        ref={textareaRef}
                                        id="content-editor"
                                        value={currentLanguage === 'en' ? contentText : contentTextBn}
                                        onChange={(e) => currentLanguage === 'en' ? setContentText(e.target.value) : setContentTextBn(e.target.value)}
                                        onPaste={handlePaste}
                                        onScroll={(e) => {
                                            const lineNumbers = e.currentTarget.previousElementSibling;
                                            if (lineNumbers) {
                                                const firstChild = lineNumbers.firstElementChild as HTMLElement;
                                                if (firstChild) {
                                                    firstChild.style.marginTop = `-${e.currentTarget.scrollTop}px`;
                                                }
                                            }
                                        }}
                                        rows={20}
                                        className={`w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent font-mono text-sm ${
                                            currentLanguage === 'bn' ? "font-bengali" : ''
                                        }`}
                                        style={{
                                            backgroundImage: `repeating-linear-gradient(
                                                transparent,
                                                transparent 23px,
                                                #e5e7eb 23px,
                                                #e5e7eb 24px
                                            )`,
                                            backgroundSize: '100% 24px',
                                            lineHeight: '24px'
                                        }}
                                        placeholder={currentLanguage === 'en' 
                                            ? 'Start typing or use Quick Insert buttons above...' 
                                            : 'লেখা শুরু করুন বা উপরের Quick Insert বাটন ব্যবহার করুন...'
                                        }
                                    />
                                </div>

                                {/* Syntax Legend */}
                                <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-xs">
                                        <FileText size={14} />
                                        Syntax Guide
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <code className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">:::type</code>
                                            <span className="text-gray-600">Block start</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">:::</code>
                                            <span className="text-gray-600">Block end</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono">[key="val"]</code>
                                            <span className="text-gray-600">Attributes</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-mono">##</code>
                                            <span className="text-gray-600">Heading/Step</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Errors */}
                                {currentLanguage === 'en' && contentErrors.length > 0 && (
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

                                {/* Block Structure Overview */}
                                {getCurrentContent() && getCurrentContent()!.length > 0 && (
                                    <div className="mt-3 p-3 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-purple-900 font-semibold mb-2 text-sm">
                                            <Layout size={16} />
                                            Block Structure ({getCurrentContent()!.length} blocks)
                                        </div>
                                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                            {getCurrentContent()!.map((block, index) => {
                                                const blockIcons: Record<string, string> = {
                                                    text: '📝',
                                                    timeline: '🗺️',
                                                    image: '🖼️',
                                                    imageGallery: '🎨',
                                                    table: '📊',
                                                    tips: '💡',
                                                    notes: 'ℹ️'
                                                };
                                                const blockColors: Record<string, string> = {
                                                    text: 'bg-blue-100 border-blue-300 text-blue-800',
                                                    timeline: 'bg-green-100 border-green-300 text-green-800',
                                                    image: 'bg-purple-100 border-purple-300 text-purple-800',
                                                    imageGallery: 'bg-pink-100 border-pink-300 text-pink-800',
                                                    table: 'bg-indigo-100 border-indigo-300 text-indigo-800',
                                                    tips: 'bg-amber-100 border-amber-300 text-amber-800',
                                                    notes: 'bg-blue-100 border-blue-300 text-blue-800'
                                                };
                                                const icon = blockIcons[block.type] || '📄';
                                                const colorClass = blockColors[block.type] || 'bg-gray-100 border-gray-300 text-gray-800';
                                                
                                                // Get block title/preview
                                                let blockTitle = '';
                                                if (block.type === 'text' && (block as TextBlock).heading) {
                                                    blockTitle = (block as TextBlock).heading!;
                                                } else if (block.type === 'timeline' && (block as TimelineBlock).title) {
                                                    blockTitle = (block as TimelineBlock).title!;
                                                } else if (block.type === 'tips' && (block as TipsBlock).title) {
                                                    blockTitle = (block as TipsBlock).title!;
                                                } else if (block.type === 'notes' && (block as NotesBlock).title) {
                                                    blockTitle = (block as NotesBlock).title!;
                                                } else if (block.type === 'imageGallery' && (block as ImageGalleryBlock).title) {
                                                    blockTitle = (block as ImageGalleryBlock).title!;
                                                } else if (block.type === 'table') {
                                                    const tableBlock = block as TableBlock;
                                                    blockTitle = tableBlock.title || `${tableBlock.headers.length} columns`;
                                                } else if (block.type === 'image') {
                                                    blockTitle = (block as ImageBlock).caption || 'Image';
                                                } else {
                                                    blockTitle = block.type.charAt(0).toUpperCase() + block.type.slice(1);
                                                }
                                                
                                                const lineNumber = findBlockLineNumber(index);
                                                
                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => scrollToLine(lineNumber)}
                                                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded border ${colorClass} text-xs font-medium hover:shadow-md transition-all cursor-pointer w-full text-left hover:scale-[1.02]`}
                                                        title={`Click to jump to line ${lineNumber}`}
                                                    >
                                                        <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold border border-current">
                                                            {index + 1}
                                                        </span>
                                                        <span className="flex-shrink-0">{icon}</span>
                                                        <span className="font-semibold uppercase text-[10px]">{block.type}</span>
                                                        <span className="flex-1 truncate opacity-75">{blockTitle}</span>
                                                        <span className="text-[10px] opacity-50">L{lineNumber}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Stats */}
                                {currentLanguage === 'en' && formData.content && formData.content.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
                                        <span>📦 {formData.content.length} block{formData.content.length !== 1 ? 's' : ''}</span>
                                        <span>📝 {countBlocksByType('text')} text</span>
                                        <span>🗺️ {countBlocksByType('timeline')} timeline</span>
                                        <span>🖼️ {countBlocksByType('image')} image</span>
                                        <span>🎨 {countBlocksByType('imageGallery')} gallery</span>
                                        <span>📊 {countBlocksByType('table')} table</span>
                                        <span>💡 {countBlocksByType('tips')} tips</span>
                                    </div>
                                )}
                                {currentLanguage === 'bn' && formData.contentBn && formData.contentBn.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4 font-bengali">
                                        <span>📦 {formData.contentBn.length} ব্লক</span>
                                        <span>📝 {countBlocksByType('text')} টেক্সট</span>
                                        <span>🗺️ {countBlocksByType('timeline')} টাইমলাইন</span>
                                        <span>🖼️ {countBlocksByType('image')} ছবি</span>
                                        <span>🎨 {countBlocksByType('imageGallery')} গ্যালারি</span>
                                        <span>📊 {countBlocksByType('table')} টেবিল</span>
                                        <span>💡 {countBlocksByType('tips')} টিপস</span>
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {currentLanguage === 'en' ? 'Live Preview (English)' : 'লাইভ প্রিভিউ (বাংলা)'}
                                    </label>
                                    <div className={`border border-gray-300 rounded-lg p-6 bg-[#f2eee9] max-h-[600px] overflow-y-auto ${
                                        currentLanguage === 'bn' ? "font-bengali" : ''
                                    }`}>
                                        {getCurrentContent() && getCurrentContent()!.length > 0 ? (
                                            <ContentRenderer blocks={getCurrentContent()!} />
                                        ) : (
                                            <div className="text-gray-500 text-center py-8">
                                                {currentLanguage === 'en' 
                                                    ? 'No content to preview. Start adding blocks on the left.'
                                                    : 'প্রিভিউ করার জন্য কোনো কন্টেন্ট নেই। বামে ব্লক যোগ করা শুরু করুন।'
                                                }
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
                    onInsert={insertTemplate}
                    onClose={() => setShowTableEditor(false)}
                />
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

export default EnhancedGuideForm;
