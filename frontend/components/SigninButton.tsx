"use client";

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AnimatedButton from './shared/AnimatedButton';
import { Settings, ArrowRight } from 'lucide-react';

/**
 * Animated sign-in button with hover effects
 * Features sliding text animation and color transitions
 * Shows user info and admin link when logged in
 */
const SigninButton: FunctionComponent = () => {
    const router = useRouter();
    const { user, profile, signOut } = useAuth();

    const handleSignIn = () => {
        router.push('/signin');
    };

    const handleLogout = () => {
        signOut();
        router.push('/');
    };

    const handleAdminPanel = () => {
        router.push('/admin');
    };

    if (user && profile) {
        // Get display name - use full_name if available, otherwise use email
        const displayName = profile.full_name || user.email?.split('@')[0] || 'User';
        
        return (
            <div className="flex flex-col gap-2 items-end">
                <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg flex items-center gap-2 md:gap-3">
                    <div className="text-right">
                        <p className="text-xs md:text-sm font-semibold text-[#1b3c44]">{displayName}</p>
                        <p className="text-[10px] md:text-xs text-gray-600">{profile.role}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold text-sm md:text-base">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="flex gap-2">
                    {(profile.role === 'admin' || profile.role === 'superadmin') && (
                        <button
                            onClick={handleAdminPanel}
                            className="bg-[#cd8453] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-[#1b3c44] transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                        >
                            <Settings size={14} className="md:w-4 md:h-4" />
                            Admin
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 text-[#1b3c44] px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-gray-300 transition-colors text-xs md:text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AnimatedButton
            text="Sign In"
            onClick={handleSignIn}
            width="w-[180px] md:w-[240px] lg:w-[297px]"
            height="h-[60px] md:h-[76px] lg:h-[92px]"
            textSize="text-[28px] md:text-[38px] lg:text-[48px]"
            icon={<ArrowRight size={18} strokeWidth={2.5} className="md:w-6 md:h-6" />}
        />
    );
};

export default SigninButton;
