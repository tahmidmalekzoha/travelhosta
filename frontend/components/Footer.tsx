"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Footer = () => {
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/signin');
    };

    return (
        <footer className="w-full bg-[#213c44] py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-20 text-white">
            <div className="w-full">
                {/* Top Section with Logo/Title and Social Icons */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-16">
                    {/* Brand Section */}
                    <div className="mb-12 lg:mb-0 text-center">
                        <h2
                            className="font-bold text-white leading-tight mb-6"
                            style={{ fontFamily: 'Lato, sans-serif', fontSize: '64px' }}
                        >
                            TravelHosta | Plan. Pack. Go.
                        </h2>
                    </div>

                    {/* Social Icons and Sign In Button */}
                    <div className="flex items-center gap-6">
                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <button className="w-[92px] h-[92px] bg-white bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-opacity-30 hover:scale-105">
                                <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button className="w-[92px] h-[92px] bg-white bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-opacity-30 hover:scale-105">
                                <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </button>
                        </div>

                        {/* Sign In Button - Original Style */}
                        <button
                            onClick={handleSignIn}
                            className="group w-[297px] relative h-[92px] text-left text-[48px] text-black font-['Schibsted_Grotesk'] transition-all duration-300 active:scale-95 cursor-pointer border-none bg-transparent"
                        >
                            {/* Background */}
                            <div className="absolute top-0 left-0 rounded-[52px] bg-[#e4d9d3] w-[297px] h-[92px] transition-all duration-300 group-hover:bg-[#ddd2cc]" />

                            {/* Text with sliding animation */}
                            <div className="absolute top-[12px] left-[39px] w-[160px] h-[68px] z-10 overflow-hidden px-1">
                                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                                    <div className="h-1/2 flex items-center justify-start whitespace-nowrap text-[48px] leading-none">Sign In</div>
                                    <div className="h-1/2 flex items-center justify-start whitespace-nowrap text-[48px] leading-none">Sign In</div>
                                </div>
                            </div>

                            {/* Circle Background */}
                            <div className="absolute top-[12px] left-[220px] bg-[#cd8453] w-[66px] h-[69px] transition-all duration-300 group-hover:bg-[#b8743c]" style={{ borderRadius: '33px / 34.5px' }} />

                            {/* Arrow */}
                            <img
                                className="absolute w-[31px] h-[32px] top-[32px] left-[238px] z-10"
                                alt="Arrow"
                                src="/images/Arrow.svg"
                            />
                        </button>
                    </div>
                </div>

                {/* Navigation Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    {/* Column 1 */}
                    <div>
                        <h3
                            className="text-[28px] font-medium text-white mb-8"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                            Explore
                        </h3>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Destinations', 'Our guides'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[20px] text-white text-opacity-80 hover:text-opacity-100 transition-all duration-300 hover:translate-x-1"
                                        style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3
                            className="text-[28px] font-medium text-white mb-8"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                            Resources
                        </h3>
                        <ul className="space-y-4">
                            {['Blog', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[20px] text-white text-opacity-80 hover:text-opacity-100 transition-all duration-300 hover:translate-x-1"
                                        style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3
                            className="text-[28px] font-medium text-white mb-8"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                            Support
                        </h3>
                        <ul className="space-y-4">
                            {['Style Guide', 'Help Center', 'How to use', 'FAQ Guide'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[20px] text-white text-opacity-80 hover:text-opacity-100 transition-all duration-300 hover:translate-x-1"
                                        style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h3
                            className="text-[28px] font-medium text-white mb-8"
                            style={{ fontFamily: 'Lato, sans-serif' }}
                        >
                            Legal
                        </h3>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Licenses', 'Cookies'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[20px] text-white text-opacity-80 hover:text-opacity-100 transition-all duration-300 hover:translate-x-1"
                                        style={{ fontFamily: 'Schibsted Grotesk, sans-serif' }}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
