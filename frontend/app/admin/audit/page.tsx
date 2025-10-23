'use client';

import { FunctionComponent, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface GuideInfo {
    id: number;
    title: string;
    created_at: string | null;
    created_by: string | null;
    last_edited_by: string | null;
    last_edited_at: string | null;
    creator_display_name?: string;
    creator_username?: string;
    editor_display_name?: string;
    editor_username?: string;
}

interface RawGuideData {
    id: number;
    title: string;
    created_at: string | null;
    created_by: string | null;
    last_edited_by: string | null;
    last_edited_at: string | null;
    creator?: {
        display_name: string | null;
        username: string | null;
    } | null;
    editor?: {
        display_name: string | null;
        username: string | null;
    } | null;
}

const AuditPage: FunctionComponent = () => {
    const [guides, setGuides] = useState<GuideInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        const { data } = await supabase
            .from('guides')
            .select(`
                id, 
                title, 
                created_at, 
                created_by, 
                last_edited_by, 
                last_edited_at,
                creator:user_profiles!guides_created_by_fkey(display_name, username),
                editor:user_profiles!guides_last_edited_by_fkey(display_name, username)
            `)
            .order('created_at', { ascending: false });
        
        if (data) {
            const transformed = data.map((guide: RawGuideData) => ({
                id: guide.id,
                title: guide.title,
                created_at: guide.created_at,
                created_by: guide.created_by,
                last_edited_by: guide.last_edited_by,
                last_edited_at: guide.last_edited_at,
                creator_display_name: guide.creator?.display_name || 'Unknown',
                creator_username: guide.creator?.username || 'unknown',
                editor_display_name: guide.editor?.display_name || undefined,
                editor_username: guide.editor?.username || undefined,
            }));
            setGuides(transformed);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1b3c44]">Guide Activity</h1>
                <p className="text-gray-600 mt-1">Track guide creation and edits</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guide</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Edited By</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Edited</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {guides.map((guide) => (
                            <tr key={guide.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{guide.title}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div>
                                        <div className="font-medium text-gray-900">{guide.creator_display_name}</div>
                                        <div className="text-xs text-gray-500">@{guide.creator_username}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {guide.created_at ? new Date(guide.created_at).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {guide.editor_display_name ? (
                                        <div>
                                            <div className="font-medium text-gray-900">{guide.editor_display_name}</div>
                                            <div className="text-xs text-gray-500">@{guide.editor_username}</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {guide.last_edited_at ? new Date(guide.last_edited_at).toLocaleDateString() : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditPage;
