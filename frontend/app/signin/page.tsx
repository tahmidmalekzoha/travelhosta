"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import StickyNavbar from '../../components/StickyNavbar';
import { isValidEmail, isAdminEmail, DEMO_CREDENTIALS } from '../../utils/authHelpers';

// Page layout constants
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

/**
 * Sign In page component
 * Handles user authentication with demo credentials support
 */
export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleSignIn = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo purposes, accept any valid email/password
        if (isValidEmail(email) && password.length >= 3) {
            const isAdmin = isAdminEmail(email);
            
            // Simulate successful login
            const user = {
                email,
                name: isAdmin ? 'Admin User' : 'Demo User',
                id: isAdmin ? 'admin-1' : '1',
                role: isAdmin ? 'admin' as const : 'user' as const
            };
            login(user);
            
            // Redirect to admin panel if admin, otherwise to home
            router.push(isAdmin ? '/admin' : '/');
        } else {
            setError('Invalid email or password');
        }

        setLoading(false);
    }, [email, password, login, router]);

    return (
        <div className="w-full h-screen bg-[#f2eee9] p-[18px] box-border overflow-hidden">
            <div className="bg-[#1b3c44] rounded-[39px] relative overflow-hidden w-full h-full">
                {/* Navigation - Top Right */}
                <StickyNavbar />

                {/* Header */}
                <div
                    className="absolute text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold whitespace-nowrap"
                    style={{
                        left: LAYOUT.heading.left,
                        top: LAYOUT.heading.top,
                        fontSize: LAYOUT.heading.fontSize,
                        lineHeight: '1',
                        letterSpacing: '0'
                    }}
                >
                    {LAYOUT.heading.text}
                </div>

                {/* Signpost Image */}
                <div
                    className="absolute"
                    style={{
                        right: LAYOUT.signpost.right,
                        bottom: LAYOUT.signpost.bottom,
                        width: LAYOUT.signpost.width,
                        height: LAYOUT.signpost.height
                    }}
                >
                    <img
                        src="/images/signpost.svg"
                        alt="Travel Signpost"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Admin Credentials Info Box */}
                <div
                    className="absolute bg-[#cd8453]/20 border border-[#cd8453] rounded-lg p-4"
                    style={{
                        left: LAYOUT.heading.left,
                        bottom: '40px',
                        maxWidth: '400px'
                    }}
                >
                    <h3 className="text-[#f2eee9] font-bold text-lg mb-2 font-['Schibsted_Grotesk']">
                        Demo Credentials
                    </h3>
                    <div className="text-[#f2eee9]/90 text-sm font-['Schibsted_Grotesk'] space-y-1">
                        <p><strong>Admin Access:</strong></p>
                        <p>Email: {DEMO_CREDENTIALS.admin.email}</p>
                        <p>Password: {DEMO_CREDENTIALS.admin.password}</p>
                        <p className="mt-2"><strong>Regular User:</strong></p>
                        <p>{DEMO_CREDENTIALS.user.emailHint}</p>
                        <p>Password: {DEMO_CREDENTIALS.user.passwordHint}</p>
                    </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSignIn} className="relative">
                    {/* Error Message */}
                    {error && (
                        <div
                            className="absolute bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center p-4"
                            style={{
                                left: LAYOUT.form.containerLeft,
                                top: LAYOUT.form.containerTop,
                                width: LAYOUT.form.containerWidth,
                                zIndex: 10
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Email and Password Fields Container */}
                    <div className="absolute top-[18.188rem] left-[29rem] w-[35.125rem] h-[20.5rem] text-[1.75rem]">
                        {/* Email Field */}
                        <div className="absolute top-[0rem] left-[0rem] w-[35.125rem] h-[9.313rem]">
                            <div className="absolute top-[0rem] left-[1.813rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk']">Email</div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="absolute top-[3.938rem] left-[0rem] rounded-[37px] bg-[#e4d9d3] w-[35.125rem] h-[5.375rem] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 border-none"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="absolute top-[11.188rem] left-[0rem] w-[35.125rem] h-[9.313rem]">
                            <div className="absolute top-[0rem] left-[1.813rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk']">Password</div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="absolute top-[3.938rem] left-[0rem] rounded-[37px] bg-[#e4d9d3] w-[35.125rem] h-[5.375rem] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 border-none"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    {/* Remember Password Checkbox */}
                    <div className="absolute top-[41rem] left-[38rem] w-[17.063rem] h-[1.875rem]">
                        <div className="absolute top-[0rem] left-[2.438rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk'] text-[1.5rem]">Remember password</div>
                        <button
                            type="button"
                            onClick={() => setRememberPassword(!rememberPassword)}
                            className={`absolute top-[0rem] left-[0rem] rounded-[50%] w-[1.813rem] h-[1.875rem] transition-colors ${rememberPassword
                                ? 'bg-[#cd8453]'
                                : 'bg-[#e4d9d3]'
                                }`}
                        >
                            {rememberPassword && (
                                <svg className="w-4 h-4 text-white mx-auto mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute top-[45.125rem] left-[38.875rem] w-[15.375rem] h-[4.75rem] text-[2.25rem] text-black hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <div className="absolute top-[0rem] left-[0rem] rounded-[52px] bg-[#e4d9d3] w-[15.375rem] h-[4.75rem] group-hover:bg-opacity-80 transition-colors" />
                        <div className="absolute top-[0.938rem] left-[2.688rem] z-10 font-['Schibsted_Grotesk']">{loading ? 'Signing in...' : 'Sign in'}</div>
                        <div className="absolute top-[0.625rem] left-[11.25rem] w-[3.4rem] h-[3.556rem] bg-[#cd8453] rounded-full flex items-center justify-center z-10">
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Sign Up Link */}
                    <div className="absolute top-[51.938rem] left-[39.5rem] tracking-[-0.01em] text-white font-['Schibsted_Grotesk'] text-[1.5rem]">
                        <span>{`No account? `}</span>
                        <Link href="/signup" className="text-[#cd8453] hover:underline transition-colors">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}