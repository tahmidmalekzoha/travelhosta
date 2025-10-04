"use client";

import { FunctionComponent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image, BookOpen, Users, Tags, Star, LogOut, MapPin, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Admin sidebar navigation component
 */
const AdminSidebar: FunctionComponent<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/hero', label: 'Hero Section', icon: Image },
        { path: '/admin/guides', label: 'Guides', icon: BookOpen },
        { path: '/admin/featured', label: 'Featured Guides', icon: Star },
        { path: '/admin/categories', label: 'Categories', icon: Tags },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/itinerary-demo', label: 'Itinerary Demo', icon: MapPin },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === path;
        }
        return pathname?.startsWith(path);
    };

    const handleLinkClick = () => {
        // Close sidebar on mobile when a link is clicked
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-[#1b3c44] text-white flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo/Brand */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold">TravelHosta</h1>
                        <p className="text-xs sm:text-sm text-white/60 mt-1">Admin Panel</p>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
                    <ul className="space-y-1 sm:space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        onClick={handleLinkClick}
                                        className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                                            active
                                                ? 'bg-[#cd8453] text-white'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={18} className="flex-shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-3 sm:p-4 border-t border-white/10">
                    <button
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm sm:text-base"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
