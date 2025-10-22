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
                <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#1b3c44]">{displayName}</p>
                        <p className="text-xs text-gray-600">{profile.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="flex gap-2">
                    {(profile.role === 'admin' || profile.role === 'superadmin') && (
                        <button
                            onClick={handleAdminPanel}
                            className="bg-[#cd8453] text-white px-4 py-2 rounded-full hover:bg-[#1b3c44] transition-colors flex items-center gap-2"
                        >
                            <Settings size={16} />
                            Admin
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 text-[#1b3c44] px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
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
            width="w-[297px]"
            height="h-[92px]"
            textSize="text-[48px]"
            icon={<ArrowRight size={24} strokeWidth={2.5} />}
        />
    );
};

export default SigninButton;
