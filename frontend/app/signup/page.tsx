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
            <div className="min-h-screen bg-[#f2eee9] flex items-center justify-center">
                <div className="bg-[#1b3c44] rounded-[39px] p-12 text-center max-w-md">
                    <h2 className="text-4xl font-bold text-[#f2eee9] mb-4 font-['Schibsted_Grotesk']">
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
        <div className="w-screen h-screen bg-[#f2eee9] p-4 sm:p-5 md:p-6 lg:p-[18px] box-border overflow-hidden">
            <div className="bg-[#1b3c44] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[39px] relative overflow-hidden w-full h-full">
                <StickyNavbar />

                <div className="relative w-full h-full flex flex-col items-center justify-center lg:block">
                    {/* Desktop Hero Heading */}
                    <div className="hidden lg:block absolute left-[52px] top-[64px] text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold whitespace-nowrap leading-[1] tracking-[0px] text-[72px] xl:text-[96px] 2xl:text-[128px]">
                        Let&apos;s Plan. Pack &amp; Go.
                    </div>

                    {/* Mobile / Tablet Heading */}
                    <div className="lg:hidden w-full text-center px-6 sm:px-10 md:px-12 mb-6 z-10">
                        <h1 className="text-[#f2eee9] font-['Schibsted_Grotesk'] font-bold leading-tight text-3xl sm:text-4xl md:text-5xl">
                            Let&apos;s Plan. Pack &amp; Go.
                        </h1>
                    </div>

                    {/* Desktop Signpost */}
                    <div className="hidden lg:block absolute right-[100px] bottom-0 w-[320px] h-[330px] xl:w-[420px] xl:h-[440px] 2xl:w-[500px] 2xl:h-[515px]">
                        <img src="/images/signpost.svg" alt="Travel Signpost" className="w-full h-full object-contain" />
                    </div>

                    {/* Mobile Signpost */}
                    <div className="lg:hidden absolute bottom-0 right-1/2 translate-x-1/2 sm:right-6 sm:translate-x-0 w-40 sm:w-48 md:w-56 h-auto opacity-80 pointer-events-none select-none z-0">
                        <img src="/images/signpost.svg" alt="Travel Signpost" className="w-full h-full object-contain" />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="relative flex flex-col gap-5 sm:gap-6 md:gap-7 w-full max-w-[520px] sm:max-w-[560px] md:max-w-[620px] px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-none lg:h-full lg:block z-10"
                    >
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base md:text-lg lg:absolute lg:left-[79px] lg:top-[250px] lg:w-[1154px] lg:z-10">
                                {error}
                            </div>
                        )}

                        {/* Full Name Field */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-[28px] w-full lg:w-[564px] lg:h-[149px] lg:absolute lg:left-[79px] lg:top-[294px]">
                            <label
                                htmlFor="fullName"
                                className="text-white font-['Schibsted_Grotesk'] text-left text-lg sm:text-xl md:text-2xl lg:text-[28px] tracking-[-0.28px] px-1 lg:px-0 lg:flex lg:items-center lg:justify-center lg:ml-[29px] lg:w-[123px] lg:h-[35px]"
                            >
                                Full name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="bg-[#e4d9d3] rounded-[30px] md:rounded-[34px] lg:rounded-[37px] px-5 md:px-6 text-base sm:text-lg md:text-xl lg:text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 h-14 sm:h-16 md:h-[70px] lg:h-[86px] w-full lg:w-[562px]"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-[28px] w-full lg:w-[564px] lg:h-[149px] lg:absolute lg:left-[671px] lg:top-[294px]">
                            <label
                                htmlFor="email"
                                className="text-white font-['Schibsted_Grotesk'] text-left text-lg sm:text-xl md:text-2xl lg:text-[28px] tracking-[-0.28px] px-1 lg:px-0 lg:flex lg:items-center lg:justify-center lg:ml-[29px] lg:w-[69px] lg:h-[35px]"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="bg-[#e4d9d3] rounded-[30px] md:rounded-[34px] lg:rounded-[37px] px-5 md:px-6 text-base sm:text-lg md:text-xl lg:text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 h-14 sm:h-16 md:h-[70px] lg:h-[86px] w-full lg:w-[562px]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Date of Birth Field */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-[28px] w-full lg:w-[564px] lg:h-[149px] lg:absolute lg:left-[79px] lg:top-[473px]">
                            <label
                                htmlFor="dateOfBirth"
                                className="text-white font-['Schibsted_Grotesk'] text-left text-lg sm:text-xl md:text-2xl lg:text-[28px] tracking-[-0.28px] px-1 lg:px-0 lg:flex lg:items-center lg:justify-center lg:ml-[29px] lg:w-[158px] lg:h-[35px]"
                            >
                                Date of Birth
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="bg-[#e4d9d3] rounded-[30px] md:rounded-[34px] lg:rounded-[37px] px-5 md:px-6 text-base sm:text-lg md:text-xl lg:text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 h-14 sm:h-16 md:h-[70px] lg:h-[86px] w-full lg:w-[562px]"
                                required
                            />
                        </div>

                        {/* New Password Field */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-[28px] w-full lg:w-[564px] lg:h-[149px] lg:absolute lg:left-[671px] lg:top-[473px]">
                            <label
                                htmlFor="password"
                                className="text-white font-['Schibsted_Grotesk'] text-left text-lg sm:text-xl md:text-2xl lg:text-[28px] tracking-[-0.28px] px-1 lg:px-0 lg:flex lg:items-center lg:justify-center lg:ml-[29px] lg:w-[191px] lg:h-[35px]"
                            >
                                New Password
                            </label>
                            <div className="relative h-14 sm:h-16 md:h-[70px] lg:h-[86px] w-full lg:w-[562px]">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="bg-[#e4d9d3] rounded-[30px] md:rounded-[34px] lg:rounded-[37px] px-5 md:px-6 pr-12 md:pr-14 lg:pr-16 text-base sm:text-lg md:text-xl lg:text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 w-full h-full"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-[28px] w-full lg:w-[564px] lg:h-[149px] lg:absolute lg:left-[671px] lg:top-[652px]">
                            <label
                                htmlFor="confirmPassword"
                                className="text-white font-['Schibsted_Grotesk'] text-left text-lg sm:text-xl md:text-2xl lg:text-[28px] tracking-[-0.28px] px-1 lg:px-0 lg:flex lg:items-center lg:justify-center lg:ml-[29px] lg:w-[234px] lg:h-[35px]"
                            >
                                Confirm Password
                            </label>
                            <div className="relative h-14 sm:h-16 md:h-[70px] lg:h-[86px] w-full lg:w-[562px]">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="bg-[#e4d9d3] rounded-[30px] md:rounded-[34px] lg:rounded-[37px] px-5 md:px-6 pr-12 md:pr-14 lg:pr-16 text-base sm:text-lg md:text-xl lg:text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200 w-full h-full"
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center gap-3 sm:gap-4 text-left text-white font-['Schibsted_Grotesk'] text-sm sm:text-base md:text-lg lg:text-[24px] tracking-[-0.24px] px-2 sm:px-4 md:px-6 lg:px-0 lg:absolute lg:left-[170px] lg:top-[659px] lg:h-[30px] lg:w-[379px]">
                            <button
                                type="button"
                                onClick={() => setAcceptTerms(!acceptTerms)}
                                className={`rounded-[12px] sm:rounded-[14px] lg:rounded-[15px] flex items-center justify-center transition-colors w-6 h-6 sm:w-7 sm:h-7 lg:w-[29px] lg:h-[30px] border ${acceptTerms ? 'bg-[#cd8453] border-[#cd8453]' : 'bg-[#e4d9d3] border-[#e4d9d3]'}`}
                                aria-label="Accept terms and conditions"
                            >
                                {acceptTerms && (
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <span className="flex-1">
                                I accept{' '}
                                <Link href="/terms" className="underline hover:text-[#cd8453] transition-colors">
                                    Terms and Conditions
                                </Link>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-2 lg:absolute lg:left-[232px] lg:top-[722px] lg:pt-0">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-48 sm:w-52 md:w-60 lg:w-[248px] h-14 sm:h-16 md:h-[70px] lg:h-[76px] group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] md:rounded-[46px] lg:rounded-[52px] bg-[#e4d9d3] group-hover:bg-[#d4c9c3] transition-colors" />
                                <span className="absolute left-0 top-0 h-full w-[70%] flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-[36px] font-['Schibsted_Grotesk'] text-black">
                                    {loading ? 'Creating...' : 'Submit'}
                                </span>
                                <div className="absolute right-3 sm:right-4 md:right-5 lg:right-[20px] top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[54px] lg:h-[57px] rounded-full bg-[#cd8453] group-hover:bg-[#b8754a] transition-colors flex items-center justify-center">
                                    {loading ? (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center text-white font-['Schibsted_Grotesk'] text-base sm:text-lg md:text-xl lg:text-[24px] tracking-[-0.24px] pt-2 sm:pt-3 md:pt-4 lg:pt-0 lg:absolute lg:left-[180px] lg:top-[831px]">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-[#cd8453] hover:underline transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
