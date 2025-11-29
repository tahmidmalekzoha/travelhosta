"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Gift, Copy, Check, Users, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { getReferralStats } from '@/services/referralService';

interface ReferralStats {
    referralCode: string;
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
}

export default function EarnRewardsPage() {
    const router = useRouter();
    const { user, profile, isLoading: authLoading } = useAuth();
    const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin');
        }
    }, [user, authLoading, router]);

    // Load referral stats
    useEffect(() => {
        const loadReferralStats = async () => {
            if (!user) return;
            
            try {
                setIsLoading(true);
                const stats = await getReferralStats();
                setReferralStats(stats);
            } catch (error) {
                console.error('Error loading referral stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadReferralStats();
        }
    }, [user]);

    const handleCopyReferralLink = () => {
        if (!referralStats?.referralCode) return;
        
        const referralLink = `${window.location.origin}/signup?ref=${referralStats.referralCode}`;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyUsername = () => {
        if (!referralStats?.referralCode) return;
        
        navigator.clipboard.writeText(referralStats.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
            <div className="bg-gradient-to-r from-[#1b3c44] to-[#cd8453] text-white py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 mb-6 text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <Gift size={40} />
                        <h1 className="text-4xl font-bold">
                            Earn Rewards
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg">
                        Share TravelHosta with friends and earn rewards together!
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* How It Works */}
                <div className="bg-white rounded-[24px] p-8 shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#cd8453]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-[#cd8453]" size={32} />
                            </div>
                            <h3 className="font-bold text-[#1b3c44] mb-2">1. Share Your Code</h3>
                            <p className="text-sm text-[#1b3c44]/70">
                                Share your unique referral username with friends and family
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#cd8453]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="text-[#cd8453]" size={32} />
                            </div>
                            <h3 className="font-bold text-[#1b3c44] mb-2">2. They Sign Up</h3>
                            <p className="text-sm text-[#1b3c44]/70">
                                Your friends create an account using your referral code
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#cd8453]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="text-[#cd8453]" size={32} />
                            </div>
                            <h3 className="font-bold text-[#1b3c44] mb-2">3. Earn Rewards</h3>
                            <p className="text-sm text-[#1b3c44]/70">
                                Both you and your friend receive exclusive benefits
                            </p>
                        </div>
                    </div>
                </div>

                {/* Your Referral Code */}
                <div className="bg-white rounded-[24px] p-8 shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">Your Referral Code</h2>
                    
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cd8453] mx-auto"></div>
                        </div>
                    ) : referralStats ? (
                        <>
                            {/* Referral Username */}
                            <div className="bg-gradient-to-r from-[#cd8453]/10 to-[#1b3c44]/10 rounded-[20px] p-6 mb-6">
                                <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide mb-2 block">
                                    Your Referral Username
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-white rounded-[16px] px-4 py-3 font-mono text-xl font-bold text-[#cd8453]">
                                        @{referralStats.referralCode}
                                    </div>
                                    <button
                                        onClick={handleCopyUsername}
                                        className="flex items-center gap-2 px-4 py-3 bg-[#1b3c44] hover:bg-[#2a5561] text-white rounded-[16px] transition-colors"
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                </div>
                                <p className="text-sm text-[#1b3c44]/60 mt-3">
                                    Share this username as your referral code
                                </p>
                            </div>

                            {/* Referral Link */}
                            <div className="bg-[#f2eee9] rounded-[20px] p-6">
                                <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide mb-2 block">
                                    Or Share This Link
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralStats.referralCode}`}
                                        className="flex-1 bg-white rounded-[16px] px-4 py-3 text-sm text-[#1b3c44] border border-[#1b3c44]/10"
                                    />
                                    <button
                                        onClick={handleCopyReferralLink}
                                        className="flex items-center gap-2 px-4 py-3 bg-[#cd8453] hover:bg-[#b8754a] text-white rounded-[16px] transition-colors"
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-[#1b3c44]/60">
                            No referral code available
                        </div>
                    )}
                </div>

                {/* Referral Stats */}
                {referralStats && (
                    <div className="bg-white rounded-[24px] p-8 shadow-lg">
                        <h2 className="text-2xl font-bold text-[#1b3c44] mb-6">Your Stats</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="bg-[#f2eee9] rounded-[16px] p-6 text-center">
                                <div className="text-3xl font-bold text-[#cd8453] mb-2">
                                    {referralStats.totalReferrals}
                                </div>
                                <div className="text-sm text-[#1b3c44]/70 font-semibold">
                                    Total Referrals
                                </div>
                            </div>
                            <div className="bg-[#f2eee9] rounded-[16px] p-6 text-center">
                                <div className="text-3xl font-bold text-[#1b3c44] mb-2">
                                    {referralStats.completedReferrals}
                                </div>
                                <div className="text-sm text-[#1b3c44]/70 font-semibold">
                                    Completed
                                </div>
                            </div>
                            <div className="bg-[#f2eee9] rounded-[16px] p-6 text-center">
                                <div className="text-3xl font-bold text-[#1b3c44]/60 mb-2">
                                    {referralStats.pendingReferrals}
                                </div>
                                <div className="text-sm text-[#1b3c44]/70 font-semibold">
                                    Pending
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rewards Info */}
                <div className="mt-8 bg-gradient-to-r from-[#cd8453]/10 to-[#1b3c44]/10 rounded-[24px] p-8 border border-[#cd8453]/20">
                    <div className="flex items-start gap-4">
                        <Gift className="text-[#cd8453] flex-shrink-0" size={32} />
                        <div>
                            <h3 className="font-bold text-[#1b3c44] text-lg mb-2">
                                Rewards Coming Soon!
                            </h3>
                            <p className="text-[#1b3c44]/70">
                                We're working on exciting rewards for our most active referrers. 
                                Keep sharing and track your progress here. Stay tuned for updates!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
