"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StickyNavbar from '../../components/StickyNavbar';
import { isValidEmail } from '../../utils/authHelpers';

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
} as const;

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

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="relative">
                    {/* Error Message */}
                    {error && (
                        <div
                            className="absolute bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center p-4"
                            style={{
                                left: '79px',
                                top: '250px',
                                width: '1154px',
                                zIndex: 10
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Full Name Field */}
                    <div
                        className="absolute flex flex-col"
                        style={{
                            left: '79px',
                            top: '294px',
                            gap: '28px',
                            width: '564px',
                            height: '149px'
                        }}
                    >
                        <div
                            className="text-white font-['Schibsted_Grotesk'] flex items-center justify-center"
                            style={{
                                fontSize: '28px',
                                fontWeight: '400',
                                letterSpacing: '-0.28px',
                                marginLeft: '29px',
                                width: '123px',
                                height: '35px'
                            }}
                        >
                            Full name
                        </div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="bg-[#e4d9d3] rounded-[37px] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                            style={{
                                width: '562px',
                                height: '86px'
                            }}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div
                        className="absolute flex flex-col"
                        style={{
                            left: '671px',
                            top: '294px',
                            gap: '28px',
                            width: '564px',
                            height: '149px'
                        }}
                    >
                        <div
                            className="text-white font-['Schibsted_Grotesk'] flex items-center justify-center"
                            style={{
                                fontSize: '28px',
                                fontWeight: '400',
                                letterSpacing: '-0.28px',
                                marginLeft: '29px',
                                width: '69px',
                                height: '35px'
                            }}
                        >
                            Email
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-[#e4d9d3] rounded-[37px] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                            style={{
                                width: '562px',
                                height: '86px'
                            }}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Date of Birth Field */}
                    <div
                        className="absolute flex flex-col"
                        style={{
                            left: '79px',
                            top: '473px',
                            gap: '28px',
                            width: '564px',
                            height: '149px'
                        }}
                    >
                        <div
                            className="text-white font-['Schibsted_Grotesk'] flex items-center justify-center"
                            style={{
                                fontSize: '28px',
                                fontWeight: '400',
                                letterSpacing: '-0.28px',
                                marginLeft: '29px',
                                width: '158px',
                                height: '35px'
                            }}
                        >
                            Date of Birth
                        </div>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="bg-[#e4d9d3] rounded-[37px] px-6 text-xl text-black focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                            style={{
                                width: '562px',
                                height: '86px'
                            }}
                            required
                        />
                    </div>

                    {/* New Password Field */}
                    <div
                        className="absolute flex flex-col"
                        style={{
                            left: '671px',
                            top: '473px',
                            gap: '28px',
                            width: '564px',
                            height: '149px'
                        }}
                    >
                        <div
                            className="text-white font-['Schibsted_Grotesk'] flex items-center justify-center"
                            style={{
                                fontSize: '28px',
                                fontWeight: '400',
                                letterSpacing: '-0.28px',
                                marginLeft: '29px',
                                width: '191px',
                                height: '35px'
                            }}
                        >
                            New Password
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="bg-[#e4d9d3] rounded-[37px] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                            style={{
                                width: '562px',
                                height: '86px'
                            }}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div
                        className="absolute flex flex-col"
                        style={{
                            left: '671px',
                            top: '652px',
                            gap: '28px',
                            width: '564px',
                            height: '149px'
                        }}
                    >
                        <div
                            className="text-white font-['Schibsted_Grotesk'] flex items-center justify-center"
                            style={{
                                fontSize: '28px',
                                fontWeight: '400',
                                letterSpacing: '-0.28px',
                                marginLeft: '29px',
                                width: '234px',
                                height: '35px'
                            }}
                        >
                            Confirm Password
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-[#e4d9d3] rounded-[37px] px-6 text-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cd8453] transition-all duration-200"
                            style={{
                                width: '562px',
                                height: '86px'
                            }}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {/* Terms and Conditions */}
                    <div
                        className="absolute flex"
                        style={{
                            left: '170px',
                            top: '659px',
                            gap: '16px',
                            height: '30px',
                            width: '379px'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setAcceptTerms(!acceptTerms)}
                            className={`rounded-[15px] flex items-center justify-center transition-colors ${acceptTerms
                                ? 'bg-[#cd8453] border-[#cd8453]'
                                : 'bg-[#e4d9d3] border-[#e4d9d3]'
                                }`}
                            style={{
                                width: '29px',
                                height: '30px'
                            }}
                        >
                            {acceptTerms && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <div
                            className="text-white font-['Schibsted_Grotesk'] flex items-center whitespace-nowrap"
                            style={{
                                fontSize: '24px',
                                fontWeight: '400',
                                letterSpacing: '-0.24px',
                                height: '30px',
                                width: '400px'
                            }}
                        >
                            I accept{' '}
                            <Link href="/terms" className="underline hover:text-[#cd8453] transition-colors ml-1" style={{ letterSpacing: '-0.06px' }}>
                                Terms and Conditions
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute hover:bg-[#d4c9c3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        style={{
                            left: '232px',
                            top: '722px',
                            width: '248px',
                            height: '76px',
                            border: 'none',
                            padding: '0',
                            background: 'transparent'
                        }}
                    >
                        {/* Button Background */}
                        <div
                            className="absolute bg-[#e4d9d3] group-hover:bg-[#d4c9c3] transition-colors"
                            style={{
                                left: '0',
                                top: '0',
                                width: '246px',
                                height: '76px',
                                borderRadius: '52px',
                                border: '1px solid transparent'
                            }}
                        />

                        {/* Submit Text */}
                        <span
                            className="absolute text-black font-['Schibsted_Grotesk'] z-10 flex items-center justify-center"
                            style={{
                                fontSize: '36px',
                                fontWeight: '400',
                                left: '0',
                                top: '0',
                                width: '180px',
                                height: '76px',
                                letterSpacing: '0',
                                lineHeight: 'normal'
                            }}
                        >
                            {loading ? 'Creating...' : 'Submit'}
                        </span>

                        {/* Icon Container */}
                        <div
                            className="absolute bg-[#cd8453] flex items-center justify-center group-hover:bg-[#b8754a] transition-colors z-10"
                            style={{
                                width: '54px',
                                height: '57px',
                                left: '180px',
                                top: '10px',
                                borderRadius: '27px'
                            }}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg
                                    className="text-white"
                                    style={{
                                        width: '25px',
                                        height: '27px'
                                    }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Sign In Link */}
                    <div
                        className="absolute text-white font-['Schibsted_Grotesk'] flex items-center"
                        style={{
                            left: '180px',
                            top: '831px',
                            fontSize: '24px',
                            fontWeight: '400',
                            letterSpacing: '-0.24px',
                            height: '30px'
                        }}
                    >
                        Already have an account?{' '}
                        <Link
                            href="/signin"
                            className="hover:underline transition-all duration-200 ml-1"
                            style={{ color: '#cd8453', letterSpacing: '-0.06px' }}
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
