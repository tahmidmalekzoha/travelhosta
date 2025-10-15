'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';
import { useGuides } from '../../../contexts/GuidesContext';
import { ArrowLeft, ArrowRight, Menu as MenuIcon, Tag, MapPin, Lightbulb, Info } from 'lucide-react';
import { GuideData, Language } from '../../../types';
import { isValidImageUrl } from '../../../utils/imageUtils';

interface GuideDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

const hasBengaliContent = (guide: GuideData): boolean => {
    return !!(guide.titleBn || guide.descriptionBn || (guide.contentBn && guide.contentBn.length > 0));
};

const parseMarkdownText = (text: string): React.ReactNode => {
    // Split by line breaks to preserve paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
        const parts: React.ReactNode[] = [];
        let currentText = paragraph;
        let key = 0;

        // Process the text for markdown
        const processText = (str: string): React.ReactNode[] => {
            const result: React.ReactNode[] = [];
            let remaining = str;
            
            // Match **bold** and *italic* patterns
            const boldItalicRegex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
            let lastIndex = 0;
            let match;

            while ((match = boldItalicRegex.exec(remaining)) !== null) {
                // Add text before the match
                if (match.index > lastIndex) {
                    result.push(remaining.substring(lastIndex, match.index));
                }

                // Add the formatted text
                if (match[1]) {
                    // Bold text (**text**)
                    result.push(<strong key={`bold-${key++}`}>{match[2]}</strong>);
                } else if (match[3]) {
                    // Italic text (*text*)
                    result.push(<em key={`italic-${key++}`}>{match[4]}</em>);
                }

                lastIndex = match.index + match[0].length;
            }

            // Add remaining text
            if (lastIndex < remaining.length) {
                result.push(remaining.substring(lastIndex));
            }

            return result.length > 0 ? result : [remaining];
        };

        return (
            <p key={`p-${pIndex}`} className="mb-4 last:mb-0">
                {processText(currentText)}
            </p>
        );
    });
};

