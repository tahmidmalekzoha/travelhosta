"use client";

import { FunctionComponent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image, BookOpen, Users, Tags, Star, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Admin sidebar navigation component
 */
const AdminSidebar: FunctionComponent = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/hero', label: 'Hero Section', icon: Image },
        { path: '/admin/guides', label: 'Guides', icon: BookOpen },
        { path: '/admin/featured', label: 'Featured Guides', icon: Star },
        { path: '/admin/categories', label: 'Categories', icon: Tags },
        { path: '/admin/users', label: 'Users', icon: Users },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === path;
        }
        return pathname?.startsWith(path);
    };

    return (
        <aside className="w-64 bg-[#1b3c44] text-white flex flex-col">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold">TravelHosta</h1>
                <p className="text-sm text-white/60 mt-1">Admin Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        active
                                            ? 'bg-[#cd8453] text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
