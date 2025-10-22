"use client";

import { FunctionComponent, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for performance - loads only when needed
const CategoriesManagement = dynamic(() => import('../../../components/admin/CategoriesManagement'), {
    loading: () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading categories management...</p>
            </div>
        </div>
    ),
    ssr: false
});

/**
 * Admin categories management page
 * Uses dynamic import for better performance
 */
const CategoriesPage: FunctionComponent = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories management...</p>
                </div>
            </div>
        }>
            <CategoriesManagement />
        </Suspense>
    );
};

export default CategoriesPage;
