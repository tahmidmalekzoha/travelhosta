"use client";

import { FunctionComponent, ReactNode } from 'react';

interface AnimatedButtonProps {
    /** Button text to display */
    text: string;
    /** Click handler */
    onClick?: () => void;
    /** Button width */
    width?: string;
    /** Button height */
    height?: string;
    /** Icon source path */
    iconSrc?: string;
    /** Icon alt text */
    iconAlt?: string;
    /** React icon component (lucide-react) */
    icon?: ReactNode;
    /** Whether to show rotation on click/state change */
    isRotated?: boolean;
    /** Text size class */
    textSize?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Reusable animated button component with sliding text effect and customizable styling
 * Features hover animations, icon support, and rotation states
 * Based on Figma design: 297px × 92px (Sign In) / 264px × 92px (Menu)
 */
const AnimatedButton: FunctionComponent<AnimatedButtonProps> = ({
    text,
    onClick,
    width = 'w-[297px]',
    height = 'h-[92px]',
    iconSrc,
    iconAlt = 'Button icon',
    icon,
    isRotated = false,
    textSize = 'text-[48px]',
    className = ''
}) => {
    return (
        <button
            onClick={onClick}
            className={`group ${width} ${height} relative text-left font-['Schibsted_Grotesk'] transition-all duration-300 active:scale-95 cursor-pointer border-none bg-transparent ${className}`}
        >
            {/* Background - Border radius scales with button size */}
            <div className="absolute inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[48px] xl:rounded-[52px] bg-[#e4d9d3] transition-all duration-300 group-hover:bg-[#ddd2cc] shadow-md" />

            {/* Text with sliding animation */}
            <div className="absolute inset-y-[10%] sm:inset-y-[12%] md:inset-y-[13%] left-[10%] sm:left-[12%] md:left-[13%] right-[28%] sm:right-[30%] z-10 overflow-hidden">
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className={`h-1/2 flex items-center justify-start whitespace-nowrap ${textSize} leading-none text-[#1b3c44]`}>{text}</div>
                    <div className={`h-1/2 flex items-center justify-start whitespace-nowrap ${textSize} leading-none text-[#1b3c44]`}>{text}</div>
                </div>
            </div>

            {/* Circle Background - Maintains aspect ratio at all sizes */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 right-[8px] sm:right-[9px] md:right-[10px] lg:right-[11px] xl:right-[11px] bg-[#cd8453] rounded-full transition-all duration-300 group-hover:bg-[#b86f42] ${isRotated ? 'rotate-180' : ''} w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[48px] md:h-[48px] lg:w-[54px] lg:h-[54px] xl:w-[66px] xl:h-[66px]`}
            />

            {/* Icon - Centered in circle */}
            {icon ? (
                <div
                    className={`absolute top-1/2 -translate-y-1/2 right-[8px] sm:right-[9px] md:right-[10px] lg:right-[11px] xl:right-[11px] z-10 flex items-center justify-center text-[#f2eee9] transition-transform duration-300 ${isRotated ? 'rotate-180' : ''} w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[48px] md:h-[48px] lg:w-[54px] lg:h-[54px] xl:w-[66px] xl:h-[66px]`}
                >
                    {icon}
                </div>
            ) : iconSrc ? (
                <img
                    className={`absolute top-1/2 -translate-y-1/2 right-[8px] sm:right-[9px] md:right-[10px] lg:right-[11px] xl:right-[11px] z-10 transition-transform duration-300 ${isRotated ? 'rotate-180' : ''} w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[48px] md:h-[48px] lg:w-[54px] lg:h-[54px] xl:w-[66px] xl:h-[66px]`}
                    alt={iconAlt}
                    src={iconSrc}
                />
            ) : null}
        </button>
    );
};

export default AnimatedButton;
