"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import GuideCard from '@/components/GuideCard';
import SubscriptionPrompt from '@/components/SubscriptionPrompt';
import { fetchGuides, fetchFeaturedGuideIds } from '@/services/guidesService';
import type { GuideData } from '@/types';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const { hasActiveSubscription, subscription, isLoading: subLoading } = useSubscription();
    
    const [guides, setGuides] = useState<GuideData[]>([]);
    const [featuredGuideIds, setFeaturedGuideIds] = useState<number[]>([]);
    const [isLoadingGuides, setIsLoadingGuides] = useState(true);
    const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin');
        }
    }, [user, authLoading, router]);

    // Load guides and featured guide IDs
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingGuides(true);
                const [guidesData, featuredIds] = await Promise.all([
                    fetchGuides(),
                    fetchFeaturedGuideIds(),
                ]);
                setGuides(guidesData);
                setFeaturedGuideIds(featuredIds);
            } catch (error) {
                console.error('Error loading guides:', error);
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const featuredGuides = guides.filter((guide) => featuredGuideIds.includes(guide.id));
    const otherGuides = guides.filter((guide) => !featuredGuideIds.includes(guide.id));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user.email?.split('@')[0]}!
                    </h1>
                    <p className="text-emerald-100">
                        {hasActiveSubscription
                            ? 'Explore all our travel guides and plan your next adventure'
                            : 'Subscribe now to unlock all travel guides'}
                    </p>
                </div>
            </div>

            {/* Subscription Status */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className={`rounded-lg p-4 ${
                    hasActiveSubscription
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className={hasActiveSubscription ? 'text-emerald-600' : 'text-yellow-600'} size={24} />
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {hasActiveSubscription ? 'Premium Member' : 'Free Access'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {hasActiveSubscription
                                        ? 'You have lifetime access to all guides'
                                        : '4 featured guides available • Subscribe for full access'}
                                </p>
                            </div>
                        </div>
                        {!hasActiveSubscription && (
                            <button
                                onClick={() => setShowSubscriptionPrompt(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Subscribe Now
                            </button>
                        )}
                    </div>
                    {hasActiveSubscription && subscription && (
                        <div className="mt-3 pt-3 border-t border-emerald-200 flex gap-4 text-sm text-gray-600">
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

            {/* Guides Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {isLoadingGuides ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading guides...</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Guides */}
                        {featuredGuides.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="text-yellow-500" size={24} />
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Featured Guides
                                    </h2>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                        Always Free
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {featuredGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            isFeatured={true}
                                            isBlurred={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Other Guides */}
                        {otherGuides.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {hasActiveSubscription ? 'All Guides' : 'Premium Guides'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {otherGuides.map((guide) => (
                                        <GuideCard
                                            key={guide.id}
                                            guide={guide}
                                            isFeatured={false}
                                            isBlurred={!hasActiveSubscription}
                                            onClick={
                                                !hasActiveSubscription
                                                    ? () => setShowSubscriptionPrompt(true)
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {guides.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-600">No guides available yet.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
