import React, { FunctionComponent } from 'react';
import { ContentBlock, TextBlock, TimelineBlock, ImageBlock, ImageGalleryBlock, TableBlock, TipsBlock } from '../types';
import Timeline from './Timeline';
import ImagePlaceholder from './shared/ImagePlaceholder';
import { Lightbulb } from 'lucide-react';
import { isValidImageUrl, getImageAltText } from '../utils/imageUtils';

interface ContentRendererProps {
    blocks: ContentBlock[];
}

/**
 * Renders flexible content blocks in order
 * Supports: text, timeline, images, galleries, tables, and tips
 */
const ContentRenderer: FunctionComponent<ContentRendererProps> = ({ blocks }) => {
    return (
        <div className="space-y-12">
            {blocks.map((block) => {
                switch (block.type) {
                    case 'text':
                        return <TextBlockRenderer key={block.id} block={block} />;
                    case 'timeline':
                        return <TimelineBlockRenderer key={block.id} block={block} />;
                    case 'image':
                        return <ImageBlockRenderer key={block.id} block={block} />;
                    case 'imageGallery':
                        return <ImageGalleryRenderer key={block.id} block={block} />;
                    case 'table':
                        return <TableBlockRenderer key={block.id} block={block} />;
                    case 'tips':
                        return <TipsBlockRenderer key={block.id} block={block} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

/**
 * Formats markdown text to HTML with basic styling
 * Supports: **bold**, *italic*
 */
const formatMarkdownText = (text: string): React.ReactElement[] => {
    return text
        .split('\n\n')
        .map((paragraph, i) => {
            // Apply bold formatting
            let formatted = paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // Apply italic formatting
            formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            
            return (
                <p 
                    key={i} 
                    className="text-lg text-gray-700 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: formatted }}
                />
            );
        });
};

/**
 * Renders a text block with optional heading
 */
const TextBlockRenderer: FunctionComponent<{ block: TextBlock }> = ({ block }) => {
    return (
        <div className="max-w-4xl mx-auto">
            {block.heading && (
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1b3c44]">
                    {block.heading}
                </h2>
            )}
            <div className="prose prose-lg max-w-none">
                {formatMarkdownText(block.content)}
            </div>
        </div>
    );
};

/**
 * Renders a tips block with highlighted styling
 */
const TipsBlockRenderer: FunctionComponent<{ block: TipsBlock }> = ({ block }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-amber-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                        <Lightbulb className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-amber-900">
                        {block.title || 'Pro Tips'}
                    </h3>
                </div>
                
                <div className="space-y-3">
                    {block.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors">
                            <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                                {index + 1}
                            </div>
                            <p className="text-gray-800 text-base leading-relaxed flex-grow">
                                {tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Renders a timeline block with optional title
 */
const TimelineBlockRenderer: FunctionComponent<{ block: TimelineBlock }> = ({ block }) => {
    return (
        <div className="max-w-4xl mx-auto">
            {block.title && (
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1b3c44]">
                        {block.title}
                    </h2>
                </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <Timeline steps={block.steps} />
            </div>
        </div>
    );
};

/**
 * Renders a single image with caption
 */
const ImageBlockRenderer: FunctionComponent<{ block: ImageBlock }> = ({ block }) => {
    const hasValidUrl = isValidImageUrl(block.url);
    const altText = getImageAltText(block.alt, block.caption, 'Guide image');
    
    return (
        <div className="max-w-4xl mx-auto">
            <figure className="rounded-2xl overflow-hidden shadow-lg">
                {hasValidUrl ? (
                    <img
                        src={block.url}
                        alt={altText}
                        className="w-full h-auto object-cover"
                    />
                ) : (
                    <ImagePlaceholder text="No Image URL" size="medium" />
                )}
                {block.caption && (
                    <figcaption className="bg-white px-6 py-4 text-center text-gray-600 italic">
                        {block.caption}
                    </figcaption>
                )}
            </figure>
        </div>
    );
};

/**
 * Renders an image gallery with grid layout
 */
const ImageGalleryRenderer: FunctionComponent<{ block: ImageGalleryBlock }> = ({ block }) => {
    return (
        <div className="max-w-6xl mx-auto">
            {block.title && (
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#1b3c44]">
                    {block.title}
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {block.images.map((image: { url: string; caption?: string; alt?: string }, index: number) => {
                    const hasValidUrl = isValidImageUrl(image.url);
                    const altText = getImageAltText(image.alt, image.caption, `Gallery image ${index + 1}`);
                    
                    return (
                        <figure key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            {hasValidUrl ? (
                                <img
                                    src={image.url}
                                    alt={altText}
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <ImagePlaceholder text="No Image" size="small" />
                            )}
                            {image.caption && (
                                <figcaption className="bg-white px-4 py-3 text-sm text-gray-600 text-center">
                                    {image.caption}
                                </figcaption>
                            )}
                        </figure>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Renders a table block
 */
const TableBlockRenderer: FunctionComponent<{ block: TableBlock }> = ({ block }) => {
    return (
        <div className="max-w-5xl mx-auto">
            {block.title && (
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#1b3c44]">
                    {block.title}
                </h2>
            )}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#1b3c44] text-white">
                            {block.headers.map((header, index) => (
                                <th 
                                    key={index}
                                    className="px-6 py-4 text-left font-semibold border-r border-[#2d5560] last:border-r-0"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {block.rows.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex}
                                className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#f2eee9] transition-colors`}
                            >
                                {row.map((cell, cellIndex) => (
                                    <td 
                                        key={cellIndex}
                                        className="px-6 py-4 border-r border-gray-200 last:border-r-0 text-gray-700"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {block.caption && (
                <p className="text-center text-sm text-gray-600 italic mt-3">
                    {block.caption}
                </p>
            )}
        </div>
    );
};

export default ContentRenderer;
