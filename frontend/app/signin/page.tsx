"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import StickyNavbar from '../../components/StickyNavbar';
import { isValidEmail } from '../../utils/authHelpers';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [signingIn, setSigningIn] = useState(false);
    const router = useRouter();
    const { profile, user, isLoading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (!isLoading && user && profile) {
            console.log('🔄 Redirecting authenticated user:', profile.email, profile.role);
            const isAdmin = profile.role === 'admin';
            router.push(isAdmin ? '/admin' : '/');
        }
    }, [user, profile, isLoading, router]);

    // Handle timeout if profile doesn't load after sign-in
    useEffect(() => {
        if (signingIn && !isLoading) {
            // If we're done signing in and AuthContext is done loading
            if (!user || !profile) {
                // Sign-in failed (user was logged out)
                setError('Failed to load profile. Please try again.');
                setLoading(false);
                setSigningIn(false);
            }
            // If user and profile exist, the redirect effect above will handle it
        }
    }, [signingIn, isLoading, user, profile]);

    const handleSignIn = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSigningIn(false);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.signIn({ email, password });

            if (!response.success) {
                setError(response.error || 'Failed to sign in');
                setLoading(false);
                return;
            }

            // Sign-in successful, mark that we're waiting for AuthContext
            console.log('✅ Sign in successful, waiting for profile to load...');
            setSigningIn(true);
            
            // Keep loading state active while AuthContext processes
            // The redirect will happen automatically via useEffect
        } catch (err) {
            console.error('Sign in error:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    }, [email, password]);

    return (
        <div className="min-h-screen bg-[#1b3c44] relative overflow-hidden">
            <StickyNavbar />

            {/* Back Button */}
            <div className="absolute top-4 sm:top-8 md:top-12 lg:top-16 left-4 sm:left-6 md:left-8 lg:left-12 z-20">
                <button 
                    onClick={() => router.push('/')} 
                    className="group relative inline-flex items-center rounded-full bg-[#f2eee9] h-[40px] sm:h-[44px] md:h-[48px] lg:h-[56px] transition-transform duration-200 hover:-translate-x-1 hover:bg-[#e4d9d3]"
                >
                    <span className="absolute left-[5px] sm:left-[6px] md:left-[6px] lg:left-[7px] top-1/2 -translate-y-1/2 flex h-[32px] w-[32px] sm:h-[35px] sm:w-[35px] md:h-[38px] md:w-[38px] lg:h-[44px] lg:w-[44px] items-center justify-center rounded-full bg-[#1b3c44] text-[#f2eee9]">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </span>
                    <span className="font-['Schibsted_Grotesk'] font-normal text-[14px] sm:text-[16px] md:text-[18px] lg:text-[24px] text-[#1b3c44] ml-[40px] mr-[10px] sm:ml-[44px] sm:mr-[10px] md:ml-[48px] md:mr-[12px] lg:ml-[56px] lg:mr-[16px]">Back</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row min-h-screen pt-24 sm:pt-28 md:pt-32 lg:pt-36">
                {/* Left side - Hero Content */}
                <div className="lg:w-1/2 flex flex-col justify-start p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20 relative order-1 lg:pt-40 xl:pt-48">
                    {/* Hero text - aligned with form start */}
                    <div>
                        {/* Mobile hero text */}
                        <div className="lg:hidden mb-8">
                            <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold text-4xl sm:text-5xl leading-tight mb-4">
                                Let&apos;s Plan. Pack &amp; Go.
                            </h1>
                            <p className="text-[#f2eee9]/80 font-['Schibsted_Grotesk'] text-lg sm:text-xl leading-relaxed">
                                Welcome back! Sign in to continue your journey with us.
                            </p>
                        </div>
                        
                        {/* Desktop hero text - aligned to start */}
                        <div className="hidden lg:block">
                            <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold text-5xl xl:text-6xl 2xl:text-7xl leading-tight mb-6">
                                Let&apos;s Plan. Pack &amp; Go.
                            </h1>
                            <p className="text-[#f2eee9]/80 font-['Schibsted_Grotesk'] text-xl xl:text-2xl 2xl:text-3xl leading-relaxed max-w-2xl">
                                Welcome back! Sign in to continue your journey with us.
                            </p>
                        </div>
                    </div>
                    
                    {/* Decorative signpost - attached at bottom and centered */}
                    <div className="hidden lg:flex absolute bottom-0 left-0 right-0 justify-center">
                        <img src="/images/signpost.svg" alt="Travel Signpost" className="w-48 h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 object-contain" />
                    </div>
                </div>

                {/* Right side - Sign In Form */}
                <div className="lg:w-1/2 flex items-start justify-start p-8 sm:p-10 md:p-12 lg:pl-8 lg:pr-20 xl:pl-12 xl:pr-24 order-2 lg:pt-24 xl:pt-28">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSignIn} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500 rounded-2xl text-red-200 text-center p-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 pr-12 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none z-10"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Password Checkbox */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setRememberPassword(!rememberPassword)}
                                    className={`rounded-md flex items-center justify-center transition-colors w-5 h-5 border flex-shrink-0 ${rememberPassword ? 'bg-[#cd8453] border-[#cd8453]' : 'bg-[#e4d9d3] border-[#e4d9d3]'}`}
                                    aria-label="Remember password"
                                >
                                    {rememberPassword && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                                <span className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-sm">
                                    Remember password
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative h-12 lg:h-14 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-[#e4d9d3] group-hover:bg-[#d4c9c3] transition-colors" />
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base lg:text-lg font-['Schibsted_Grotesk'] text-black font-medium">
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </span>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#cd8453] group-hover:bg-[#b8754a] transition-colors flex items-center justify-center">
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center pt-1">
                                <span className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-sm">
                                    No account?{' '}
                                    <Link href="/signup" className="text-[#cd8453] hover:underline transition-colors font-medium">
                                        Sign up
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}