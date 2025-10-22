import React, { FunctionComponent, memo } from 'react';
import {
    ContentBlock,
    TextBlock,
    TimelineBlock,
    ImageBlock,
    ImageGalleryBlock,
    TableBlock,
    TipsBlock,
    NotesBlock,
    ProsConsBlock
} from '../types';
import Timeline from './Timeline';
import ImagePlaceholder from './shared/ImagePlaceholder';
import { Lightbulb, Info, ThumbsUp, ThumbsDown } from 'lucide-react';
import { isValidImageUrl, getImageAltText } from '../utils/imageUtils';
import { sanitizeMarkdown } from '../utils/sanitization';

type ContentTheme = 'light' | 'dark';

interface ContentRendererProps {
    blocks: ContentBlock[];
    theme?: ContentTheme;
}

const typographyClasses: Record<ContentTheme, { paragraph: string; heading: string }> = {
    light: {
        paragraph: 'text-[18px] sm:text-[20px] leading-[1.75] tracking-[0.01em] text-[#1b3c44]/80',
        heading: 'text-[#1b3c44]'
    },
    dark: {
        paragraph: 'font-[\'Schibsted_Grotesk\'] font-normal text-[50.37px] leading-[normal] text-white',
        heading: 'text-[#f2eee9]'
    }
};

const tipClasses: Record<ContentTheme, { wrapper: string; icon: string; text: string; title: string }> = {
    light: {
        wrapper: 'bg-[#fff7e8] border border-[#f5c77d]/80 px-8 py-6 rounded-[28px]',
        icon: 'text-[#c27a19]',
        text: 'text-[18px] sm:text-[20px] leading-[1.65] text-[#1b3c44] tracking-[0.01em]',
        title: 'text-[#1b3c44]'
    },
    dark: {
        wrapper: 'bg-transparent border-0 px-0 py-0',
        icon: 'text-[#D6AD46]',
        text: 'font-[\'Schibsted_Grotesk\'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]',
        title: 'text-[#fbe7c8]'
    }
};

const noteClasses: Record<ContentTheme, { wrapper: string; icon: string; text: string; title: string }> = {
    light: {
        wrapper: 'bg-[#eef7ff] border border-[#97c8ff]/85 px-8 py-6 rounded-[28px]',
        icon: 'text-[#1d6bcf]',
        text: 'text-[18px] sm:text-[20px] leading-[1.65] text-[#1b3c44] tracking-[0.01em]',
        title: 'text-[#1b3c44]'
    },
    dark: {
        wrapper: 'bg-transparent border-0 px-0 py-0',
        icon: 'text-[#D6AD46]',
        text: 'font-[\'Schibsted_Grotesk\'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]',
        title: 'text-[#e6f4ff]'
    }
};

const prosConsClasses: Record<ContentTheme, { 
    wrapper: string; 
    prosWrapper: string; 
    consWrapper: string;
    prosIcon: string; 
    consIcon: string; 
    prosText: string;
    consText: string;
    prosTitle: string;
    consTitle: string;
    mainTitle: string;
}> = {
    light: {
        wrapper: 'grid grid-cols-1 md:grid-cols-2 gap-6',
        prosWrapper: 'bg-[#e8f8f0] border border-[#7dd6a7]/80 px-8 py-6 rounded-[28px]',
        consWrapper: 'bg-[#ffe8e8] border border-[#ff9999]/80 px-8 py-6 rounded-[28px]',
        prosIcon: 'text-[#0f8450]',
        consIcon: 'text-[#d62828]',
        prosText: 'text-[18px] sm:text-[20px] leading-[1.65] text-[#1b3c44] tracking-[0.01em]',
        consText: 'text-[18px] sm:text-[20px] leading-[1.65] text-[#1b3c44] tracking-[0.01em]',
        prosTitle: 'text-[#0f8450]',
        consTitle: 'text-[#d62828]',
        mainTitle: 'text-[#1b3c44]'
    },
    dark: {
        wrapper: 'grid grid-cols-1 md:grid-cols-2 gap-8',
        prosWrapper: 'bg-[#0f8450]/10 border border-[#0f8450]/30 px-8 py-6 rounded-[28px] backdrop-blur',
        consWrapper: 'bg-[#d62828]/10 border border-[#d62828]/30 px-8 py-6 rounded-[28px] backdrop-blur',
        prosIcon: 'text-[#7dd6a7]',
        consIcon: 'text-[#ff9999]',
        prosText: 'font-[\'Schibsted_Grotesk\'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]',
        consText: 'font-[\'Schibsted_Grotesk\'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]',
        prosTitle: 'text-[#7dd6a7]',
        consTitle: 'text-[#ff9999]',
        mainTitle: 'text-[#f2eee9]'
    }
};

