"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import StickyNavbar from '../../components/StickyNavbar';
import { isValidEmail } from '../../utils/authHelpers';

const LAYOUT = {
    heading: {
        text: "Let's Plan. Pack & Go.",
        left: '52px',
        top: '64px',
        fontSize: '128px',
    },
    signpost: {
        right: '100px',
        bottom: '0px',
        width: '500px',
        height: '515px',
    },
    form: {
        containerLeft: '29rem',
        containerTop: '16rem',
        containerWidth: '35.125rem',
    },
} as const;

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
        <div className="w-full h-screen bg-[#f2eee9] p-[18px] box-border overflow-hidden">
            <div className="bg-[#1b3c44] rounded-[39px] relative overflow-hidden w-full h-full">
                <StickyNavbar />
                <div className="absolute text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold whitespace-nowrap" style={{ left: '52px', top: '64px', fontSize: '128px', lineHeight: '1', letterSpacing: '0' }}>
                    Let&apos;s Plan. Pack & Go.
                </div>
                <div className="absolute" style={{ right: '100px', bottom: '0px', width: '500px', height: '515px' }}>
                    <img src="/images/signpost.svg" alt="Travel Signpost" className="w-full h-full object-contain" />
                </div>
                <form onSubmit={handleSignIn} className="relative">
                    {error && (
                        <div className="absolute bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center p-4" style={{ left: '29rem', top: '16rem', width: '35.125rem', zIndex: 10 }}>
                            {error}
                        </div>
                    )}
                    <div className="absolute top-[18.188rem] left-[29rem] w-[35.125rem] h-[20.5rem] text-[1.75rem]">
                        <div className="absolute top-[0rem] left-[0rem] w-[35.125rem] h-[9.313rem]">
                            <div className="absolute top-[0rem] left-[1.813rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk']">Email</div>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="absolute top-[3.938rem] left-[0rem] rounded-[37px] bg-[#e4d9d3] w-[35.125rem] h-[5.375rem] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 border-none" placeholder="Enter your email" required />
                        </div>
                        <div className="absolute top-[11.188rem] left-[0rem] w-[35.125rem] h-[9.313rem]">
                            <div className="absolute top-[0rem] left-[1.813rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk']">Password</div>
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="absolute top-[3.938rem] left-[0rem] rounded-[37px] bg-[#e4d9d3] w-[35.125rem] h-[5.375rem] px-6 pr-14 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 border-none" placeholder="Enter your password" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-[6.25rem] right-[1.5rem] text-gray-600 hover:text-gray-800 transition-colors focus:outline-none z-10" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-[41rem] left-[38rem] w-[17.063rem] h-[1.875rem]">
                        <div className="absolute top-[0rem] left-[2.438rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk'] text-[1.5rem]">Remember password</div>
                        <button type="button" onClick={() => setRememberPassword(!rememberPassword)} className={'absolute top-[0rem] left-[0rem] rounded-[50%] w-[1.813rem] h-[1.875rem] transition-colors ' + (rememberPassword ? 'bg-[#cd8453]' : 'bg-[#e4d9d3]')}>
                            {rememberPassword && (<svg className="w-4 h-4 text-white mx-auto mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>)}
                        </button>
                    </div>
                    <button type="submit" disabled={loading} className="absolute top-[45.125rem] left-[38.875rem] w-[15.375rem] h-[4.75rem] text-[2.25rem] text-black hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group">
                        <div className="absolute top-[0rem] left-[0rem] rounded-[52px] bg-[#e4d9d3] w-[15.375rem] h-[4.75rem] group-hover:bg-opacity-80 transition-colors" />
                        <div className="absolute top-[0.938rem] left-[2.688rem] z-10 font-['Schibsted_Grotesk']">{loading ? 'Signing in...' : 'Sign in'}</div>
                        <div className="absolute top-[0.625rem] left-[11.25rem] w-[3.4rem] h-[3.556rem] bg-[#cd8453] rounded-full flex items-center justify-center z-10">
                            {loading ? (<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<svg className="text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>)}
                        </div>
                    </button>
                    <div className="absolute top-[51.938rem] left-[39.5rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk'] text-[1.5rem]">
                        <span>No account? </span>
                        <Link href="/signup" className="text-[#cd8453] hover:underline transition-colors">Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}