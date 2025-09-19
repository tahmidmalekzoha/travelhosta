import React, { useMemo, ReactNode, RefObject } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { extractTextFromNode, splitTextIntoWords } from '../utils/textUtils';

interface ScrollRevealProps {
    /** Content to animate */
    children: ReactNode;
    /** Reference to scroll container element */
    scrollContainerRef?: RefObject<HTMLElement>;
    /** Enable blur effect during animation */
    enableBlur?: boolean;
    /** Blur strength in pixels */
    blurStrength?: number;
    /** Additional CSS class for container */
    containerClassName?: string;
    /** Additional CSS class for text */
    textClassName?: string;
}

/**
 * ScrollReveal component that animates text word-by-word on scroll
 * Uses GSAP and ScrollTrigger for smooth scroll-linked animations
 */
const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    blurStrength = 3,
    containerClassName = '',
    textClassName = ''
}) => {
    // Extract and split text into animated words
    const splitText = useMemo(() => {
        const text = extractTextFromNode(children);
        return splitTextIntoWords(text);
    }, [children]);

    // Initialize scroll reveal animation
    const containerRef = useScrollReveal({
        enableBlur,
        blurStrength,
        scrollContainer: scrollContainerRef?.current
    });

    return (
        <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
            <p
                className={`scroll-reveal-text ${textClassName}`}
                style={{
                    fontFamily: 'Schibsted Grotesk',
                    fontWeight: 500,
                    color: '#1b3c44'
                }}
            >
                {splitText}
            </p>
        </div>
    );
};

export default ScrollReveal;
