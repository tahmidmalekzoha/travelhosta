/**
 * GuideContentEditor component
 * Large component handling all content editing functionality with templates, paste detection, help, etc.
 */

import { FunctionComponent, useState } from 'react';
import { Language, ContentBlock, TextBlock, TimelineBlock, ImageBlock, ImageGalleryBlock, TableBlock, TipsBlock, NotesBlock } from '../../types';
import { sampleContent } from '../../utils/contentParser';
import { Eye, EyeOff, AlertCircle, FileText, Image, Layout, Calendar, Table, ClipboardPaste, Lightbulb, Languages, Info } from 'lucide-react';
import { previewTableFromClipboard } from '../../utils/tablePasteHandler';
import ContentRenderer from '../ContentRenderer';

interface GuideContentEditorProps {
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
    contentText: string;
    contentTextBn: string;
    onContentTextChange: (text: string) => void;
    onContentTextBnChange: (text: string) => void;
    contentErrors: string[];
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    onTitleChange: (title: string, lang: Language) => void;
    onDescriptionChange: (desc: string, lang: Language) => void;
    content?: ContentBlock[];
    contentBn?: ContentBlock[];
    onInsertTemplate: (template: string) => void;
    onTableEditorOpen: () => void;
    countBlocksByType: (type: string, content?: ContentBlock[]) => number;
    findBlockLineNumber: (index: number) => number;
    scrollToLine: (line: number) => void;
}

