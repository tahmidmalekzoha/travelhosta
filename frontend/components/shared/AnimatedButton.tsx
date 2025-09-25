"use client";

import { FunctionComponent } from 'react';

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
    isRotated = false,
    textSize = 'text-[48px]',
    className = ''
}) => {
    // Calculate dynamic positioning based on width
    const getIconPosition = () => {
        const baseLeft = parseInt(width.match(/\d+/)?.[0] || '297') - 77; // 77px from right edge
        return `left-[${baseLeft}px]`;
    };

    const getCirclePosition = () => {
        const baseLeft = parseInt(width.match(/\d+/)?.[0] || '297') - 77; // Same as icon
        return `left-[${baseLeft}px]`;
    };

    return (
        <button
            onClick={onClick}
            className={`group ${width} relative ${height} text-left ${textSize} text-black font-['Schibsted_Grotesk'] transition-all duration-300 active:scale-95 cursor-pointer border-none bg-transparent ${className}`}
        >
            {/* Background */}
            <div className={`absolute top-0 left-0 rounded-[52px] bg-[#e4d9d3] ${width} ${height} transition-all duration-300 group-hover:bg-[#ddd2cc] shadow-md`} />

            {/* Text with sliding animation */}
            <div className="absolute top-[12px] left-[39px] z-10 overflow-hidden px-1" style={{ width: `calc(${width.replace(/[^\d]/g, '')}px - 120px)`, height: `calc(${height.replace(/[^\d]/g, '')}px - 24px)` }}>
                <div className="transition-transform duration-300 h-[200%] group-hover:-translate-y-1/2">
                    <div className={`h-1/2 flex items-center justify-start whitespace-nowrap ${textSize} leading-none`}>{text}</div>
                    <div className={`h-1/2 flex items-center justify-start whitespace-nowrap ${textSize} leading-none`}>{text}</div>
                </div>
            </div>

            {/* Circle Background */}
            <div
                className={`absolute top-[12px] bg-[#cd8453] w-[66px] transition-all duration-300 group-hover:bg-[#b8743c] ${isRotated ? 'rotate-180' : ''}`}
                style={{
                    left: `${parseInt(width.replace(/[^\d]/g, '')) - 77}px`,
                    height: `${parseInt(height.replace(/[^\d]/g, '')) - 23}px`,
                    borderRadius: '33px / 34.5px'
                }}
            />

            {/* Icon */}
            {iconSrc && (
                <img
                    className={`absolute w-[31px] h-[32px] z-10 transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
                    style={{
                        top: `${parseInt(height.replace(/[^\d]/g, '')) / 2 - 16}px`,
                        left: `${parseInt(width.replace(/[^\d]/g, '')) - 59}px`
                    }}
                    alt={iconAlt}
                    src={iconSrc}
                />
            )}
        </button>
    );
};

export default AnimatedButton;
