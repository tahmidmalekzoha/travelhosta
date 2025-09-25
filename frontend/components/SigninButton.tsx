"use client";

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedButton from './shared/AnimatedButton';

/**
 * Animated sign-in button with hover effects
 * Features sliding text animation and color transitions
 */
const SigninButton: FunctionComponent = () => {
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/signin');
    };

    return (
        <AnimatedButton
            text="Sign In"
            onClick={handleSignIn}
            width="w-[297px]"
            height="h-[92px]"
            textSize="text-[48px]"
            iconSrc="/images/Arrow.svg"
            iconAlt="Sign in arrow"
        />
    );
};

export default SigninButton;
