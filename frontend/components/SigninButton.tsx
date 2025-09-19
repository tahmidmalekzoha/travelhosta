"use client";

import { FunctionComponent } from 'react';

/**
 * Animated sign-in button with hover effects
 * Features sliding text animation and color transitions
 */
const SigninButton: FunctionComponent = () => {
    const handleSignIn = () => {
        console.log('Sign In clicked');
        // Add your sign-in logic here
        // Example: redirect to sign-in page or open modal
        // window.location.href = '/signin';
    };

    return (
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

            {/* Arrow - no animation */}
            <img
                className="absolute w-[31px] h-[32px] top-[32px] left-[238px] z-10"
                alt="Arrow"
                src="/images/Arrow.svg"
            />
        </button>
    );
};

export default SigninButton;
