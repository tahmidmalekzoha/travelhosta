"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StickyNavbar from '../../components/StickyNavbar';
import { isValidEmail } from '../../utils/authHelpers';

// Form validation constants
const VALIDATION = {
    minPasswordLength: 6,
} as const;

/**
 * Sign Up page component
 * Handles user registration with form validation
 */
export default function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const validateForm = useCallback((): boolean => {
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email');
            return false;
        }
        if (!formData.dateOfBirth) {
            setError('Date of birth is required');
            return false;
        }
        if (formData.password.length < VALIDATION.minPasswordLength) {
            setError(`Password must be at least ${VALIDATION.minPasswordLength} characters`);
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!acceptTerms) {
            setError('Please accept the terms and conditions');
            return false;
        }
        return true;
    }, [formData, acceptTerms]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Use Supabase email authentication
            const { authService } = await import('../../services/authService');
            
            console.log('🔄 Attempting signup for:', formData.email);
            const response = await authService.signUp({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth,
            });

            console.log('📋 Signup response:', response);

            if (!response.success) {
                console.error('❌ Signup failed:', response.error);
                setError(response.error || 'Failed to create account');
                setLoading(false);
                return;
            }

            // Success - show success message and redirect
            console.log('✅ Account created successfully for:', formData.email);
            setSuccess(true);
            
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        } catch (err) {
            console.error('Sign up error:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    }, [formData, validateForm, router]);

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen bg-[#1b3c44] flex items-center justify-center">
                <div className="p-8 text-center max-w-md w-full">
                    <h2 className="text-3xl font-bold text-[#f2eee9] mb-4 font-['Schibsted_Grotesk']">
                        Welcome aboard!
                    </h2>
                    <p className="text-[#f2eee9] text-lg mb-6">
                        Your account has been created successfully. Redirecting to sign in...
                    </p>
                    <div className="w-8 h-8 border-4 border-[#cd8453] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

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
                <div className="lg:w-1/2 flex flex-col justify-center p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20 relative order-1">
                    {/* Hero text - vertically centered */}
                    <div>
                        {/* Mobile hero text */}
                        <div className="lg:hidden mb-8">
                            <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold text-4xl sm:text-5xl leading-tight mb-4">
                                Let&apos;s Plan. Pack &amp; Go.
                            </h1>
                            <p className="text-[#f2eee9]/80 font-['Schibsted_Grotesk'] text-lg sm:text-xl leading-relaxed">
                                Start your journey with us. Create an account and unlock a world of travel possibilities.
                            </p>
                        </div>
                        
                        {/* Desktop hero text - single line, centered */}
                        <div className="hidden lg:block text-center">
                            <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold text-5xl xl:text-6xl 2xl:text-7xl leading-tight mb-6">
                                Let&apos;s Plan. Pack &amp; Go.
                            </h1>
                            <p className="text-[#f2eee9]/80 font-['Schibsted_Grotesk'] text-xl xl:text-2xl 2xl:text-3xl leading-relaxed max-w-2xl mx-auto">
                                Start your journey with us. Create an account and unlock a world of travel possibilities.
                            </p>
                        </div>
                    </div>
                    
                    {/* Decorative signpost - attached at bottom and centered */}
                    <div className="hidden lg:flex absolute bottom-0 left-0 right-0 justify-center">
                        <img src="/images/signpost.svg" alt="Travel Signpost" className="w-48 h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 object-contain" />
                    </div>
                </div>

                {/* Right side - Sign Up Form */}
                <div className="lg:w-1/2 flex items-start justify-start p-8 sm:p-10 md:p-12 lg:pl-8 lg:pr-20 xl:pl-12 xl:pr-24 order-2 lg:pt-24 xl:pt-28">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 border border-red-500 rounded-2xl text-red-200 text-center p-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Full Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg block">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg block">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Date of Birth Field */}
                            <div className="space-y-2">
                                <label htmlFor="dateOfBirth" className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg block">
                                    Date of Birth
                                </label>
                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg block">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 pr-12 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-base lg:text-lg block">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#e4d9d3] rounded-2xl h-12 lg:h-14 px-5 pr-12 text-base text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? (
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

                            {/* Terms and Conditions */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setAcceptTerms(!acceptTerms)}
                                    className={`rounded-md flex items-center justify-center transition-colors w-5 h-5 border flex-shrink-0 ${acceptTerms ? 'bg-[#cd8453] border-[#cd8453]' : 'bg-[#e4d9d3] border-[#e4d9d3]'}`}
                                    aria-label="Accept terms and conditions"
                                >
                                    {acceptTerms && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                                <span className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-sm">
                                    I accept the{' '}
                                    <Link href="/terms" className="text-[#cd8453] hover:underline transition-colors">
                                        Terms and Conditions
                                    </Link>
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
                                    {loading ? 'Creating Account...' : 'Create Account'}
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

                            {/* Sign In Link */}
                            <div className="text-center pt-1">
                                <span className="text-[#f2eee9] font-['Schibsted_Grotesk'] text-sm">
                                    Already have an account?{' '}
                                    <Link href="/signin" className="text-[#cd8453] hover:underline transition-colors font-medium">
                                        Sign In
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
