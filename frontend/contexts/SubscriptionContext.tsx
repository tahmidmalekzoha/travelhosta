"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { UserSubscription } from '@/services/subscriptionService';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuth } from './AuthContext';
import { logger } from '../utils/logger';

interface SubscriptionContextType {
    subscription: UserSubscription | null;
    hasActiveSubscription: boolean;
    isLoading: boolean;
    refreshSubscription: () => Promise<void>;
    canAccessGuide: (guideId: number) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading: authLoading } = useAuth();
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadSubscription = useCallback(async () => {
        if (!user) {
            setSubscription(null);
            setHasActiveSubscription(false);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const result = await subscriptionService.checkUserSubscription(user.id);
            
            setHasActiveSubscription(result.hasSubscription);
            setSubscription(result.subscription || null);
            
            logger.info('SubscriptionProvider.loadSubscription.success', {
                userId: user.id,
                hasSubscription: result.hasSubscription,
            });
        } catch (error) {
            logger.error('SubscriptionProvider.loadSubscription.error', error);
            setHasActiveSubscription(false);
            setSubscription(null);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            loadSubscription();
        }
    }, [user, authLoading, loadSubscription]);

    const refreshSubscription = useCallback(async () => {
        await loadSubscription();
    }, [loadSubscription]);

    const canAccessGuideCallback = useCallback(
        async (guideId: number): Promise<boolean> => {
            if (!user) {
                // Check if guide is featured (free for everyone including non-logged-in users)
                return await subscriptionService.isGuideFeatured(guideId);
            }

            return await subscriptionService.canAccessGuide(guideId, user.id);
        },
        [user]
    );

    const value = useMemo(
        () => ({
            subscription,
            hasActiveSubscription,
            isLoading,
            refreshSubscription,
            canAccessGuide: canAccessGuideCallback,
        }),
        [subscription, hasActiveSubscription, isLoading, refreshSubscription, canAccessGuideCallback]
    );

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
