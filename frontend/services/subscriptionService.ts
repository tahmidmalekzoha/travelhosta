import { supabase } from '../utils/supabase';
import { logger } from '../utils/logger';
import { authService } from './authService';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface UserSubscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  subscribed_at: string | null;
  expires_at: string | null;
  payment_method: string | null;
  payment_transaction_id: string | null;
  payment_amount: number | null;
  payment_currency: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionCheckResponse {
  hasSubscription: boolean;
  subscription?: UserSubscription;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: UserSubscription;
  error?: string;
}

/**
 * Check if the current user has an active subscription
 */
export const checkUserSubscription = async (
  userId?: string
): Promise<SubscriptionCheckResponse> => {
  try {
    // Get current user if userId not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        logger.info('subscriptionService.checkUserSubscription.noUser');
        return { hasSubscription: false };
      }
      targetUserId = user.id;
    }

    // Call the database function to check subscription
    const { data, error } = await supabase.rpc('has_active_subscription', {
      p_user_id: targetUserId,
    });

    if (error) {
      logger.error('subscriptionService.checkUserSubscription.error', {
        code: error.code,
        message: error.message,
      });
      return { hasSubscription: false };
    }

    // If user has active subscription, fetch the details
    if (data) {
      const { data: subscription, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (fetchError) {
        logger.warn('subscriptionService.checkUserSubscription.fetchError', fetchError);
        return { hasSubscription: true }; // Still return true since DB function confirmed it
      }

      return {
        hasSubscription: true,
        subscription: subscription as UserSubscription,
      };
    }

    return { hasSubscription: false };
  } catch (error) {
    logger.error('subscriptionService.checkUserSubscription.unexpectedError', error);
    return { hasSubscription: false };
  }
};

/**
 * Get subscription details for a user
 */
export const getUserSubscription = async (
  userId?: string
): Promise<UserSubscription | null> => {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No subscription found
        return null;
      }
      logger.error('subscriptionService.getUserSubscription.error', {
        code: error.code,
        message: error.message,
      });
      return null;
    }

    return data as UserSubscription;
  } catch (error) {
    logger.error('subscriptionService.getUserSubscription.unexpectedError', error);
    return null;
  }
};

/**
 * Create or update a subscription (Admin only)
 */
export const upsertSubscription = async (
  userId: string,
  status: SubscriptionStatus,
  paymentDetails?: {
    method?: string;
    transactionId?: string;
    amount?: number;
  }
): Promise<SubscriptionResponse> => {
  try {
    const { data, error } = await supabase.rpc('upsert_subscription', {
      p_user_id: userId,
      p_status: status,
      p_payment_method: paymentDetails?.method || null,
      p_payment_transaction_id: paymentDetails?.transactionId || null,
      p_payment_amount: paymentDetails?.amount || 149.0,
      p_expires_at: null, // Lifetime subscription
    });

    if (error) {
      logger.error('subscriptionService.upsertSubscription.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: error.message || 'Failed to update subscription',
      };
    }

    const result = data as { success: boolean; error?: string; subscription_id?: string };

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update subscription',
      };
    }

    // Fetch the updated subscription
    const subscription = await getUserSubscription(userId);

    return {
      success: true,
      subscription: subscription || undefined,
    };
  } catch (error) {
    logger.error('subscriptionService.upsertSubscription.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating subscription',
    };
  }
};

/**
 * Activate a subscription (typically after payment confirmation)
 */
export const activateSubscription = async (
  userId: string,
  paymentDetails: {
    method: string;
    transactionId: string;
    amount?: number;
  }
): Promise<SubscriptionResponse> => {
  return upsertSubscription(userId, 'active', paymentDetails);
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (userId: string): Promise<SubscriptionResponse> => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('subscriptionService.cancelSubscription.error', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: 'Failed to cancel subscription',
      };
    }

    return {
      success: true,
      subscription: data as UserSubscription,
    };
  } catch (error) {
    logger.error('subscriptionService.cancelSubscription.unexpectedError', error);
    return {
      success: false,
      error: 'An unexpected error occurred while canceling subscription',
    };
  }
};

/**
 * Get all subscriptions (Admin only)
 */
export const getAllSubscriptions = async (): Promise<UserSubscription[]> => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('subscriptionService.getAllSubscriptions.error', {
        code: error.code,
        message: error.message,
      });
      return [];
    }

    return (data as UserSubscription[]) || [];
  } catch (error) {
    logger.error('subscriptionService.getAllSubscriptions.unexpectedError', error);
    return [];
  }
};

/**
 * Check if a guide is featured (free for all users)
 */
export const isGuideFeatured = async (guideId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('featured_guides')
      .select('guide_id')
      .eq('guide_id', guideId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found = not featured
        return false;
      }
      logger.error('subscriptionService.isGuideFeatured.error', error);
      return false;
    }

    return Boolean(data);
  } catch (error) {
    logger.error('subscriptionService.isGuideFeatured.unexpectedError', error);
    return false;
  }
};

/**
 * Check if user can access a guide
 * Returns true if:
 * - User is an admin or superadmin
 * - User has active subscription
 * - Guide is featured (free for all)
 */
export const canAccessGuide = async (
  guideId: number,
  userId?: string
): Promise<boolean> => {
  try {
    // Check if guide is featured first (free for everyone)
    const isFeatured = await isGuideFeatured(guideId);
    if (isFeatured) {
      return true;
    }

    // If userId is provided, check if user is admin
    if (userId) {
      const profile = await authService.getUserProfile(userId);
      if (profile && (profile.role === 'admin' || profile.role === 'superadmin')) {
        return true;
      }
    }

    // Check if user has subscription
    const { hasSubscription } = await checkUserSubscription(userId);
    return hasSubscription;
  } catch (error) {
    logger.error('subscriptionService.canAccessGuide.unexpectedError', error);
    return false;
  }
};

export const subscriptionService = {
  checkUserSubscription,
  getUserSubscription,
  upsertSubscription,
  activateSubscription,
  cancelSubscription,
  getAllSubscriptions,
  isGuideFeatured,
  canAccessGuide,
};

export default subscriptionService;
