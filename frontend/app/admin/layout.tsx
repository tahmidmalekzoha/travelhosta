"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { GuidesProvider } from '../../contexts/GuidesContext';
import { CategoriesProvider } from '../../contexts/CategoriesContext';
import { HeroProvider } from '../../contexts/HeroContext';
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
    const { user, profile, isLoading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Redirect non-admin users to sign in page
    useEffect(() => {
        if (!isLoading) {
            if (!user || !profile) {
                // No user or profile - redirect to signin
                router.push('/signin?redirect=/admin');
            } else if (profile.role !== 'admin') {
                // User exists but not admin - redirect to home
                router.push('/');
            }
        }
    }, [user, profile, isLoading, router]);

    // Memoize sidebar toggle handlers
    const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
    const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);
    const handleSidebarToggleCollapse = useCallback(() => setSidebarCollapsed(prev => !prev), []);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f2eee9]">
                <div className="text-xl text-[#1b3c44]">Loading...</div>
            </div>
        );
    }

    // Prevent flash of content for unauthorized users
    if (!user || !profile || profile.role !== 'admin') {
        return null;
    }

    return (
        <GuidesProvider>
            <CategoriesProvider>
                <HeroProvider>
                    <div className="flex h-screen bg-[#f2eee9] overflow-hidden">
                        <AdminSidebar 
                            isOpen={sidebarOpen} 
                            onClose={handleSidebarClose}
                            isCollapsed={sidebarCollapsed}
                            onToggleCollapse={handleSidebarToggleCollapse}
                        />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <AdminHeader onMenuClick={handleSidebarOpen} />
                            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                                {children}
                            </main>
                        </div>
                    </div>
                </HeroProvider>
            </CategoriesProvider>
        </GuidesProvider>
    );
}
