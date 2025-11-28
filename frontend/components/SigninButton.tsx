"use client";

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import AnimatedButton from './shared/AnimatedButton';
import { Settings, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';

/**
 * Animated sign-in button with hover effects
 * Features sliding text animation and color transitions
 * Shows user info, dashboard/admin link, and subscription status when logged in
 */
const SigninButton: FunctionComponent = () => {
    const router = useRouter();
    const { user, profile, signOut } = useAuth();
    const { hasActiveSubscription } = useSubscription();

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

    const handleDashboard = () => {
        router.push('/dashboard');
    };

    if (user && profile) {
        // Get display name - use full_name if available, otherwise use email
        const displayName = profile.full_name || user.email?.split('@')[0] || 'User';
        const isAdmin = profile.role === 'admin' || profile.role === 'superadmin';
        
        return (
            <div className="flex flex-col gap-1.5 sm:gap-2 items-end">
                <div className="bg-white px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <div className="text-right">
                        <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#1b3c44]">{displayName}</p>
                        <div className="flex items-center gap-1 justify-end">
                            <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">{profile.role}</p>
                            {!isAdmin && hasActiveSubscription && (
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" />
                            )}
                        </div>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-[#cd8453] flex items-center justify-center text-white font-semibold text-xs sm:text-sm md:text-base">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                    {isAdmin ? (
                        <button
                            onClick={handleAdminPanel}
                            className="bg-[#cd8453] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full hover:bg-[#1b3c44] transition-colors flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm"
                        >
                            <Settings size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            Admin
                        </button>
                    ) : (
                        <button
                            onClick={handleDashboard}
                            className={`${
                                hasActiveSubscription 
                                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                                    : 'bg-[#cd8453] hover:bg-[#1b3c44]'
                            } text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full transition-colors flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm`}
                        >
                            <LayoutDashboard size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            Dashboard
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 text-[#1b3c44] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full hover:bg-gray-300 transition-colors text-[10px] sm:text-xs md:text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end">
            <AnimatedButton
                text="Sign In"
                onClick={handleSignIn}
                width="w-[110px] sm:w-[130px] md:w-[150px] lg:w-[180px]"
                height="h-[40px] sm:h-[44px] md:h-[48px] lg:h-[56px]"
                textSize="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px]"
                icon={<ArrowRight className="w-[28%] h-[28%]" strokeWidth={2.5} />}
            />
        </div>
    );
};

export default SigninButton;
