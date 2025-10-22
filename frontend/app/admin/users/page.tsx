"use client";

import { FunctionComponent, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for performance - loads only when needed
const UsersManagement = dynamic(() => import('../../../components/admin/UsersManagement'), {
    loading: () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users management...</p>
            </div>
        </div>
    ),
    ssr: false
});

/**
 * Admin page for managing users
 * Uses dynamic import for better performance
 */
const UsersManagementPage: FunctionComponent = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users management...</p>
                </div>
            </div>
        }>
            <UsersManagement />
        </Suspense>
    );
};

export default UsersManagementPage;