const GuideContentEditor: FunctionComponent<GuideContentEditorProps> = ({
    currentLanguage,
    onLanguageChange,
    contentText,
    contentTextBn,
    onContentTextChange,
    onContentTextBnChange,
    contentErrors,
    textareaRef,
    title,
    titleBn,
    description,
    descriptionBn,
    onTitleChange,
    onDescriptionChange,
    content,
    contentBn,
    onInsertTemplate,
    onTableEditorOpen,
    countBlocksByType,
    findBlockLineNumber,
    scrollToLine
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [tablePasteDetected, setTablePasteDetected] = useState(false);
    const [pastedTablePreview, setPastedTablePreview] = useState('');

    const getCurrentContent = () => currentLanguage === 'en' ? content : contentBn;
    const getCurrentText = () => currentLanguage === 'en' ? contentText : contentTextBn;
    const setCurrentText = (text: string) => currentLanguage === 'en' ? onContentTextChange(text) : onContentTextBnChange(text);

    /**
     * Handles paste events to detect and format table data
     */
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardData = e.clipboardData;
        if (!clipboardData) return;

        const htmlData = clipboardData.getData('text/html');
        const textData = clipboardData.getData('text/plain');

        const hasTableIndicators = 
            (htmlData && htmlData.includes('<table')) ||
            (textData && (textData.includes('\t') || textData.includes('|')));
        
        if (!hasTableIndicators) return;

        const pastedContent = htmlData || textData;
        const result = previewTableFromClipboard(pastedContent);
        
        if (result.success && result.preview) {
            e.preventDefault();
            setPastedTablePreview(result.preview);
            setTablePasteDetected(true);
        }
    };

    const confirmTablePaste = () => {
        if (pastedTablePreview) {
            onInsertTemplate(pastedTablePreview);
            setTablePasteDetected(false);
            setPastedTablePreview('');
        }
    };

    const cancelTablePaste = () => {
        setTablePasteDetected(false);
        setPastedTablePreview('');
    };

    // Content block templates
    const templates = {
        text: `:::text [heading="Section Title"]
Write your content here. You can use **bold** and *italic* text.

Add multiple paragraphs as needed.
:::`,
        tips: `:::tips
- Always carry sufficient cash as many places don't accept cards
- Book train/bus tickets at least 2-3 days in advance
- Download offline maps before the journey
:::`,
        notes: `:::notes
- Entry times may vary by season - check before visiting
- Some locations require advance booking
- Photography restrictions may apply in certain areas
:::`,
        timeline: `:::timeline [title="Day 1: Journey"]
Location A to Location B
- Transportation: Cost
- Duration: Time
- Notes: Additional info
:::`,
        timelineTips: `[tips]
- Tip for this step
- Another tip
[/tips]`,
        timelineNotes: `[notes]
- Note for this step
- Another note
[/notes]`,
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
:::`,
        table: `:::table [title="Price Comparison" caption="All prices in Taka"]
Item | Budget | Mid-Range | Luxury
---
Hotel | 800 | 3000 | 8000
Food | 300 | 600 | 1500
:::`
    };

    return (
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
                            onClick={() => onLanguageChange('en')}
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
                            onClick={() => onLanguageChange('bn')}
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
                            value={currentLanguage === 'en' ? title : titleBn}
                            onChange={(e) => onTitleChange(e.target.value, currentLanguage)}
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
                            value={currentLanguage === 'en' ? description : descriptionBn}
                            onChange={(e) => onDescriptionChange(e.target.value, currentLanguage)}
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
                    <button type="button" onClick={() => onInsertTemplate(templates.text)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText size={16} />Text Block
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.tips)} className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-100 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors">
                        <Lightbulb size={16} />Tips Block
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.notes)} className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors">
                        <Info size={16} />Notes Block
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.timeline)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Calendar size={16} />Timeline
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.timelineTips)} className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors" title="Add tips section inside a timeline step">
                        <Lightbulb size={16} />Timeline Tips
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.timelineNotes)} className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" title="Add notes section inside a timeline step">
                        <Info size={16} />Timeline Notes
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.image)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Image size={16} />Single Image
                    </button>
                    <button type="button" onClick={() => onInsertTemplate(templates.gallery)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Layout size={16} />Image Gallery
                    </button>
                    <button type="button" onClick={onTableEditorOpen} className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Table size={16} />Table (Visual Editor)
                    </button>
                    <button type="button" onClick={() => setCurrentText(sampleContent)} className="flex items-center gap-2 px-3 py-2 text-sm bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors">
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
                        <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">{pastedTablePreview}</pre>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={confirmTablePaste} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Insert Table
                        </button>
                        <button type="button" onClick={cancelTablePaste} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
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
                        <div><p className="font-medium mb-1">📝 Text Block:</p><p className="ml-4">Add paragraphs, descriptions, or any narrative content. Supports **bold** and *italic* formatting.</p></div>
                        <div><p className="font-medium mb-1">💡 Tips Block:</p><p className="ml-4">Highlight important travel advice, recommendations, and insider tips. Displays with eye-catching amber styling and numbered tips.</p></div>
                        <div><p className="font-medium mb-1">🗺️ Timeline Block:</p><p className="ml-4">Create step-by-step itineraries with routes and details. Perfect for travel schedules. You can also add tips within timeline steps!</p></div>
                        <div><p className="font-medium mb-1">🖼️ Image Block:</p><p className="ml-4">Insert single images with captions throughout your guide.</p></div>
                        <div><p className="font-medium mb-1">🎨 Gallery Block:</p><p className="ml-4">Create photo galleries with multiple images in a grid layout.</p></div>
                        <div><p className="font-medium mb-1">📊 Table Block:</p><p className="ml-4">Create tables for pricing, comparisons, schedules, etc.</p></div>
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
                {/* Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentLanguage === 'en' ? 'Content Editor (English)' : 'কন্টেন্ট এডিটর (বাংলা)'}
                    </label>
                    <div className="relative">
                        {/* Line numbers overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 border-r border-gray-300 rounded-l-lg overflow-hidden pointer-events-none z-10">
                            <div className="pt-2 pb-2 text-right pr-2 font-mono text-xs text-gray-500" style={{ lineHeight: '24px' }}>
                                {getCurrentText().split('\n').map((_, i) => (
                                    <div key={i} style={{ height: '24px' }}>{i + 1}</div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Textarea with padding for line numbers */}
                        <textarea
                            ref={textareaRef}
                            id="content-editor"
                            value={getCurrentText()}
                            onChange={(e) => setCurrentText(e.target.value)}
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
                                backgroundImage: `repeating-linear-gradient(transparent,transparent 23px,#e5e7eb 23px,#e5e7eb 24px)`,
                                backgroundSize: '100% 24px',
                                lineHeight: '24px'
                            }}
                            placeholder={currentLanguage === 'en' ? 'Start typing or use Quick Insert buttons above...' : 'লেখা শুরু করুন বা উপরের Quick Insert বাটন ব্যবহার করুন...'}
                        />
                    </div>

                    {/* Syntax Legend */}
                    <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-xs">
                            <FileText size={14} />Syntax Guide
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
                                <AlertCircle size={16} />Content Errors:
                            </div>
                            <ul className="text-sm text-red-700 space-y-1">
                                {contentErrors.map((error, index) => (<li key={index}>• {error}</li>))}
                            </ul>
                        </div>
                    )}

                    {/* Block Structure Overview */}
                    {getCurrentContent() && getCurrentContent()!.length > 0 && (
                        <div className="mt-3 p-3 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-900 font-semibold mb-2 text-sm">
                                <Layout size={16} />Block Structure ({getCurrentContent()!.length} blocks)
                            </div>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                {getCurrentContent()!.map((block, index) => {
                                    const blockIcons: Record<string, string> = {
                                        text: '📝', timeline: '🗺️', image: '🖼️', imageGallery: '🎨', table: '📊', tips: '💡', notes: 'ℹ️'
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
                    {currentLanguage === 'en' && content && content.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
                            <span>📦 {content.length} block{content.length !== 1 ? 's' : ''}</span>
                            <span>📝 {countBlocksByType('text', content)} text</span>
                            <span>🗺️ {countBlocksByType('timeline', content)} timeline</span>
                            <span>🖼️ {countBlocksByType('image', content)} image</span>
                            <span>🎨 {countBlocksByType('imageGallery', content)} gallery</span>
                            <span>📊 {countBlocksByType('table', content)} table</span>
                            <span>💡 {countBlocksByType('tips', content)} tips</span>
                        </div>
                    )}
                    {currentLanguage === 'bn' && contentBn && contentBn.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4 font-bengali">
                            <span>📦 {contentBn.length} ব্লক</span>
                            <span>📝 {countBlocksByType('text', contentBn)} টেক্সট</span>
                            <span>🗺️ {countBlocksByType('timeline', contentBn)} টাইমলাইন</span>
                            <span>🖼️ {countBlocksByType('image', contentBn)} ছবি</span>
                            <span>🎨 {countBlocksByType('imageGallery', contentBn)} গ্যালারি</span>
                            <span>📊 {countBlocksByType('table', contentBn)} টেবিল</span>
                            <span>💡 {countBlocksByType('tips', contentBn)} টিপস</span>
                        </div>
                    )}
                </div>

                {/* Preview - Import from GuidePreview component */}
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
    );
};

export default GuideContentEditor;
