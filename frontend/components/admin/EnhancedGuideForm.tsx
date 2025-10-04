import { FunctionComponent, useState, useEffect, useRef } from 'react';
import { GuideData, ContentBlock, Language } from '../../types';
import { parseGuideContent, contentToText, validateContent, sampleContent } from '../../utils/contentParser';
import ContentRenderer from '../ContentRenderer';
import TableEditor from './TableEditor';
import Toast, { ToastType } from '../shared/Toast';
import { Eye, EyeOff, AlertCircle, FileText, Image, Layout, Calendar, Table, ClipboardPaste, Lightbulb, Languages } from 'lucide-react';
import { handleTablePaste, previewTableFromClipboard } from '../../utils/tablePasteHandler';

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

    const [contentText, setContentText] = useState('');
    const [contentTextBn, setContentTextBn] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [contentErrors, setContentErrors] = useState<string[]>([]);
    const [showHelp, setShowHelp] = useState(false);
    const [showTableEditor, setShowTableEditor] = useState(false);
    const [tablePasteDetected, setTablePasteDetected] = useState(false);
    const [pastedTablePreview, setPastedTablePreview] = useState<string>('');
    const [tagInput, setTagInput] = useState('');
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initialize content text from existing guide
    useEffect(() => {
        if (guide?.content) {
            setContentText(contentToText(guide.content));
        }
        if (guide?.contentBn) {
            setContentTextBn(contentToText(guide.contentBn));
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

    const insertTemplate = (template: string) => {
        if (currentLanguage === 'en') {
            const cursorPos = textareaRef.current?.selectionStart || contentText.length;
            const before = contentText.substring(0, cursorPos);
            const after = contentText.substring(cursorPos);
            setContentText(before + '\n\n' + template + '\n\n' + after);
        } else {
            const cursorPos = textareaRef.current?.selectionStart || contentTextBn.length;
            const before = contentTextBn.substring(0, cursorPos);
            const after = contentTextBn.substring(cursorPos);
            setContentTextBn(before + '\n\n' + template + '\n\n' + after);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        // Try to detect and parse table
        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');

        // Only try to parse as table if content has clear table indicators
        // Check for: HTML table tags, tabs (TSV), or pipe separators (Markdown)
        const hasTableIndicators = 
            (htmlData && htmlData.includes('<table')) ||
            (textData && (textData.includes('\t') || textData.includes('|')));
        
        if (!hasTableIndicators) {
            // Not a table, let default paste behavior happen
            return;
        }

        // Check if it looks like a table
        let pastedContent = htmlData || textData;
        
        if (pastedContent) {
            const result = previewTableFromClipboard(pastedContent);
            
            if (result.success && result.preview) {
                // Prevent default paste
                e.preventDefault();
                
                // Show preview
                setPastedTablePreview(result.preview);
                setTablePasteDetected(true);
            }
        }
    };

    const confirmTablePaste = () => {
        if (pastedTablePreview) {
            insertTemplate(pastedTablePreview);
            setTablePasteDetected(false);
            setPastedTablePreview('');
        }
    };

    const cancelTablePaste = () => {
        setTablePasteDetected(false);
        setPastedTablePreview('');
    };

    const templates = {
        text: `:::text [heading="Section Title"]
Write your content here. You can use **bold** and *italic* text.

Add multiple paragraphs as needed.
:::`,
        tips: `:::tips [title="Pro Tips"]
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
- Keep emergency contact numbers handy
- Pack light but bring layers for changing weather
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
        timelineTips: `[tips]
- Tip for this step
- Another tip
[/tips]`,
        timelineWithTips: `:::timeline [title="Day 1: Getting There"]
## Dhaka to Sylhet
- Train: 395 Taka
- Journey time: 6 hours
- Departure: 6:30 AM
[tips]
- Book window seats for scenic views
- Carry snacks and water bottles
- Keep ticket accessible for checks
[/tips]

## Sylhet Railway Station to Hotel
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
                    {/* Basic Info - Shared fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    {/* Tags Section */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (for filtering)
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const trimmedTag = tagInput.trim();
                                        if (trimmedTag && !(formData.tags || []).includes(trimmedTag)) {
                                            setFormData(prev => ({ 
                                                ...prev, 
                                                tags: [...(prev.tags || []), trimmedTag] 
                                            }));
                                            setTagInput('');
                                        }
                                    }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                placeholder="Type a tag and press Enter (e.g., Adventure, Budget, Family-Friendly)"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const trimmedTag = tagInput.trim();
                                    if (trimmedTag && !(formData.tags || []).includes(trimmedTag)) {
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            tags: [...(prev.tags || []), trimmedTag] 
                                        }));
                                        setTagInput('');
                                    }
                                }}
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
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    tags: prev.tags?.filter((_, i) => i !== index) || []
                                                }));
                                            }}
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
                            Add tags to help users filter guides by theme, budget, activity type, etc.
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
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all font-['Bengali'] ${
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
                                        value={currentLanguage === 'en' ? formData.title : formData.titleBn}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            [currentLanguage === 'en' ? 'title' : 'titleBn']: e.target.value 
                                        }))}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent ${
                                            currentLanguage === 'bn' ? "font-['Bengali']" : ''
                                        }`}
                                        placeholder={currentLanguage === 'en' ? 'Enter guide title...' : 'গাইড শিরোনাম লিখুন...'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {currentLanguage === 'en' ? 'Description' : 'বর্ণনা'}
                                    </label>
                                    <textarea
                                        value={currentLanguage === 'en' ? formData.description : formData.descriptionBn}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            [currentLanguage === 'en' ? 'description' : 'descriptionBn']: e.target.value 
                                        }))}
                                        rows={2}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent ${
                                            currentLanguage === 'bn' ? "font-['Bengali']" : ''
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
                                <textarea
                                    ref={textareaRef}
                                    id="content-editor"
                                    value={currentLanguage === 'en' ? contentText : contentTextBn}
                                    onChange={(e) => currentLanguage === 'en' ? setContentText(e.target.value) : setContentTextBn(e.target.value)}
                                    onPaste={handlePaste}
                                    rows={20}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent font-mono text-sm ${
                                        currentLanguage === 'bn' ? "font-['Bengali']" : ''
                                    }`}
                                    placeholder={currentLanguage === 'en' 
                                        ? 'Start typing or use Quick Insert buttons above...' 
                                        : 'লেখা শুরু করুন বা উপরের Quick Insert বাটন ব্যবহার করুন...'
                                    }
                                />

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

                                {/* Stats */}
                                {currentLanguage === 'en' && formData.content && formData.content.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
                                        <span>📦 {formData.content.length} block{formData.content.length !== 1 ? 's' : ''}</span>
                                        <span>📝 {formData.content.filter(b => b.type === 'text').length} text</span>
                                        <span>🗺️ {formData.content.filter(b => b.type === 'timeline').length} timeline</span>
                                        <span>🖼️ {formData.content.filter(b => b.type === 'image').length} image</span>
                                        <span>🎨 {formData.content.filter(b => b.type === 'imageGallery').length} gallery</span>
                                        <span>📊 {formData.content.filter(b => b.type === 'table').length} table</span>
                                        <span>💡 {formData.content.filter(b => b.type === 'tips').length} tips</span>
                                    </div>
                                )}
                                {currentLanguage === 'bn' && formData.contentBn && formData.contentBn.length > 0 && (
                                    <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4 font-['Bengali']">
                                        <span>📦 {formData.contentBn.length} ব্লক</span>
                                        <span>📝 {formData.contentBn.filter(b => b.type === 'text').length} টেক্সট</span>
                                        <span>🗺️ {formData.contentBn.filter(b => b.type === 'timeline').length} টাইমলাইন</span>
                                        <span>🖼️ {formData.contentBn.filter(b => b.type === 'image').length} ছবি</span>
                                        <span>🎨 {formData.contentBn.filter(b => b.type === 'imageGallery').length} গ্যালারি</span>
                                        <span>📊 {formData.contentBn.filter(b => b.type === 'table').length} টেবিল</span>
                                        <span>💡 {formData.contentBn.filter(b => b.type === 'tips').length} টিপস</span>
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
                                        currentLanguage === 'bn' ? "font-['Bengali']" : ''
                                    }`}>
                                        {currentLanguage === 'en' && formData.content && formData.content.length > 0 ? (
                                            <ContentRenderer blocks={formData.content} />
                                        ) : currentLanguage === 'bn' && formData.contentBn && formData.contentBn.length > 0 ? (
                                            <ContentRenderer blocks={formData.contentBn} />
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
                    onInsert={handleTableInsert}
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
