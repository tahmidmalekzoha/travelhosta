/**
 * Guide Audit Service
 * Centralized service for guide audit operations
 * Handles fetching and managing guide audit information
 */

import { supabase } from '@/utils/supabase';
import { GuideDataWithAudit, GuideAuditLogEntry } from '@/types';
import { handleNetworkError, AppError, ErrorType } from '@/utils/errorHandling';
import { logger, logApiCall, logApiResponse } from '@/utils/logger';
import { AUDIT_ACTIONS } from '@/constants';

/**
 * Fetch guides with audit information
 * Joins guides table with user_profiles for creator and editor info
 */
export const fetchGuidesWithAudit = async (): Promise<GuideDataWithAudit[]> => {
  logApiCall('GET', '/guides (with audit)');

  try {
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        creator:user_profiles!guides_created_by_fkey(email, username, display_name),
        editor:user_profiles!guides_last_edited_by_fkey(email, username, display_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching guides with audit info:', error);
      throw handleNetworkError(error, '/guides (with audit)');
    }

    if (!data) {
      return [];
    }

    // Transform to match GuideDataWithAudit type
    const transformedData: GuideDataWithAudit[] = data.map((guide: any) => ({
      id: guide.id,
      title: guide.title,
      description: guide.description,
      division: guide.division,
      category: guide.category,
      imageUrl: guide.image_url,
      tags: guide.tags,
      titleBn: guide.title_bn,
      descriptionBn: guide.description_bn,
      content: guide.content,
      contentBn: guide.content_bn,
      itinerary: guide.itinerary,
      created_by: guide.created_by,
      last_edited_by: guide.last_edited_by,
      last_edited_at: guide.last_edited_at,
      created_at: guide.created_at,
      updated_at: guide.updated_at,
      creator_email: guide.creator?.email || null,
      creator_username: guide.creator?.username || null,
      creator_display_name: guide.creator?.display_name || null,
      last_editor_email: guide.editor?.email || null,
      last_editor_username: guide.editor?.username || null,
      last_editor_display_name: guide.editor?.display_name || null,
    }));

    logApiResponse('/guides (with audit)', 200, { count: transformedData.length });
    return transformedData;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw handleNetworkError(error, '/guides (with audit)');
  }
};

/**
 * Fetch a single guide with audit information
 */
