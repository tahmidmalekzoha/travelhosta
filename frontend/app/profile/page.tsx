"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { authService } from '@/services/authService';
import { User, Lock, Mail, Shield, ArrowLeft, Calendar, Check, Key } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { user, profile, isLoading: authLoading } = useAuth();
    const { hasActiveSubscription, subscription } = useSubscription();
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin');
        }
    }, [user, authLoading, router]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Validation
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsChangingPassword(true);
        const result = await authService.updatePassword(newPassword);
        
        if (result.success) {
            setPasswordSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordError(result.error || 'Failed to change password');
        }
        
        setIsChangingPassword(false);
    };

    if (authLoading || !user || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f1] via-[#f2eee9] to-[#ede8e0]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cd8453] mx-auto"></div>
                    <p className="mt-4 text-[#1b3c44]/70 font-['Schibsted_Grotesk']">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f6f1] via-[#f2eee9] to-[#ede8e0] font-['Schibsted_Grotesk']">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1b3c44] to-[#cd8453] text-white py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center gap-2 mb-4 text-white/80 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                    <p className="text-white/80">Manage your account settings</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Profile Information Card */}
                <div className="bg-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="text-[#cd8453]" size={24} />
                        <h2 className="text-2xl font-bold text-[#1b3c44]">Profile Information</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Username */}
                        <div className="flex items-start gap-4 p-4 bg-[#f2eee9] rounded-[16px]">
                            <User className="text-[#1b3c44]/70 mt-1" size={20} />
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide">Username</label>
                                <p className="text-lg text-[#1b3c44] font-medium mt-1">
                                    {profile.username || 'Not set'}
                                </p>
                            </div>
                        </div>

                        {/* Display Name (if different) */}
                        {profile.display_name && profile.display_name !== profile.username && (
                            <div className="flex items-start gap-4 p-4 bg-[#f2eee9] rounded-[16px]">
                                <User className="text-[#1b3c44]/70 mt-1" size={20} />
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide">Display Name</label>
                                    <p className="text-lg text-[#1b3c44] font-medium mt-1">
                                        {profile.display_name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex items-start gap-4 p-4 bg-[#f2eee9] rounded-[16px]">\n                            <Mail className="text-[#1b3c44]/70 mt-1" size={20} />
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide">Email</label>
                                <p className="text-lg text-[#1b3c44] font-medium mt-1">{profile.email}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start gap-4 p-4 bg-[#f2eee9] rounded-[16px]">
                            <Shield className="text-[#1b3c44]/70 mt-1" size={20} />
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide">Account Type</label>
                                <p className="text-lg text-[#1b3c44] font-medium mt-1 capitalize">{profile.role}</p>
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="flex items-start gap-4 p-4 bg-[#f2eee9] rounded-[16px]">
                            <Calendar className="text-[#1b3c44]/70 mt-1" size={20} />
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide">Member Since</label>
                                <p className="text-lg text-[#1b3c44] font-medium mt-1">
                                    {new Date(profile.created_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Subscription Status */}
                        {hasActiveSubscription && subscription && (
                            <div className="flex items-start gap-4 p-4 bg-[#cd8453]/10 border border-[#cd8453]/20 rounded-[16px]">
                                <Check className="text-[#cd8453] mt-1" size={20} />
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-[#1b3c44]/70 uppercase tracking-wide">Subscription</label>
                                    <p className="text-lg text-[#1b3c44] font-bold mt-1">Premium Member</p>
                                    <p className="text-sm text-[#1b3c44]/70 mt-1">
                                        Active since {new Date(subscription.subscribed_at || subscription.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="bg-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <Key className="text-[#cd8453]" size={24} />
                        <h2 className="text-2xl font-bold text-[#1b3c44]">Change Password</h2>
                    </div>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-[#1b3c44]/70 mb-2 uppercase tracking-wide">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b3c44]/50" size={20} />
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#f2eee9] border border-[#1b3c44]/10 rounded-[16px] text-[#1b3c44] placeholder-[#1b3c44]/40 focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1b3c44]/70 mb-2 uppercase tracking-wide">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1b3c44]/50" size={20} />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#f2eee9] border border-[#1b3c44]/10 rounded-[16px] text-[#1b3c44] placeholder-[#1b3c44]/40 focus:outline-none focus:ring-2 focus:ring-[#cd8453] focus:border-transparent"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {passwordError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-[16px]">
                                <p className="text-sm text-red-600">{passwordError}</p>
                            </div>
                        )}
                        
                        {passwordSuccess && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-[16px]">
                                <p className="text-sm text-green-600">{passwordSuccess}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full bg-gradient-to-r from-[#1b3c44] to-[#cd8453] hover:shadow-xl text-white font-bold py-3 px-6 rounded-[18px] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
