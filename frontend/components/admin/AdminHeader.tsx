"use client";

import { FunctionComponent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings } from 'lucide-react';

/**
 * Admin header component with user info and quick actions
 */
const AdminHeader: FunctionComponent = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b3c44]">
                        Admin Dashboard
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell size={20} className="text-gray-600" />
                    </button>

                    {/* Settings */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings size={20} className="text-gray-600" />
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-medium text-[#1b3c44]">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