const tableClasses: Record<ContentTheme, {
    wrapper: string;
    header: string;
    headerCell: string;
    border: string;
    rowEven: string;
    rowOdd: string;
    hover: string;
    caption: string;
}> = {
    light: {
        wrapper: 'bg-white rounded-[36px] shadow-xl overflow-hidden border border-[#1b3c44]/10',
        header: 'bg-[#1b3c44] text-white',
        headerCell: '',
        border: 'border-[#1b3c44]/10',
        rowEven: 'bg-white text-[#1b3c44]/90',
        rowOdd: 'bg-[#f8f4ef] text-[#1b3c44]/90',
        hover: 'hover:bg-[#f2eee9]',
        caption: 'text-[#1b3c44]/70'
    },
    dark: {
        wrapper: 'overflow-x-auto',
        header: 'bg-[#e4d9d3]',
        headerCell: 'text-[#40372e] rounded-tl-[60px] first:rounded-tl-[60px] last:rounded-tr-[60px]',
        border: 'border-0',
        rowEven: 'bg-[#40372e] text-white',
        rowOdd: 'bg-[#40372e] text-white',
        hover: 'hover:bg-[#4a3f37]',
        caption: 'text-[#f2eee9]/70'
    }
};

const galleryClasses: Record<ContentTheme, { title: string; frame: string; captionBg: string; captionText: string }> = {
    light: {
        title: 'text-[#1b3c44]',
        frame: 'bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow',
        captionBg: 'bg-white',
        captionText: 'text-gray-600'
    },
    dark: {
        title: 'text-[#f2eee9]',
        frame: 'rounded-3xl overflow-hidden border border-white/5 bg-white/10 backdrop-blur shadow-[0_40px_120px_-80px_rgba(0,0,0,1)] transition-shadow hover:shadow-[0_40px_140px_-60px_rgba(0,0,0,1)]',
        captionBg: 'bg-white/5 backdrop-blur',
        captionText: 'text-[#f2eee9]/75'
    }
};

const imageFrameClasses: Record<ContentTheme, { frame: string; captionBg: string; captionText: string }> = {
    light: {
        frame: 'rounded-3xl overflow-hidden shadow-lg bg-white',
        captionBg: 'bg-white',
        captionText: 'text-gray-600'
    },
    dark: {
        frame: 'rounded-3xl overflow-hidden border border-white/5 bg-white/10 backdrop-blur shadow-[0_50px_160px_-90px_rgba(0,0,0,1)]',
        captionBg: 'bg-white/5 backdrop-blur',
        captionText: 'text-[#f2eee9]/75'
    }
};

