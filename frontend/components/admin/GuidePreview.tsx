/**
 * GuidePreview component
 * Displays live preview of guide content
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
            <div className={`border border-gray-300 rounded-lg p-6 bg-[#f2eee9] max-h-[600px] overflow-y-auto ${
                currentLanguage === 'bn' ? "font-bengali" : ''
            }`}>
                {content && content.length > 0 ? (
                    <ContentRenderer blocks={content} />
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
    );
};

export default GuidePreview;
