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
            className={`group ${width} relative ${height} text-left ${textSize} text-[#1b3c44] font-['Schibsted_Grotesk'] transition-all duration-300 active:scale-95 cursor-pointer border-none bg-transparent ${className}`}
        >
            {/* Background */}
            <div className={`absolute inset-0 rounded-[52px] bg-[#e4d9d3] transition-all duration-300 group-hover:bg-[#ddd2cc] shadow-md`} />

            {/* Text with sliding animation */}
            <div className="absolute inset-y-[13%] left-[13%] right-[30%] z-10 overflow-hidden">
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className={`h-1/2 flex items-center justify-start whitespace-nowrap ${textSize} leading-none text-[#1b3c44]`}>{text}</div>
                    <div className={`h-1/2 flex items-center justify-start whitespace-nowrap ${textSize} leading-none text-[#1b3c44]`}>{text}</div>
                </div>
            </div>

            {/* Circle Background */}
            <div
                className={`absolute top-[13%] right-[5%] bg-[#cd8453] aspect-square rounded-full transition-all duration-300 group-hover:bg-[#b86f42] ${isRotated ? 'rotate-180' : ''}`}
                style={{ width: '22%', height: '75%' }}
            />

            {/* Icon - Support both React icon and image src */}
            {icon ? (
                <div
                    className={`absolute top-1/2 -translate-y-1/2 right-[11%] z-10 flex items-center justify-center text-[#f2eee9] transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
                >
                    {icon}
                </div>
            ) : iconSrc ? (
                <img
                    className={`absolute top-1/2 -translate-y-1/2 right-[11%] z-10 transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
                    style={{ width: '10.5%', height: 'auto' }}
                    alt={iconAlt}
                    src={iconSrc}
                />
            ) : null}
        </button>
    );
};

export default AnimatedButton;
