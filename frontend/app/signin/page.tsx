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
        <div className="w-screen h-screen bg-[#f2eee9] p-[23px] box-border overflow-hidden">
            <div className="bg-[#1b3c44] rounded-[20px] md:rounded-[30px] lg:rounded-[39px] relative w-full h-full overflow-hidden">
                <StickyNavbar />

                {/* Main Content Container - Responsive Layout */}
                <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                    {/* Hero Text - Hidden on very small screens, shown on tablets+ */}
                    <div className="hidden md:block absolute left-4 sm:left-8 lg:left-16 xl:left-20 top-[49px] md:top-[52px] lg:top-[55px] xl:top-[58px] 2xl:top-[64px] max-w-[calc(100%-280px)] md:max-w-[calc(100%-300px)] lg:max-w-[calc(100%-350px)] xl:max-w-[calc(100%-400px)] z-10 mb-[6vh]">
                        <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold leading-[1.1] whitespace-nowrap text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[96px]">
                            Let&apos;s Plan. Pack & Go.
                        </h1>
                    </div>

                    {/* Signpost image - full size for desktops */}
                    <div className="hidden lg:block absolute right-0 bottom-0 w-[320px] h-[360px] lg:w-[380px] lg:h-[420px] xl:w-[450px] xl:h-[480px] 2xl:w-[500px] 2xl:h-[515px] z-0">
                        <img src="/images/signpost.svg" alt="Travel Signpost" className="w-full h-full object-contain" />
                    </div>

                    {/* Signpost image - scaled accent for tablets and mobile */}
                    <div className="lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-44 sm:w-52 md:w-60 h-auto z-0 opacity-90 pointer-events-none">
                        <img src="/images/signpost.svg" alt="Travel Signpost" className="w-full h-full object-contain" />
                    </div>

                    {/* Form Container - Centered with spacing to avoid hero text */}
                    <div className="relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-[600px] mx-auto mt-16 md:mt-20 lg:mt-24 xl:mt-32 2xl:mt-36">
                        {/* Hero Text for Mobile - Only shown on small screens */}
                        <div className="md:hidden mb-6 text-center">
                            <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold leading-tight text-3xl sm:text-4xl">
                                Let&apos;s Plan. Pack & Go.
                            </h1>
                        </div>

                        <form onSubmit={handleSignIn} className="w-full space-y-4 md:space-y-5 lg:space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center p-3 md:p-4 text-sm md:text-base">
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2 md:space-y-2.5 lg:space-y-3">
                                <label className="block text-white font-['Schibsted_Grotesk'] tracking-[-0.28px] text-xl md:text-2xl lg:text-[28px] px-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-[28px] md:rounded-[32px] lg:rounded-[37px] bg-[#e4d9d3] h-16 md:h-20 lg:h-[86px] px-5 md:px-5.5 lg:px-6 text-lg md:text-xl lg:text-2xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 border-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2 md:space-y-2.5 lg:space-y-3">
                                <label className="block text-white font-['Schibsted_Grotesk'] tracking-[-0.28px] text-xl md:text-2xl lg:text-[28px] px-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-[28px] md:rounded-[32px] lg:rounded-[37px] bg-[#e4d9d3] h-16 md:h-20 lg:h-[86px] px-5 md:px-5.5 lg:px-6 pr-14 md:pr-15 lg:pr-16 text-lg md:text-xl lg:text-2xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 border-none"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-5 md:right-5.5 lg:right-6 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none z-10"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Password Checkbox */}
                            <div className="flex items-center justify-center gap-2.5 md:gap-3 lg:gap-3.5 py-2 md:py-2.5 lg:py-3">
                                <button
                                    type="button"
                                    onClick={() => setRememberPassword(!rememberPassword)}
                                    className={`rounded-full w-6 h-6 md:w-7 md:h-7 lg:w-[29px] lg:h-[30px] transition-colors flex items-center justify-center flex-shrink-0 ${rememberPassword ? 'bg-[#cd8453]' : 'bg-[#e4d9d3]'}`}
                                    aria-label="Remember password"
                                >
                                    {rememberPassword && (
                                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                                <span className="text-white font-['Schibsted_Grotesk'] tracking-[-0.24px] text-base md:text-lg lg:text-xl xl:text-[24px]">
                                    Remember password
                                </span>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 md:pt-3 lg:pt-4 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-48 md:w-56 lg:w-[246px] h-14 md:h-16 lg:h-[76px] text-2xl md:text-3xl lg:text-[36px] text-black hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <div className="absolute inset-0 rounded-[38px] md:rounded-[45px] lg:rounded-[52px] bg-[#e4d9d3] group-hover:bg-opacity-80 transition-colors" />
                                    <div className="absolute inset-0 flex items-center gap-2 md:gap-2.5 lg:gap-3 px-6 md:px-7 lg:px-8 z-10">
                                        <span className="font-['Schibsted_Grotesk'] whitespace-nowrap flex-shrink-0">
                                            {loading ? 'Signing in...' : 'Sign in'}
                                        </span>
                                        <div className="w-10 h-10 md:w-12 md:h-12 lg:w-[54px] lg:h-[54px] bg-[#cd8453] rounded-full flex items-center justify-center flex-shrink-0 ml-auto">
                                            {loading ? (
                                                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg className="text-white w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center pt-3 md:pt-4 lg:pt-5">
                                <span className="text-white font-['Schibsted_Grotesk'] tracking-[-0.24px] text-base md:text-lg lg:text-xl xl:text-[24px]">
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