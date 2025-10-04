'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StickyNavbar from '../../../components/StickyNavbar';
import Footer from '../../../components/Footer';
import Timeline from '../../../components/Timeline';
import ContentRenderer from '../../../components/ContentRenderer';
import { useGuides } from '../../../contexts/GuidesContext';
import { ArrowLeft, MapPin, Tag, Calendar, Users, Languages } from 'lucide-react';
import { Language } from '../../../types';

interface GuideDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function GuideDetail({ params }: GuideDetailPageProps) {
    const router = useRouter();
    const { guides } = useGuides();
    const unwrappedParams = React.use(params);
    const guide = guides.find(g => g.id === parseInt(unwrappedParams.id));
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

    // Check if Bengali content is available
    const hasBengaliContent = guide?.titleBn || guide?.descriptionBn || (guide?.contentBn && guide.contentBn.length > 0);

    if (!guide) {
        return (
            <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
                <StickyNavbar />
                <div className="pt-24 md:pt-32 lg:pt-[167px] px-6 md:px-12 lg:px-20">
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold mb-4">Guide Not Found</h1>
                        <p className="text-gray-600 mb-8">The guide you're looking for doesn't exist.</p>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f2eee9] text-[#1b3c44] font-['Schibsted_Grotesk']">
            {/* Sticky Navigation */}
            <StickyNavbar />

            {/* Main Content */}
            <div className="pt-24 md:pt-32 lg:pt-[167px] px-6 md:px-12 lg:px-20">
                {/* Back Button and Language Toggle */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-[#cd8453] hover:text-[#1b3c44] font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Guides
                    </button>

                    {/* Language Toggle - Only show if Bengali content exists */}
                    {hasBengaliContent && (
                        <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-md">
                            <button
                                onClick={() => setCurrentLanguage('en')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    currentLanguage === 'en'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Languages size={16} />
                                English
                            </button>
                            <button
                                onClick={() => setCurrentLanguage('bn')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all font-['Bengali'] ${
                                    currentLanguage === 'bn'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Languages size={16} />
                                বাংলা
                            </button>
                        </div>
                    )}
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* Image */}
                    <div className="aspect-video lg:aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                        {guide.imageUrl && guide.imageUrl !== '' && guide.imageUrl !== 'dummy.jpg' && guide.imageUrl !== '/images/dummy.jpg' ? (
                            <img
                                src={guide.imageUrl}
                                alt={guide.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                                <div className="text-center text-gray-600">
                                    <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-lg font-medium">No Image Available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                            currentLanguage === 'bn' ? "font-['Bengali']" : ''
                        }`}>
                            {currentLanguage === 'en' ? guide.title : (guide.titleBn || guide.title)}
                        </h1>
                        
                        <p className={`text-lg md:text-xl text-gray-700 mb-8 leading-relaxed ${
                            currentLanguage === 'bn' ? "font-['Bengali']" : ''
                        }`}>
                            {currentLanguage === 'en' ? guide.description : (guide.descriptionBn || guide.description)}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-[#cd8453]" size={24} />
                                <span className="text-lg font-medium">{guide.division}</span>
                            </div>
                            
                            {guide.category && (
                                <div className="flex items-center gap-3">
                                    <Tag className="text-[#cd8453]" size={24} />
                                    <span className="text-lg font-medium">{guide.category}</span>
                                </div>
                            )}

                            {guide.itinerary && guide.itinerary.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-[#cd8453]" size={24} />
                                    <span className="text-lg font-medium">
                                        {guide.itinerary.length} Step{guide.itinerary.length !== 1 ? 's' : ''} Journey
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section - New flexible format */}
                {((currentLanguage === 'en' && guide.content && guide.content.length > 0) ||
                  (currentLanguage === 'bn' && guide.contentBn && guide.contentBn.length > 0)) && (
                    <div className={`mb-16 ${currentLanguage === 'bn' ? "font-['Bengali']" : ''}`}>
                        <ContentRenderer 
                            blocks={currentLanguage === 'en' ? guide.content! : guide.contentBn!} 
                        />
                    </div>
                )}

                {/* Itinerary Section - Legacy support */}
                {!guide.content && guide.itinerary && guide.itinerary.length > 0 && (
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                Travel Itinerary
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Follow this step-by-step guide to make your journey smooth and memorable
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <Timeline steps={guide.itinerary} />
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="max-w-2xl mx-auto px-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Ready for Your Adventure?
                        </h3>
                        <p className="text-gray-600 mb-8">
                            Start planning your trip today and create unforgettable memories.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44] transition-colors font-medium">
                                Book Now
                            </button>
                            <button 
                                onClick={() => router.push('/guides')}
                                className="px-8 py-3 border-2 border-[#cd8453] text-[#cd8453] rounded-lg hover:bg-[#cd8453] hover:text-white transition-colors font-medium"
                            >
                                Explore More Guides
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
