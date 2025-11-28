'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';
import StickyNavbar from '../../../components/StickyNavbar';
import ImageLightbox from '../../../components/shared/ImageLightbox';
import SubscriptionPrompt from '../../../components/SubscriptionPrompt';
import { GuidesProvider, useGuides } from '../../../contexts/GuidesContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { ArrowLeft, Tag, MapPin, Lightbulb, Info, ThumbsUp, ThumbsDown, Lock } from 'lucide-react';
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
        const currentText = paragraph;
        let key = 0;

        // Process the text for markdown
        const processText = (str: string): React.ReactNode[] => {
            const result: React.ReactNode[] = [];
            const remaining = str;
            
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

function GuideDetailContent({ params }: GuideDetailPageProps) {
    const router = useRouter();
    const { guides } = useGuides();
    const { user } = useAuth();
    const { canAccessGuide } = useSubscription();
    const unwrappedParams = React.use(params);
    const guide = guides.find(g => g.id === parseInt(unwrappedParams.id));
    
    // Initialize language from localStorage, default to 'en'
    const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('preferredLanguage');
            return (stored === 'bn' || stored === 'en') ? stored : 'en';
        }
        return 'en';
    });
    
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [lightboxCaption, setLightboxCaption] = useState<string | undefined>(undefined);
    const [lightboxAlt, setLightboxAlt] = useState<string | undefined>(undefined);
    const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption?: string; alt?: string }> | undefined>(undefined);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

    // Check access when guide is loaded
    useEffect(() => {
        const checkAccess = async () => {
            if (guide) {
                const access = await canAccessGuide(guide.id);
                setHasAccess(access);
                // If logged in user doesn't have access, show prompt
                if (user && !access) {
                    setShowSubscriptionPrompt(true);
                }
            }
        };
        checkAccess();
    }, [guide, canAccessGuide, user]);

    const hasBengali = useMemo(() => 
        guide ? hasBengaliContent(guide) : false, 
        [guide]
    );

    // Save language preference to localStorage whenever it changes
    const handleLanguageChange = (lang: Language) => {
        setCurrentLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferredLanguage', lang);
        }
    };

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

    // Check if access is being determined
    if (hasAccess === null) {
        return (
            <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
                <StickyNavbar />
                <div className="pt-24 px-6">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd8453] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading guide...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If user doesn't have access and is logged in, show locked state
    if (!hasAccess && user) {
        return (
            <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
                <StickyNavbar />
                
                {/* Subscription Prompt Modal */}
                {showSubscriptionPrompt && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <SubscriptionPrompt
                            onClose={() => {
                                setShowSubscriptionPrompt(false);
                                router.push('/guides');
                            }}
                            showCloseButton={true}
                        />
                    </div>
                )}
                
                <div className="pt-24 px-6">
                    <div className="text-center py-20 max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg p-8 shadow-lg">
                            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h1 className="text-3xl font-bold mb-4">Premium Guide</h1>
                            <p className="text-gray-600 mb-6">
                                This guide is available exclusively for premium members. 
                                Subscribe now to unlock all guides!
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setShowSubscriptionPrompt(true)}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                                >
                                    Subscribe Now (৳149)
                                </button>
                                <button
                                    onClick={() => router.push('/guides')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    Back to Guides
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // If user is not logged in and doesn't have access, redirect to signin
    if (!hasAccess && !user) {
        router.push(`/signin?redirect=/guides/${guide.id}`);
        return null;
    }

    const handleBack = () => router.push('/guides');

    return (
        <div className="min-h-screen bg-[#f2eee9] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation - same as other pages */}
            <StickyNavbar />

            <div className="relative px-4 lg:px-[37px] pt-[55px]">
                <div className="flex flex-col-reverse lg:flex-row items-start lg:items-start justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <button onClick={handleBack} className="group relative inline-flex items-center rounded-full bg-[#1b3c44] h-[85px] transition-transform duration-200 hover:-translate-x-1 hover:bg-[#152e34]">
                            <span className="absolute left-[11.54px] top-[9.44px] flex h-[65.062px] w-[65.062px] items-center justify-center rounded-full bg-[#f2eee9] text-[#1b3c44]">
                                <ArrowLeft size={28} strokeWidth={2.5} />
                            </span>
                            <span className="font-['Schibsted_Grotesk'] font-normal text-[50.37px] text-[#f2eee9] ml-[93.4px] mr-[34px]">Back</span>
                        </button>

                        {/* Language Toggle - only show if Bengali content exists */}
                        {hasBengali && (
                            <div className="relative inline-flex items-center rounded-full bg-[#cd8453] h-[85px] px-[20px] gap-[16px]">
                                {/* Sliding circle indicator */}
                                <div 
                                    className={`absolute top-[9.44px] h-[65.062px] w-[65.062px] rounded-full bg-[#f2eee9] transition-all duration-300 ease-out shadow-md ${
                                        currentLanguage === 'en' 
                                            ? 'left-[20px]' 
                                            : 'left-[calc(100%-85.062px)]'
                                    }`}
                                />
                                
                                {/* English button */}
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className="relative z-10 flex items-center justify-center h-[65.062px] w-[65.062px] transition-all duration-200 hover:scale-105"
                                >
                                    <span className={`font-['Schibsted_Grotesk'] font-bold text-[22px] transition-colors duration-300 ${
                                        currentLanguage === 'en'
                                            ? 'text-[#28231d]'
                                            : 'text-[#f2eee9]'
                                    }`}>
                                        EN
                                    </span>
                                </button>

                                {/* Bengali button */}
                                <button
                                    onClick={() => handleLanguageChange('bn')}
                                    className="relative z-10 flex items-center justify-center h-[65.062px] w-[65.062px] transition-all duration-200 hover:scale-105"
                                >
                                    <span className={`font-['Schibsted_Grotesk'] font-bold text-[22px] transition-colors duration-300 ${
                                        currentLanguage === 'bn'
                                            ? 'text-[#28231d]'
                                            : 'text-[#f2eee9]'
                                    }`}>
                                        বাং
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative px-4 lg:px-[125px] pt-[107px]">
                <div className="flex flex-col lg:flex-row items-start gap-[61px]">
                    {/* 4:3 aspect ratio cover image with fit (not cropped) */}
                    <div className="relative overflow-hidden rounded-[59px] bg-gradient-to-br from-gray-200 to-gray-300 w-full lg:w-[659.036px] flex-shrink-0 aspect-[4/3]">
                        {isValidImageUrl(guide.imageUrl) ? (
                            <img src={guide.imageUrl!} alt={pageTitle} className="h-full w-full object-contain" />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center text-gray-600">
                                <svg className="h-20 w-20 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-3 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2m13 0H5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="mt-4 text-base font-medium">No Image Available</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-[8px] flex-1">
                        <h1 className="font-['Schibsted_Grotesk'] font-bold text-[48px] lg:text-[96px] leading-[normal] text-[#1b3c44] -ml-1">{pageTitle}</h1>

                        <p className="font-['Schibsted_Grotesk'] font-normal text-[24px] leading-[normal] text-black">{descriptionText}</p>

                        <div className="flex flex-col gap-[20.5px] mt-[20px]">
                            {guide.tags && guide.tags.length > 0 && (
                                <div className="flex items-center gap-[5px]">
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
                <div className="bg-[#1b3c44] rounded-tl-[80px] rounded-tr-[81px] rounded-bl-[80px] rounded-br-[81px] shadow-[0px_6px_72.8px_-32px_rgba(0,0,0,0.25)] px-4 lg:px-[99px] py-[60px] lg:py-[80px]">
                    
                    <div className="mb-[76px]">
                        <h2 className="font-['Schibsted_Grotesk'] font-bold text-[48px] lg:text-[96px] leading-[normal] text-[#f2eee9] mb-[60px] lg:mb-[122px]">About this Journey</h2>
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
                                        {steps.map((step, index) => {
                                            const isFirst = index === 0;
                                            const isLast = index === steps.length - 1;
                                            
                                            return (
                                            <div key={step.id ?? index} className="relative flex items-start gap-[21px]">
                                                {/* Connecting line - spans through current item to next */}
                                                {index < steps.length - 1 && (
                                                    <div className="absolute left-[25px] top-[55px] w-[3px] bg-[#f2eee9]/30" style={{ height: 'calc(100% + 45px)' }} />
                                                )}
                                                
                                                <div className="relative z-10 flex-shrink-0 mt-[5px]">
                                                    {/* White circle with outer ring */}
                                                    <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white">
                                                        {/* Outer ring - centered around the inner circle */}
                                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] rounded-full border-[2px] border-[#f2eee9]/30"></div>
                                                    </div>
                                                    
                                                    {/* Bottom line for last icon */}
                                                    {isLast && (
                                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-[13px] w-[3px] h-[30px] bg-[#f2eee9]/30" />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-['Schibsted_Grotesk'] font-bold text-[24px] lg:text-[41.961px] leading-[normal] text-[#f2eee9] mb-[40px] lg:mb-[30px]">{step.title}</h3>

                                                    {step.details && step.details.length > 0 && (
                                                        <div className="flex flex-wrap gap-[10px] mb-[40px] lg:mb-[69px]">
                                                            {step.details.map((detail, detailIndex) => (
                                                                <div key={`${step.id}-detail-${detailIndex}`} className="inline-flex items-center justify-center rounded-[39.338px] bg-white h-[60px] lg:h-[78px] px-[20px] lg:px-[27px]">
                                                                    <span className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[26.225px] leading-[normal] text-[#1b3c44]">{detail}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {step.tips && step.tips.length > 0 && (
                                                        <div className="mb-[40px] lg:mb-[69px]">
                                                            <div className="bg-[#D6AD46]/10 border-2 border-[#D6AD46]/30 rounded-[40px] px-[20px] lg:px-[25px] py-[20px] lg:py-[25px]">
                                                                <div className="flex items-center gap-[12px] mb-[15px]">
                                                                    <Lightbulb size={24} className="flex-shrink-0 text-[#D6AD46]" strokeWidth={2} />
                                                                    <h4 className="font-['Schibsted_Grotesk'] font-bold text-[22px] lg:text-[24px] text-[#f2eee9]">Tips</h4>
                                                                </div>
                                                                <div className="space-y-[10px]">
                                                                    {step.tips.map((tip, tipIndex) => (
                                                                        <p key={`${step.id}-tip-${tipIndex}`} className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]">
                                                                            • {tip}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {step.notes && step.notes.length > 0 && (
                                                        <div className="mb-[40px] lg:mb-[69px]">
                                                            <div className="bg-[#D6AD46]/10 border-2 border-[#D6AD46]/30 rounded-[40px] px-[20px] lg:px-[25px] py-[20px] lg:py-[25px]">
                                                                <div className="flex items-center gap-[13px] mb-[15px]">
                                                                    <Info size={24} className="flex-shrink-0 text-[#D6AD46]" strokeWidth={2} />
                                                                    <h4 className="font-['Schibsted_Grotesk'] font-bold text-[22px] lg:text-[24px] text-[#f2eee9]">Notes</h4>
                                                                </div>
                                                                <div className="space-y-[10px]">
                                                                    {step.notes.map((note, noteIndex) => (
                                                                        <p key={`${step.id}-note-${noteIndex}`} className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]">
                                                                            • {note}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            );
                                        })}
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
                                        <div className="bg-[#1b3c44] h-[80px] lg:h-[103px] rounded-tl-[60px] rounded-tr-[60px] flex items-center">
                                            {block.headers.map((header, index) => (
                                                <div key={index} className="flex-1 flex items-center justify-center px-2">
                                                    <p className="font-['Schibsted_Grotesk'] font-bold text-[18px] lg:text-[27.806px] text-white text-center">{header}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {block.rows.map((row, rowIndex) => {
                                            const isLastRow = rowIndex === block.rows.length - 1;
                                            return (
                                                <div key={rowIndex} className={`bg-white h-[70px] lg:h-[98px] flex items-center ${isLastRow ? 'rounded-bl-[60px] rounded-br-[60px] border border-[#f2eee9]' : ''}`}>
                                                    {row.map((cell, cellIndex) => {
                                                        const isFirstColumn = cellIndex === 0;
                                                        return (
                                                            <div key={cellIndex} className="flex-1 flex items-center justify-center px-2">
                                                                <p className={`font-['Schibsted_Grotesk'] ${isFirstColumn ? 'font-bold' : 'font-normal'} text-[16px] lg:text-[27.806px] text-[#1b3c44] text-center`}>{cell}</p>
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
                                <div key={block.id || `notes-${blockIndex}`} className="mb-[76px]">
                                    <div className="bg-[#D6AD46]/10 border-2 border-[#D6AD46]/30 rounded-[40px] px-[20px] lg:px-[25px] py-[20px] lg:py-[25px]">
                                        <div className="flex items-center gap-[13px] mb-[15px]">
                                            <Info size={24} className="flex-shrink-0 text-[#D6AD46]" strokeWidth={2} />
                                            <h4 className="font-['Schibsted_Grotesk'] font-bold text-[22px] lg:text-[24px] text-[#f2eee9]">Notes</h4>
                                        </div>
                                        <div className="space-y-[10px]">
                                            {block.notes.map((note, noteIndex) => (
                                                <p key={noteIndex} className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]">
                                                    • {note}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Tips block
                        if (block.type === 'tips' && 'tips' in block) {
                            return (
                                <div key={block.id || `tips-${blockIndex}`} className="mb-[76px]">
                                    <div className="bg-[#D6AD46]/10 border-2 border-[#D6AD46]/30 rounded-[40px] px-[20px] lg:px-[25px] py-[20px] lg:py-[25px]">
                                        <div className="flex items-center gap-[12px] mb-[15px]">
                                            <Lightbulb size={24} className="flex-shrink-0 text-[#D6AD46]" strokeWidth={2} />
                                            <h4 className="font-['Schibsted_Grotesk'] font-bold text-[22px] lg:text-[24px] text-[#f2eee9]">Tips</h4>
                                        </div>
                                        <div className="space-y-[10px]">
                                            {block.tips.map((tip, tipIndex) => (
                                                <p key={tipIndex} className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9]">
                                                    • {tip}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Pros & Cons block
                        if (block.type === 'proscons' && 'pros' in block && 'cons' in block) {
                            return (
                                <div key={block.id || `proscons-${blockIndex}`} className="mb-[76px]">
                                    {block.title && (
                                        <h3 className="font-['Schibsted_Grotesk'] font-bold text-[44px] lg:text-[72px] leading-[normal] text-[#f2eee9] mb-[40px] lg:mb-[60px] text-center">{block.title}</h3>
                                    )}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[60px]">
                                        {/* Pros Column */}
                                        <div className="bg-[#0f8450]/10 border border-[#0f8450]/30 rounded-[28px] px-[30px] lg:px-[40px] py-[30px] lg:py-[40px] backdrop-blur">
                                            <h4 className="font-['Schibsted_Grotesk'] font-bold text-[28px] lg:text-[36px] leading-[normal] text-[#7dd6a7] mb-[30px] flex items-center gap-[15px]">
                                                <ThumbsUp size={32} strokeWidth={2.5} />
                                                Pros
                                            </h4>
                                            <div className="space-y-[20px]">
                                                {block.pros.map((pro, proIndex) => (
                                                    <div key={proIndex} className="flex items-start gap-[15px]">
                                                        <div className="flex-shrink-0 mt-[3px] text-[#7dd6a7]">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        </div>
                                                        <p className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9] flex-1">{pro}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Cons Column */}
                                        <div className="bg-[#d62828]/10 border border-[#d62828]/30 rounded-[28px] px-[30px] lg:px-[40px] py-[30px] lg:py-[40px] backdrop-blur">
                                            <h4 className="font-['Schibsted_Grotesk'] font-bold text-[28px] lg:text-[36px] leading-[normal] text-[#ff9999] mb-[30px] flex items-center gap-[15px]">
                                                <ThumbsDown size={32} strokeWidth={2.5} />
                                                Cons
                                            </h4>
                                            <div className="space-y-[20px]">
                                                {block.cons.map((con, conIndex) => (
                                                    <div key={conIndex} className="flex items-start gap-[15px]">
                                                        <div className="flex-shrink-0 mt-[3px] text-[#ff9999]">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                            </svg>
                                                        </div>
                                                        <p className="font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[20px] leading-[normal] text-[#f2eee9] flex-1">{con}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Image block - 4:3 ratio, fit, 50vw width
                        if (block.type === 'image' && 'url' in block) {
                            return (
                                <div key={block.id || `image-${blockIndex}`} className="mb-[76px] flex flex-col items-center justify-center w-full">
                                    <div 
                                        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-gray-200 to-gray-300 w-[50vw] min-w-[300px] aspect-[4/3] mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => {
                                            if (isValidImageUrl(block.url)) {
                                                setLightboxImage(block.url);
                                                setLightboxCaption(block.caption);
                                                setLightboxAlt(block.alt);
                                                setGalleryImages(undefined);
                                            }
                                        }}
                                    >
                                        {isValidImageUrl(block.url) ? (
                                            <img src={block.url} alt={block.alt || block.caption || 'Guide image'} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center text-gray-600">
                                                <p className="text-lg font-medium">Image not available</p>
                                            </div>
                                        )}
                                    </div>
                                    {block.caption && (
                                        <p className="mt-4 text-center font-['Schibsted_Grotesk'] font-normal text-[18px] lg:text-[24px] text-[#f2eee9]">{block.caption}</p>
                                    )}
                                </div>
                            );
                        }

                        // Image Gallery block - 4:3 ratio, fit, 20vw width
                        if (block.type === 'imageGallery' && 'images' in block) {
                            return (
                                <div key={block.id || `gallery-${blockIndex}`} className="mb-[76px] flex flex-col items-center justify-center w-full">
                                    {block.title && (
                                        <h3 className="font-['Schibsted_Grotesk'] font-bold text-[32px] lg:text-[48px] leading-[normal] text-[#f2eee9] mb-[40px] text-center w-full">{block.title}</h3>
                                    )}
                                    <div className="flex flex-wrap gap-[30px] justify-center items-center">
                                        {block.images.map((image, imgIndex) => (
                                            <div key={imgIndex} className="flex flex-col items-center">
                                                <div 
                                                    className="overflow-hidden rounded-[40px] bg-gradient-to-br from-gray-200 to-gray-300 w-[20vw] min-w-[200px] aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => {
                                                        if (isValidImageUrl(image.url)) {
                                                            setLightboxImage(image.url);
                                                            setLightboxCaption(image.caption);
                                                            setLightboxAlt(image.alt);
                                                            setGalleryImages(block.images.filter(img => isValidImageUrl(img.url)));
                                                            setCurrentImageIndex(imgIndex);
                                                        }
                                                    }}
                                                >
                                                    {isValidImageUrl(image.url) ? (
                                                        <img src={image.url} alt={image.caption || `Gallery image ${imgIndex + 1}`} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="flex h-full w-full flex-col items-center justify-center text-gray-600">
                                                            <p className="text-base font-medium">Image not available</p>
                                                        </div>
                                                    )}
                                                </div>
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

            {/* Lightbox */}
            {lightboxImage && (
                <ImageLightbox
                    imageUrl={lightboxImage}
                    alt={lightboxAlt}
                    caption={lightboxCaption}
                    onClose={() => {
                        setLightboxImage(null);
                        setLightboxCaption(undefined);
                        setLightboxAlt(undefined);
                        setGalleryImages(undefined);
                    }}
                    images={galleryImages}
                    currentIndex={currentImageIndex}
                    onNavigate={(index) => {
                        if (galleryImages) {
                            setCurrentImageIndex(index);
                            setLightboxImage(galleryImages[index].url);
                            setLightboxCaption(galleryImages[index].caption);
                            setLightboxAlt(galleryImages[index].alt);
                        }
                    }}
                />
            )}
        </div>
    );
}

export default function GuideDetail(props: GuideDetailPageProps) {
    return (
        <GuidesProvider>
            <GuideDetailContent {...props} />
        </GuidesProvider>
    );
}
