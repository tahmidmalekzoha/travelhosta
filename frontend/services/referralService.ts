/**
 * Referral Service
 * Handles all referral-related operations
 */

import { supabase } from '@/utils/supabase';

export interface ReferralStats {
    success: boolean;
    referralCode: string;
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
}

/**
 * Get or create referral code for current user
 */
export async function getUserReferralCode(): Promise<{ success: boolean; referralCode?: string; message?: string }> {
    try {
        const { data, error } = await supabase.rpc('get_user_referral_code');

        if (error || !data) {
            console.error('Error getting referral code:', error);
            return {
                success: false,
                message: 'Failed to get referral code'
            };
        }

        const result = data as { success: boolean; referralCode?: string; message?: string };
        return result;
    } catch (error) {
        console.error('Unexpected error getting referral code:', error);
        return {
            success: false,
            message: 'An unexpected error occurred'
        };
    }
}

/**
 * Apply referral code for current user
 */
export async function applyReferralCode(referralCode: string): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase.rpc('apply_referral_code', {
            p_referral_code: referralCode
        });

        if (error || !data) {
            console.error('Error applying referral code:', error);
            return {
                success: false,
                message: 'Failed to apply referral code'
            };
        }

        const result = data as { success: boolean; message: string };
        return result;
    } catch (error) {
        console.error('Unexpected error applying referral code:', error);
        return {
            success: false,
            message: 'An unexpected error occurred'
        };
    }
}

/**
 * Get referral statistics for current user
 */
export async function getReferralStats(): Promise<ReferralStats> {
    try {
        const { data, error } = await supabase.rpc('get_referral_stats');

        if (error || !data) {
            console.error('Error getting referral stats:', error);
            return {
                success: false,
                referralCode: '',
                totalReferrals: 0,
                pendingReferrals: 0,
                completedReferrals: 0
            };
        }

        const result = data as unknown as ReferralStats;
        return result;
    } catch (error) {
        console.error('Unexpected error getting referral stats:', error);
        return {
            success: false,
            referralCode: '',
            totalReferrals: 0,
            pendingReferrals: 0,
            completedReferrals: 0
        };
    }
}

/**
 * Get referral link for sharing
 */
export function getReferralLink(referralCode: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/signup?ref=${referralCode}`;
}
