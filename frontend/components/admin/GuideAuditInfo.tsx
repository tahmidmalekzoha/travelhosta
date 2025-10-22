'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface GuideAuditInfoProps {
    guideId: number;
    className?: string;
}

interface GuideAuditData {
    creator_email: string | null;
    creator_username: string | null;
    creator_display_name: string | null;
    last_editor_email: string | null;
    last_editor_username: string | null;
    last_editor_display_name: string | null;
    created_at: string | null;
    last_edited_at: string | null;
}

const GuideAuditInfo: React.FC<GuideAuditInfoProps> = ({ guideId, className = '' }) => {
    const [auditData, setAuditData] = useState<GuideAuditData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAuditData();
    }, [guideId]);

    const fetchAuditData = async () => {
        try {
            setIsLoading(true);

            // Fetch guide with audit info directly from guides table with user profile joins
            const { data: guideData, error: guideError } = await supabase
                .from('guides')
                .select(`
                    created_at,
                    last_edited_at,
                    creator:user_profiles!guides_created_by_fkey(email, username, display_name),
                    editor:user_profiles!guides_last_edited_by_fkey(email, username, display_name)
                `)
                .eq('id', guideId)
                .single();

            if (guideError) {
                console.error('Error fetching guide audit data:', guideError);
                return;
            }

            // Transform the data to match expected structure
            const transformedData: GuideAuditData = {
                creator_email: guideData.creator?.email || null,
                creator_username: guideData.creator?.username || null,
                creator_display_name: guideData.creator?.display_name || null,
                last_editor_email: guideData.editor?.email || null,
                last_editor_username: guideData.editor?.username || null,
                last_editor_display_name: guideData.editor?.display_name || null,
                created_at: guideData.created_at,
                last_edited_at: guideData.last_edited_at,
            };

            setAuditData(transformedData);
        } catch (error) {
            console.error('Error in fetchAuditData:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className={`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
                <p className="text-gray-600 dark:text-gray-400">Loading audit information...</p>
            </div>
        );
    }

    if (!auditData) {
        return null;
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Audit Trail
            </h3>

            {/* Creator Info */}
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {auditData.creator_display_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Created by
                        </p>
                        <p className="text-base font-semibold text-green-700 dark:text-green-400">
                            {auditData.creator_display_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            @{auditData.creator_username || 'unknown'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDate(auditData.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Last Editor Info (if different from creator) */}
            {auditData.last_editor_username && 
             auditData.last_editor_username !== auditData.creator_username && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {auditData.last_editor_display_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Last edited by
                            </p>
                            <p className="text-base font-semibold text-blue-700 dark:text-blue-400">
                                {auditData.last_editor_display_name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                @{auditData.last_editor_username || 'unknown'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {formatDate(auditData.last_edited_at)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Note about simplified audit system */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    ℹ️ This guide tracks creator and last editor information. Full change history has been simplified for better performance.
                </p>
            </div>
        </div>
    );
};

export default GuideAuditInfo;
