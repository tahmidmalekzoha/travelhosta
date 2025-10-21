"use client";

import { FunctionComponent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings, Menu } from 'lucide-react';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

/**
 * Admin header component with user info and quick actions
 */
const AdminHeader: FunctionComponent<AdminHeaderProps> = ({ onMenuClick }) => {
    const { user, profile } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={20} className="text-gray-600" />
                    </button>
                    
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-[#1b3c44]">
                            Admin Dashboard
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Notifications */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                    </button>

                    {/* Settings */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-[#1b3c44]">
                                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                            {(profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
