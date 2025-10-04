"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

/**
 * Admin layout component that wraps all admin pages
 * Handles authentication check and redirects unauthorized users
 * Provides sidebar navigation and header
 */
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect non-admin users to sign in page
    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/signin?redirect=/admin');
        }
    }, [user, isLoading, router]);

    // Memoize sidebar toggle handlers
    const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
    const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f2eee9]">
                <div className="text-xl text-[#1b3c44]">Loading...</div>
            </div>
        );
    }

    // Prevent flash of content for unauthorized users
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex h-screen bg-[#f2eee9] overflow-hidden">
            <AdminSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={handleSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
