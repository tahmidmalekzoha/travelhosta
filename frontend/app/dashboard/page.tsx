"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import GuideCard from '@/components/GuideCard';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';
import { getBookmarkedGuides } from '@/services/bookmarksService';
import type { GuideData } from '@/types';
import { Bookmark, Clock, TrendingUp, User, Gift, ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { hasActiveSubscription, subscription, isLoading: subLoading } = useSubscription();
    
    const [bookmarkedGuides, setBookmarkedGuides] = useState<GuideData[]>([]);
    const [isLoadingGuides, setIsLoadingGuides] = useState(true);
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin');
        }
    }, [user, authLoading, router]);

    // Load bookmarked guides
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingGuides(true);
                const bookmarks = await getBookmarkedGuides();
                setBookmarkedGuides(bookmarks);
            } catch (error) {
                console.error('Error loading bookmarked guides:', error);
            } finally {
                setIsLoadingGuides(false);
            }
        };

        if (user) {
            loadData();
        }
    }, [user]);

    // Show subscription prompt initially for non-subscribed users
    useEffect(() => {
        if (!subLoading && !hasActiveSubscription) {
            setShowSubscriptionPrompt(true);
        }
    }, [hasActiveSubscription, subLoading]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f1] via-[#f2eee9] to-[#ede8e0]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd8453] mx-auto"></div>
                    <p className="mt-4 text-[#1b3c44]/70 font-['Schibsted_Grotesk']">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#f2eee9] to-[#ede8e0] font-['Schibsted_Grotesk']">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1b3c44] to-[#cd8453] text-white py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <div className="w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Back Button */}
                            <button 
                                onClick={() => router.push('/')} 
                                className="group relative inline-flex items-center rounded-full bg-white/10 hover:bg-white/20 border border-white/30 h-[40px] sm:h-[44px] md:h-[48px] lg:h-[56px] transition-all duration-200 hover:-translate-x-1 backdrop-blur-sm flex-shrink-0"
                            >
                                <span className="absolute left-[5px] sm:left-[6px] md:left-[6px] lg:left-[7px] top-1/2 -translate-y-1/2 flex h-[32px] w-[32px] sm:h-[35px] sm:w-[35px] md:h-[38px] md:w-[38px] lg:h-[44px] lg:w-[44px] items-center justify-center rounded-full bg-white text-[#1b3c44]">
                                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5" strokeWidth={2.5} />
                                </span>
                                <span className="font-['Schibsted_Grotesk'] font-normal text-[14px] sm:text-[16px] md:text-[18px] lg:text-[24px] text-white ml-[40px] mr-[10px] sm:ml-[44px] sm:mr-[10px] md:ml-[48px] md:mr-[12px] lg:ml-[56px] lg:mr-[16px]">Back</span>
                            </button>
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    Welcome back, {user.email?.split('@')[0]}!
                                </h1>
                                <p className="text-white/80">
                                    Your bookmarked travel guides
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.push('/rewards')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-[16px] transition-all duration-300 backdrop-blur-sm"
                            >
                                <Gift size={20} />
                                <span className="font-semibold">Earn Rewards</span>
                            </button>
                            <button
                                onClick={() => router.push('/profile')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-[16px] transition-all duration-300 backdrop-blur-sm"
                            >
                                <User size={20} />
                                <span className="font-semibold">View Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Status */}
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6">
                <div className={`rounded-[20px] md:rounded-[24px] p-6 shadow-lg ${
                    hasActiveSubscription
                        ? 'bg-white border border-[#cd8453]/20'
                        : 'bg-white border border-[#cd8453]/30'
                }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Bookmark className={hasActiveSubscription ? 'text-[#cd8453]' : 'text-[#1b3c44]'} size={24} />
                            <div>
                                <h3 className="font-bold text-[#1b3c44]">
                                    {hasActiveSubscription ? 'Premium Member' : 'Free Access'}
                                </h3>
                                <p className="text-sm text-[#1b3c44]/70">
                                    {hasActiveSubscription
                                        ? 'You have lifetime access to all guides'
                                        : 'Subscribe for full access to bookmark and save guides'}
                                </p>
                            </div>
                        </div>
                        {!hasActiveSubscription && (
                            <button
                                onClick={() => setShowSubscriptionPrompt(true)}
                                className="bg-gradient-to-r from-[#1b3c44] to-[#cd8453] hover:shadow-xl text-white font-bold py-2.5 px-5 rounded-[16px] transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                Subscribe Now
                            </button>
                        )}
                    </div>
                    {hasActiveSubscription && subscription && (
                        <div className="mt-3 pt-3 border-t border-[#1b3c44]/10 flex flex-wrap gap-4 text-sm text-[#1b3c44]/70">
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>
                                    Since {new Date(subscription.subscribed_at || subscription.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {subscription.payment_method && (
                                <div className="flex items-center gap-1">
                                    <TrendingUp size={16} />
                                    <span>Paid via {subscription.payment_method}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Subscription Prompt Modal */}
            {showSubscriptionPrompt && !hasActiveSubscription && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <SubscriptionPrompt
                        onClose={() => setShowSubscriptionPrompt(false)}
                        showCloseButton={true}
                    />
                </div>
            )}

            {/* Bookmarked Guides Section */}
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
                {isLoadingGuides ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd8453] mx-auto"></div>
                        <p className="mt-4 text-[#1b3c44]/70">Loading your bookmarks...</p>
                    </div>
                ) : (
                    <>
                        {bookmarkedGuides.length > 0 ? (
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <Bookmark className="text-[#cd8453]" size={24} />
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#1b3c44]">
                                        Your Bookmarked Guides
                                    </h2>
                                    <span className="bg-[#cd8453]/20 text-[#1b3c44] text-xs font-bold px-3 py-1 rounded-full">
                                        {bookmarkedGuides.length} {bookmarkedGuides.length === 1 ? 'Guide' : 'Guides'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
                                    {bookmarkedGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            isFeatured={false}
                                            isBlurred={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4">
                                <div className="max-w-md mx-auto">
                                    <Bookmark className="text-[#1b3c44]/30 w-16 h-16 mx-auto mb-4" />
                                    <h3 className="text-xl md:text-2xl font-bold text-[#1b3c44] mb-2">
                                        No Bookmarks Yet
                                    </h3>
                                    <p className="text-[#1b3c44]/70 mb-6">
                                        Start exploring guides and bookmark your favorites to see them here.
                                    </p>
                                    <button
                                        onClick={() => router.push('/guides')}
                                        className="bg-gradient-to-r from-[#1b3c44] to-[#cd8453] hover:shadow-xl text-white font-bold py-3 px-6 rounded-[18px] transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        Explore Guides
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
