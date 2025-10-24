/**
 * GuidePreview component
 * Displays live preview of guide content matching the actual guide detail page design
 */

import { FunctionComponent } from 'react';
import { ContentBlock, Language } from '../../types';
import ContentRenderer from '../ContentRenderer';

interface GuidePreviewProps {
    content: ContentBlock[] | undefined;
    currentLanguage: Language;
    show: boolean;
}

const GuidePreview: FunctionComponent<GuidePreviewProps> = ({
    content,
    currentLanguage,
    show
}) => {
    if (!show) return null;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentLanguage === 'en' ? 'Live Preview (English)' : 'লাইভ প্রিভিউ (বাংলা)'}
            </label>
            {/* Dark theme background matching the guide detail page */}
            <div 
                className={`bg-[#1b3c44] rounded-[40px] shadow-[0px_6px_72.8px_-32px_rgba(0,0,0,0.25)] px-6 lg:px-12 py-8 lg:py-10 max-h-[600px] overflow-y-auto ${
                    currentLanguage === 'bn' ? "font-bengali" : ''
                }`}
                style={{ backgroundColor: '#1b3c44' }} // Explicit inline style as backup
            >
                {content && content.length > 0 ? (
                    <ContentRenderer blocks={content} theme="dark" />
                ) : (
                    <div className="text-[#f2eee9]/70 text-center py-8">
                        <p className="font-['Schibsted_Grotesk'] text-lg">
                            {currentLanguage === 'en' 
                                ? 'No content to preview. Start adding blocks on the left.'
                                : 'প্রিভিউ করার জন্য কোনো কন্টেন্ট নেই। বামে ব্লক যোগ করা শুরু করুন।'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuidePreview;