const ContentRenderer: FunctionComponent<ContentRendererProps> = memo(({ blocks, theme = 'light' }) => {
    return (
        <div className="space-y-[76px]">
            {blocks.map((block) => {
                switch (block.type) {
                    case 'text':
                        return <TextBlockRenderer key={block.id} block={block} theme={theme} />;
                    case 'timeline':
                        return <TimelineBlockRenderer key={block.id} block={block} theme={theme} />;
                    case 'image':
                        return <ImageBlockRenderer key={block.id} block={block} theme={theme} />;
                    case 'imageGallery':
                        return <ImageGalleryRenderer key={block.id} block={block} theme={theme} />;
                    case 'table':
                        return <TableBlockRenderer key={block.id} block={block} theme={theme} />;
                    case 'tips':
                        return <TipsBlockRenderer key={block.id} block={block} theme={theme} />;
                    case 'notes':
                        return <NotesBlockRenderer key={block.id} block={block} theme={theme} />;
                    case 'proscons':
                        return <ProsConsBlockRenderer key={block.id} block={block} theme={theme} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
});

ContentRenderer.displayName = 'ContentRenderer';

const formatMarkdownText = (text: string, theme: ContentTheme): React.ReactElement[] => {
    return text
        .split('\n\n')
        .map((paragraph, i) => {
            // Sanitize markdown to prevent XSS attacks
            const sanitized = sanitizeMarkdown(paragraph);

            return (
                <p
                    key={i}
                    className={`${typographyClasses[theme].paragraph} mb-6`}
                    dangerouslySetInnerHTML={{ __html: sanitized }}
                />
            );
        });
};

const TextBlockRenderer: FunctionComponent<{ block: TextBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    return (
        <div className="max-w-4xl mx-auto">
            {block.heading && (
                <h2 className={`text-[44px] sm:text-[58px] md:text-[84px] lg:text-[96px] font-bold leading-[1.05] tracking-[-0.01em] mb-10 ${typographyClasses[theme].heading}`}>
                    {block.heading}
                </h2>
            )}
            <div className="space-y-8">
                {formatMarkdownText(block.content, theme)}
            </div>
        </div>
    );
});

TextBlockRenderer.displayName = 'TextBlockRenderer';

const TipsBlockRenderer: FunctionComponent<{ block: TipsBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const styles = tipClasses[theme];

    return (
        <div className="max-w-4xl mx-auto">
            <div className={styles.wrapper}>
                {block.title && (
                    <h3 className={`text-[20px] sm:text-[22px] font-semibold mb-4 tracking-[0.02em] ${styles.title}`}>
                        {block.title}
                    </h3>
                )}
                <div className={theme === 'dark' ? 'space-y-[15px]' : 'space-y-0'}>
                    {block.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-[12px]">
                            <Lightbulb className={`${styles.icon} flex-shrink-0 mt-[3px]`} size={24} strokeWidth={2} />
                            <p className={`${styles.text} flex-grow`}>
                                {tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

TipsBlockRenderer.displayName = 'TipsBlockRenderer';

const NotesBlockRenderer: FunctionComponent<{ block: NotesBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const styles = noteClasses[theme];

    return (
        <div className="max-w-4xl mx-auto">
            <div className={styles.wrapper}>
                {block.title && (
                    <h3 className={`text-[20px] sm:text-[22px] font-semibold mb-4 tracking-[0.02em] ${styles.title}`}>
                        {block.title}
                    </h3>
                )}
                <div className={theme === 'dark' ? 'space-y-[15px]' : 'space-y-0'}>
                    {block.notes.map((note, index) => (
                        <div key={index} className="flex items-start gap-[13px]">
                            <Info className={`${styles.icon} flex-shrink-0`} size={26} strokeWidth={2} />
                            <p className={`${styles.text} flex-grow`}>
                                {note}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

NotesBlockRenderer.displayName = 'NotesBlockRenderer';

const ProsConsBlockRenderer: FunctionComponent<{ block: ProsConsBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const styles = prosConsClasses[theme];

    return (
        <div className="max-w-5xl mx-auto">
            {block.title && (
                <h2 className={`text-[44px] sm:text-[56px] md:text-[72px] font-bold leading-[1.05] tracking-[-0.01em] mb-10 text-center ${styles.mainTitle}`}>
                    {block.title}
                </h2>
            )}
            <div className={styles.wrapper}>
                {/* Pros Column */}
                <div className={styles.prosWrapper}>
                    <h3 className={`text-[24px] sm:text-[28px] font-bold mb-6 tracking-[0.02em] flex items-center gap-3 ${styles.prosTitle}`}>
                        <ThumbsUp size={28} strokeWidth={2.5} />
                        Pros
                    </h3>
                    <div className="space-y-4">
                        {block.pros.map((pro, index) => (
                            <div key={index} className="flex items-start gap-[13px]">
                                <div className={`${styles.prosIcon} flex-shrink-0 mt-[3px]`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <p className={`${styles.prosText} flex-grow`}>
                                    {pro}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cons Column */}
                <div className={styles.consWrapper}>
                    <h3 className={`text-[24px] sm:text-[28px] font-bold mb-6 tracking-[0.02em] flex items-center gap-3 ${styles.consTitle}`}>
                        <ThumbsDown size={28} strokeWidth={2.5} />
                        Cons
                    </h3>
                    <div className="space-y-4">
                        {block.cons.map((con, index) => (
                            <div key={index} className="flex items-start gap-[13px]">
                                <div className={`${styles.consIcon} flex-shrink-0 mt-[3px]`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                                <p className={`${styles.consText} flex-grow`}>
                                    {con}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

ProsConsBlockRenderer.displayName = 'ProsConsBlockRenderer';

const TimelineBlockRenderer: FunctionComponent<{ block: TimelineBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const variant = theme === 'light' ? 'light' : 'dark';
    const cardBackground = theme === 'light'
        ? 'bg-white shadow-lg'
        : 'bg-[#1f1a15]/90 border border-white/5 shadow-[0_80px_200px_-120px_rgba(0,0,0,1)] backdrop-blur';

    return (
        <div className="max-w-4xl mx-auto">
            {block.title && (
                <div className="text-center mb-10">
                    <h2 className={`text-[44px] sm:text-[56px] md:text-[72px] font-bold leading-[1.05] tracking-[-0.01em] mb-4 ${typographyClasses[theme].heading}`}>
                        {block.title}
                    </h2>
                </div>
            )}
            <div className={`${cardBackground} rounded-[44px] p-8 md:p-14 lg:p-16 xl:p-20 transition-all`}>
                <Timeline steps={block.steps} variant={variant} />
            </div>
        </div>
    );
});

TimelineBlockRenderer.displayName = 'TimelineBlockRenderer';

const ImageBlockRenderer: FunctionComponent<{ block: ImageBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const frame = imageFrameClasses[theme];
    const hasValidUrl = isValidImageUrl(block.url);
    const altText = getImageAltText(block.alt, block.caption, 'Guide image');

    return (
        <div className="max-w-4xl mx-auto">
            <figure className={frame.frame}>
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
                    <figcaption className={`${frame.captionBg} px-6 py-4 text-center italic ${frame.captionText}`}>
                        {block.caption}
                    </figcaption>
                )}
            </figure>
        </div>
    );
});

ImageBlockRenderer.displayName = 'ImageBlockRenderer';

const ImageGalleryRenderer: FunctionComponent<{ block: ImageGalleryBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const styles = galleryClasses[theme];

    return (
        <div className="max-w-6xl mx-auto">
            {block.title && (
                <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${styles.title}`}>
                    {block.title}
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {block.images.map((image: { url: string; caption?: string; alt?: string }, index: number) => {
                    const hasValidUrl = isValidImageUrl(image.url);
                    const altText = getImageAltText(image.alt, image.caption, `Gallery image ${index + 1}`);

                    return (
                        <figure key={index} className={`${styles.frame}`}>
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
                                <figcaption className={`${styles.captionBg} px-4 py-3 text-sm text-center ${styles.captionText}`}>
                                    {image.caption}
                                </figcaption>
                            )}
                        </figure>
                    );
                })}
            </div>
        </div>
    );
});

ImageGalleryRenderer.displayName = 'ImageGalleryRenderer';

const TableBlockRenderer: FunctionComponent<{ block: TableBlock; theme: ContentTheme }> = memo(({ block, theme }) => {
    const styles = tableClasses[theme];

    return (
        <div className="max-w-[1284px] mx-auto">
            {block.title && (
                <h2 className={`text-[44px] sm:text-[56px] md:text-[72px] font-bold mb-8 text-center tracking-[-0.01em] ${typographyClasses[theme].heading}`}>
                    {block.title}
                </h2>
            )}
            <div className={styles.wrapper}>
                <div className="min-w-[600px]">
                    <div className={`${styles.header} h-[80px] lg:h-[103px] rounded-tl-[60px] rounded-tr-[60px] flex items-center`}>
                        {block.headers.map((header, index) => (
                            <div key={index} className="flex-1 flex items-center justify-center px-2">
                                <p className={`font-['Schibsted_Grotesk'] font-bold text-[18px] lg:text-[27.806px] ${styles.headerCell}`}>{header}</p>
                            </div>
                        ))}
                    </div>

                    {block.rows.map((row, rowIndex) => {
                        const isLastRow = rowIndex === block.rows.length - 1;
                        return (
                            <div key={rowIndex} className={`${styles.rowEven} ${styles.hover} h-[70px] lg:h-[98px] flex items-center ${isLastRow ? 'rounded-bl-[60px] rounded-br-[60px] border border-[#f2eee9]' : ''} transition-colors`}>
                                {row.map((cell, cellIndex) => {
                                    const isFirstColumn = cellIndex === 0;
                                    return (
                                        <div key={cellIndex} className="flex-1 flex items-center justify-center px-2">
                                            <p className={`font-['Schibsted_Grotesk'] ${isFirstColumn ? 'font-bold' : 'font-normal'} text-[16px] lg:text-[27.806px] text-center`}>{cell}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            {block.caption && (
                <p className={`text-center text-sm italic mt-3 ${styles.caption}`}>
                    {block.caption}
                </p>
            )}
        </div>
    );
});

TableBlockRenderer.displayName = 'TableBlockRenderer';

export default ContentRenderer;