export default function GuideDetail({ params }: GuideDetailPageProps) {
    const router = useRouter();
    const { guides } = useGuides();
    const unwrappedParams = React.use(params);
    const guide = guides.find(g => g.id === parseInt(unwrappedParams.id));
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

    const hasBengali = useMemo(() => 
        guide ? hasBengaliContent(guide) : false, 
        [guide]
    );

    const pageTitle = currentLanguage === 'en' && guide ? guide.title : (guide?.titleBn || guide?.title || '');
    const descriptionText = currentLanguage === 'en' && guide ? guide.description : (guide?.descriptionBn || guide?.description || '');
    const contentBlocks = currentLanguage === 'en' && guide ? guide.content : (guide?.contentBn || guide?.content);

    // Debug: Log content blocks order
    React.useEffect(() => {
        if (contentBlocks) {
            console.log('=== Content Blocks Order ===');
            contentBlocks.forEach((block, idx) => {
                console.log(`${idx + 1}. ${block.type.toUpperCase()} (id: ${block.id})`);
                if (block.type === 'text' && 'content' in block) {
                    console.log(`   Content preview: ${block.content.substring(0, 50)}...`);
                } else if (block.type === 'table' && 'headers' in block) {
                    console.log(`   Headers: ${block.headers.join(', ')}`);
                } else if (block.type === 'tips' && 'tips' in block) {
                    console.log(`   Tips count: ${block.tips.length}`);
                } else if (block.type === 'notes' && 'notes' in block) {
                    console.log(`   Notes count: ${block.notes.length}`);
                }
            });
            console.log('===========================');
        }
    }, [contentBlocks]);

    if (!guide) {
        return (
            <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
                <div className="pt-24 px-6">
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
                        <p className="text-gray-600 mb-8">The guide you&apos;re looking for doesn&apos;t exist.</p>
                        <button
                            onClick={() => router.push('/guides')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Guides
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handleBack = () => router.push('/guides');
    const handleSignIn = () => router.push('/signin');
    const handleMenu = () => router.push('/');

    return (
        <div className="min-h-screen bg-[#f2eee9] font-['Schibsted_Grotesk']">
            <div className="relative px-4 lg:px-[37px] pt-[55px]">
                <div className="flex flex-col-reverse lg:flex-row items-start lg:items-start justify-between gap-4">
                    <button onClick={handleBack} className="group relative inline-flex items-center rounded-full bg-[#28231d] h-[85px] transition-transform duration-200 hover:-translate-x-1 hover:bg-[#1f1a15]">
                        <span className="absolute left-[11.54px] top-[9.44px] flex h-[65.062px] w-[65.062px] items-center justify-center rounded-full bg-[#f2eee9] text-[#28231d]">
                            <ArrowLeft size={28} strokeWidth={2.5} />
                        </span>
                        <span className="font-['Schibsted_Grotesk'] font-normal text-[50.37px] text-[#f2eee9] ml-[93.4px] mr-[34px]">Back</span>
                    </button>

                    <div className="flex flex-col items-end gap-[13px]">
                        <button onClick={handleSignIn} className="group relative inline-flex items-center rounded-[52px] bg-[#e4d9d3] h-[86px] w-[297px] transition-colors hover:bg-[#d4c9c3]">
                            <span className="absolute left-[39px] top-[9px] font-['Schibsted_Grotesk'] font-normal text-[48px] text-black">Sign In</span>
                            <span className="absolute right-[11px] top-[9px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#28231d] text-[#f2eee9]">
                                <ArrowRight size={24} strokeWidth={2.5} />
                            </span>
                        </button>

                        <button onClick={handleMenu} className="relative inline-flex items-center rounded-[52px] bg-[#e4d9d3] h-[92px] w-[264px] transition-colors hover:bg-[#d4c9c3]">
                            <span className="absolute left-[41px] top-[16px] font-['Schibsted_Grotesk'] font-normal text-[48px] text-black">Menu</span>
                            <span className="absolute right-[11px] top-[13.5px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#28231d] text-[#f2eee9]">
                                <MenuIcon size={28} strokeWidth={2} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative px-4 lg:px-[125px] pt-[107px]">
                <div className="flex flex-col lg:flex-row items-start gap-[61px]">
                    <div className="relative overflow-hidden rounded-[59px] bg-white w-full lg:w-[659.036px] h-auto lg:h-[491px] flex-shrink-0">
                        {isValidImageUrl(guide.imageUrl) ? (
                            <img src={guide.imageUrl!} alt={pageTitle} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full min-h-[320px] lg:min-h-[491px] w-full flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-600">
                                <svg className="h-20 w-20 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-3 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2m13 0H5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="mt-4 text-base font-medium">No Image Available</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-[18px] flex-1">
                        <h1 className="font-['Schibsted_Grotesk'] font-bold text-[48px] lg:text-[96px] leading-[normal] text-[#1b3c44]">{pageTitle}</h1>

                        <div className="flex flex-col gap-[20.5px]">
                            <div className="relative">
                                <p className="font-['Schibsted_Grotesk'] font-normal text-[20px] lg:text-[32px] leading-[normal] text-black">{descriptionText}</p>

                                {guide.tags && guide.tags.length > 0 && (
                                    <div className="flex items-center gap-[5px] mt-[20px]">
                                        <div className="flex h-[37.89px] w-[37.89px] items-center justify-center">
                                            <span className="font-['Schibsted_Grotesk'] font-normal text-[24px] leading-none text-black">#</span>
                                        </div>
                                        <div className="flex items-center gap-[15.8px]">
                                            {guide.tags.slice(0, 2).map((tag, index) => (
                                                <button 
                                                    key={index} 
                                                    onClick={() => router.push(`/guides?tag=${encodeURIComponent(tag)}`)}
                                                    className="inline-flex items-center justify-center rounded-[26.049px] bg-[#1b3c44] h-[52.099px] px-[14.2px] hover:bg-[#cd8453] transition-colors cursor-pointer"
                                                >
                                                    <span className="font-['Schibsted_Grotesk'] font-normal text-[20px] lg:text-[23.681px] leading-[normal] text-[#f2eee9] whitespace-nowrap">{tag}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-[14.2px]">
                                <div className="flex items-center gap-[18.9px]">
                                    <div className="flex h-[37.89px] w-[37.89px] items-center justify-center">
                                        <MapPin size={24} className="text-black" strokeWidth={2} />
                                    </div>
                                    <p className="font-['Schibsted_Grotesk'] font-normal text-[20px] lg:text-[25.26px] leading-[normal] text-black">{guide.division}</p>
                                </div>

                                {guide.category && (
                                    <div className="flex items-center gap-[18.9px]">
                                        <div className="flex h-[37.89px] w-[37.89px] items-center justify-center">
                                            <Tag size={24} className="text-black" strokeWidth={2} />
                                        </div>
                                        <p className="font-['Schibsted_Grotesk'] font-normal text-[20px] lg:text-[25.26px] leading-[normal] text-black">{guide.category}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative px-4 lg:px-[38px] pt-[80px] lg:pt-[121px] pb-[80px] lg:pb-[120px]">
                <div className="bg-[#28231d] rounded-tl-[80px] rounded-tr-[81px] rounded-bl-[80px] rounded-br-[81px] shadow-[0px_6px_72.8px_-32px_rgba(0,0,0,0.25)] px-4 lg:px-[99px] py-[60px] lg:py-[80px]">
                    
                    <div className="mb-[76px]">
                        <h2 className="font-['Schibsted_Grotesk'] font-bold text-[48px] lg:text-[96px] leading-[normal] text-[#f2eee9] mb-[60px] lg:mb-[122px]">About this Journey</h2>
                        <div className="w-full max-w-[907px]">
                            <p className="font-['Schibsted_Grotesk'] font-medium text-[20px] lg:text-[32px] leading-[normal] text-[#f2eee9]">{descriptionText}</p>
                        </div>
                    </div>

                    {contentBlocks && contentBlocks.map((block, blockIndex) => {
                        // Timeline block
                        if (block.type === 'timeline' && 'steps' in block) {
                            const steps = block.steps;
                            return (
                                <div key={block.id || `timeline-${blockIndex}`} className="mb-[76px]">
                                    <h2 className="font-['Schibsted_Grotesk'] font-bold text-[48px] lg:text-[96px] leading-[normal] text-[#f2eee9] mb-[40px] lg:mb-[66px]">
                                        {block.title || 'Day 1: How to get there'}
                                    </h2>
                                    
                                    <div className="space-y-[40px]">
                                        {steps.map((step, index) => (
                                            <div key={step.id ?? index} className="relative flex items-start gap-[21px]">
                                                {index < steps.length - 1 && (
                                                    <div className="absolute left-[40.5px] top-[81px] w-[3px] h-[calc(100%+40px)] bg-[#f2eee9]/30" />
                                                )}
                                                
                                                <div className="relative z-10 flex-shrink-0">
                                                    <div className="flex h-[81.299px] w-[81.299px] items-center justify-center rounded-full border-[6px] border-[#f2eee9]/60 bg-[#cd8453]">
                                                        <div className="h-[14px] w-[14px] rounded-full bg-[#28231d]" />
                                                    </div>
                                                </div>

                                                <div className="flex-1 pt-[13px]">
                                                    <h3 className="font-['Schibsted_Grotesk'] font-bold text-[24px] lg:text-[41.961px] leading-[normal] text-[#f2eee9] mb-[40px] lg:mb-[30px]">{step.title}</h3>

                                                    {step.details && step.details.length > 0 && (
                                                        <div className="flex flex-wrap gap-[10px] mb-[40px] lg:mb-[69px]">
                                                            {step.details.map((detail, detailIndex) => (
                                                                <div key={`${step.id}-detail-${detailIndex}`} className="inline-flex items-center justify-center rounded-[39.338px] bg-[#40372e] h-[60px] lg:h-[78px] px-[20px] lg:px-[27px]">
                                                                    <span className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[26.225px] leading-[normal] text-[#f2eee9]">{detail}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {step.tips && step.tips.length > 0 && (
                                                        <div className="mb-[40px] lg:mb-[69px] space-y-[15px]">
                                                            {step.tips.map((tip, tipIndex) => (
                                                                <div key={`${step.id}-tip-${tipIndex}`} className="flex items-start gap-[12px]">
                                                                    <Lightbulb size={24} className="flex-shrink-0 mt-[3px] text-[#D6AD46]" strokeWidth={2} />
                                                                    <p className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9] flex-1">{tip}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {step.notes && step.notes.length > 0 && (
                                                        <div className="mb-[40px] lg:mb-[69px] space-y-[15px]">
                                                            {step.notes.map((note, noteIndex) => (
                                                                <div key={`${step.id}-note-${noteIndex}`} className="flex items-start gap-[13px]">
                                                                    <Info size={26} className="flex-shrink-0 text-[#D6AD46]" strokeWidth={2} />
                                                                    <p className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9] flex-1">{note}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        // Text block
                        if (block.type === 'text' && 'content' in block) {
                            return (
                                <div key={block.id || `text-${blockIndex}`} className="mb-[76px]">
                                    <div className="font-['Schibsted_Grotesk'] font-normal text-[28px] lg:text-[50.37px] leading-[normal] text-white max-w-[1284px]">
                                        {parseMarkdownText(block.content)}
                                    </div>
                                </div>
                            );
                        }

                        // Table block
                        if (block.type === 'table' && 'headers' in block && 'rows' in block) {
                            return (
                                <div key={block.id || `table-${blockIndex}`} className="mb-[76px] overflow-x-auto">
                                    <div className="min-w-[600px]">
                                        <div className="bg-[#e4d9d3] h-[80px] lg:h-[103px] rounded-tl-[60px] rounded-tr-[60px] flex items-center">
                                            {block.headers.map((header, index) => (
                                                <div key={index} className="flex-1 flex items-center justify-center px-2">
                                                    <p className="font-['Schibsted_Grotesk'] font-bold text-[18px] lg:text-[27.806px] text-[#40372e] text-center">{header}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {block.rows.map((row, rowIndex) => {
                                            const isLastRow = rowIndex === block.rows.length - 1;
                                            return (
                                                <div key={rowIndex} className={`bg-[#40372e] h-[70px] lg:h-[98px] flex items-center ${isLastRow ? 'rounded-bl-[60px] rounded-br-[60px] border border-[#f2eee9]' : ''}`}>
                                                    {row.map((cell, cellIndex) => {
                                                        const isFirstColumn = cellIndex === 0;
                                                        return (
                                                            <div key={cellIndex} className="flex-1 flex items-center justify-center px-2">
                                                                <p className={`font-['Schibsted_Grotesk'] ${isFirstColumn ? 'font-bold' : 'font-normal'} text-[16px] lg:text-[27.806px] text-white text-center`}>{cell}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        // Notes block
                        if (block.type === 'notes' && 'notes' in block) {
                            return (
                                <div key={block.id || `notes-${blockIndex}`} className="mb-[76px] space-y-[15px]">
                                    {block.notes.map((note, noteIndex) => (
                                        <div key={noteIndex} className="flex items-start gap-[13px]">
                                            <Info size={26} className="flex-shrink-0 text-[#D6AD46]" strokeWidth={2} />
                                            <p className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9] flex-1">{note}</p>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        // Tips block
                        if (block.type === 'tips' && 'tips' in block) {
                            return (
                                <div key={block.id || `tips-${blockIndex}`} className="mb-[76px] space-y-[15px]">
                                    {block.tips.map((tip, tipIndex) => (
                                        <div key={tipIndex} className="flex items-start gap-[12px]">
                                            <Lightbulb size={24} className="flex-shrink-0 mt-[3px] text-[#D6AD46]" strokeWidth={2} />
                                            <p className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9] flex-1">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        // Image block
                        if (block.type === 'image' && 'url' in block) {
                            return (
                                <div key={block.id || `image-${blockIndex}`} className="mb-[76px]">
                                    <div className="relative overflow-hidden rounded-[40px] bg-white">
                                        {isValidImageUrl(block.url) ? (
                                            <img src={block.url} alt={block.alt || block.caption || 'Guide image'} className="w-full h-auto object-cover" />
                                        ) : (
                                            <div className="flex h-[400px] w-full flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-600">
                                                <p className="text-lg font-medium">Image not available</p>
                                            </div>
                                        )}
                                        {block.caption && (
                                            <p className="mt-4 text-center font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[24px] text-[#f2eee9]">{block.caption}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        // Image Gallery block
                        if (block.type === 'imageGallery' && 'images' in block) {
                            return (
                                <div key={block.id || `gallery-${blockIndex}`} className="mb-[76px]">
                                    {block.title && (
                                        <h3 className="font-['Schibsted_Grotesk'] font-bold text-[32px] lg:text-[48px] leading-[normal] text-[#f2eee9] mb-[40px]">{block.title}</h3>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                                        {block.images.map((image, imgIndex) => (
                                            <div key={imgIndex} className="relative overflow-hidden rounded-[40px] bg-white">
                                                {isValidImageUrl(image.url) ? (
                                                    <img src={image.url} alt={image.caption || `Gallery image ${imgIndex + 1}`} className="w-full h-auto object-cover" />
                                                ) : (
                                                    <div className="flex h-[300px] w-full flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 text-gray-600">
                                                        <p className="text-base font-medium">Image not available</p>
                                                    </div>
                                                )}
                                                {image.caption && (
                                                    <p className="mt-3 text-center font-['Schibsted_Grotesk'] font-normal text-[16px] lg:text-[20px] text-[#f2eee9]">{image.caption}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>

            <Footer />
        </div>
    );
}