export const fetchGuideWithAudit = async (
  guideId: number
): Promise<GuideDataWithAudit | null> => {
  logApiCall('GET', `/guides/${guideId} (with audit)`);

  try {
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        creator:user_profiles!guides_created_by_fkey(email, username, display_name),
        editor:user_profiles!guides_last_edited_by_fkey(email, username, display_name)
      `)
      .eq('id', guideId)
      .single();

    if (error) {
      logger.error(`Error fetching guide ${guideId} with audit info:`, error);
      throw handleNetworkError(error, `/guides/${guideId} (with audit)`);
    }

    if (!data) {
      return null;
    }

    const transformed: GuideDataWithAudit = {
      id: data.id,
      title: data.title,
      description: data.description,
      division: data.division,
      category: data.category,
      imageUrl: data.image_url,
      tags: data.tags ?? undefined,
      titleBn: data.title_bn ?? undefined,
      descriptionBn: data.description_bn ?? undefined,
      content: data.content as any ?? undefined,
      contentBn: data.content_bn as any ?? undefined,
      itinerary: data.itinerary as any ?? undefined,
      created_by: data.created_by ?? undefined,
      last_edited_by: data.last_edited_by ?? undefined,
      last_edited_at: data.last_edited_at ?? undefined,
      created_at: data.created_at ?? undefined,
      updated_at: data.updated_at ?? undefined,
      creator_email: data.creator?.email || null,
      creator_username: data.creator?.username || null,
      creator_display_name: data.creator?.display_name || null,
      last_editor_email: data.editor?.email || null,
      last_editor_username: data.editor?.username || null,
      last_editor_display_name: data.editor?.display_name || null,
    };

    logApiResponse(`/guides/${guideId} (with audit)`, 200);
    return transformed;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw handleNetworkError(error, `/guides/${guideId} (with audit)`);
  }
};

/**
 * Fetch audit log entries for a specific guide
 */
export const fetchGuideAuditLog = async (
  guideId: number
): Promise<GuideAuditLogEntry[]> => {
  logApiCall('GET', `/guides/${guideId}/audit-log`);

  try {
    const { data, error } = await supabase
      .from('guide_audit_log')
      .select('*')
      .eq('guide_id', guideId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error(`Error fetching audit log for guide ${guideId}:`, error);
      throw handleNetworkError(error, `/guides/${guideId}/audit-log`);
    }

    logApiResponse(`/guides/${guideId}/audit-log`, 200, { count: data?.length || 0 });
    return (data as any) || [];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw handleNetworkError(error, `/guides/${guideId}/audit-log`);
  }
};

/**
 * Fetch recent audit activity across all guides
 */
export const fetchRecentAuditActivity = async (
  limit: number = 50
): Promise<GuideAuditLogEntry[]> => {
  logApiCall('GET', '/guides/audit-log/recent');

  try {
    const { data, error } = await supabase
      .from('guide_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Error fetching recent audit activity:', error);
      throw handleNetworkError(error, '/guides/audit-log/recent');
    }

    logApiResponse('/guides/audit-log/recent', 200, { count: data?.length || 0 });
    return (data as any) || [];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw handleNetworkError(error, '/guides/audit-log/recent');
  }
};

/**
 * Fetch audit activity for a specific user
 */
export const fetchUserAuditActivity = async (
  userId: string,
  limit: number = 50
): Promise<GuideAuditLogEntry[]> => {
  logApiCall('GET', `/users/${userId}/audit-activity`);

  try {
    const { data, error } = await supabase
      .from('guide_audit_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error(`Error fetching audit activity for user ${userId}:`, error);
      throw handleNetworkError(error, `/users/${userId}/audit-activity`);
    }

    logApiResponse(`/users/${userId}/audit-activity`, 200, { count: data?.length || 0 });
    return (data as any) || [];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw handleNetworkError(error, `/users/${userId}/audit-activity`);
  }
};

/**
 * Get audit statistics
 */
export interface AuditStatistics {
  totalActions: number;
  actionsByType: Record<string, number>;
  topContributors: {
    userId: string;
    username: string;
    displayName: string;
    actionCount: number;
  }[];
  recentActivity: GuideAuditLogEntry[];
}

export const fetchAuditStatistics = async (
  days: number = 30
): Promise<AuditStatistics> => {
  logApiCall('GET', `/audit/statistics?days=${days}`);

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('guide_audit_log')
      .select('*')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching audit statistics:', error);
      throw handleNetworkError(error, '/audit/statistics');
    }

    if (!data) {
      return {
        totalActions: 0,
        actionsByType: {},
        topContributors: [],
        recentActivity: [],
      };
    }

    // Calculate statistics
    const actionsByType: Record<string, number> = {};
    const userActions: Record<string, { count: number; username: string; displayName: string }> = {};

    data.forEach((entry: any) => {
      // Count by action type
      actionsByType[entry.action] = (actionsByType[entry.action] || 0) + 1;

      // Count by user
      if (entry.user_id) {
        if (!userActions[entry.user_id]) {
          userActions[entry.user_id] = {
            count: 0,
            username: entry.user_username || 'Unknown',
            displayName: entry.user_display_name || 'Unknown User',
          };
        }
        userActions[entry.user_id].count++;
      }
    });

    // Get top contributors
    const topContributors = Object.entries(userActions)
      .map(([userId, data]) => ({
        userId,
        username: data.username,
        displayName: data.displayName,
        actionCount: data.count,
      }))
      .sort((a, b) => b.actionCount - a.actionCount)
      .slice(0, 10);

    const statistics: AuditStatistics = {
      totalActions: data.length,
      actionsByType,
      topContributors,
      recentActivity: data.slice(0, 20) as any,
    };

    logApiResponse('/audit/statistics', 200);
    return statistics;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw handleNetworkError(error, '/audit/statistics');
  }
};

/**
 * Check if user has edit permission for a guide
 */
export const checkEditPermission = async (
  guideId: number,
  userId: string
): Promise<boolean> => {
  try {
    // Fetch user profile to check role
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return false;
    }

    // Admins and superadmins can edit any guide
    if (profile.role === 'admin' || profile.role === 'superadmin') {
      return true;
    }

    // Regular users can only edit their own guides
    const { data: guide } = await supabase
      .from('guides')
      .select('created_by')
      .eq('id', guideId)
      .single();

    return guide?.created_by === userId;
  } catch (error) {
    logger.error(`Error checking edit permission for guide ${guideId}:`, error);
    return false;
  }
};
