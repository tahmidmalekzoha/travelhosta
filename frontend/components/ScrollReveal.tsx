import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    scrollContainerRef?: RefObject<HTMLElement>;
    enableBlur?: boolean;
    baseOpacity?: number;
    baseRotation?: number;
    blurStrength?: number;
    containerClassName?: string;
    textClassName?: string;
    rotationEnd?: string;
    wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.05,
    baseRotation = 2,
    blurStrength = 3,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const splitText = useMemo(() => {
        // Extract text from children, handling both string and JSX elements
        let text = '';
        if (typeof children === 'string') {
            text = children;
        } else {
            // For JSX elements, try to extract text content
            const extractText = (node: ReactNode): string => {
                if (typeof node === 'string') return node;
                if (typeof node === 'number') return node.toString();
                if (React.isValidElement(node)) {
                    const props = node.props as any;
                    if (typeof props.children === 'string') return props.children;
                    if (Array.isArray(props.children)) {
                        return props.children.map(extractText).join('');
                    }
                    return extractText(props.children);
                }
                return '';
            };
            text = extractText(children);
        }

        const words = text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;
            return (
                <span className="word" key={index}>
                    {word}
                </span>
            );
        });

        return words;
    }, [children]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const el = containerRef.current;
        if (!el) return;

        const initAnimation = async () => {
            try {
                // Dynamic import for SSR compatibility
                const { gsap } = await import('gsap');
                const { ScrollTrigger } = await import('gsap/ScrollTrigger');

                gsap.registerPlugin(ScrollTrigger);

                const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

                const wordElements = el.querySelectorAll<HTMLElement>('.word');

                if (wordElements.length === 0) {
                    return;
                }

                // Set initial state - all words start invisible and blurred
                gsap.set(wordElements, {
                    opacity: 0,
                    filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
                    willChange: 'opacity, filter, transform',
                    y: 30,
                    scale: 0.95,
                    transformOrigin: 'center center'
                });                // Create a much slower ScrollTrigger with extended range
                ScrollTrigger.create({
                    trigger: el,
                    scroller,
                    start: 'top bottom-=100px',
                    end: 'bottom top+=300px', // Much longer animation range
                    scrub: 3, // Slower scrub for more deliberate movement
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const totalWords = wordElements.length;

                        // Much slower reveal with less overlap
                        const waveLength = 0.6; // Longer duration for each word

                        wordElements.forEach((word, index) => {
                            // Calculate slower wave timing for each word
                            const wordCenter = index / (totalWords - 1);
                            const wordStart = Math.max(0, wordCenter - waveLength / 2);
                            const wordEnd = Math.min(1, wordCenter + waveLength / 2);

                            let wordProgress = 0;

                            if (progress >= wordStart && progress <= wordEnd) {
                                // Calculate progress within this word's timeframe
                                const localProgress = (progress - wordStart) / (wordEnd - wordStart);
                                // Apply slower, more gentle easing
                                wordProgress = gsap.parseEase('power2.out')(localProgress);
                            } else if (progress > wordEnd) {
                                wordProgress = 1;
                            }

                            // Apply slower transitions with gentler movement
                            const currentOpacity = gsap.utils.interpolate(0, 1, wordProgress);
                            const currentY = gsap.utils.interpolate(20, 0, wordProgress); // Reduced movement
                            const currentScale = gsap.utils.interpolate(0.98, 1, wordProgress); // Subtler scale
                            const currentBlur = enableBlur ? gsap.utils.interpolate(blurStrength, 0, wordProgress) : 0;

                            // Use slower interpolation
                            gsap.to(word, {
                                opacity: currentOpacity,
                                y: currentY,
                                scale: currentScale,
                                filter: enableBlur ? `blur(${currentBlur}px)` : 'none',
                                duration: 0.2, // Slower transition
                                ease: 'power2.out'
                            });
                        });
                    }
                });

                return () => {
                    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
                };
            } catch (error) {
                console.error('ScrollReveal: GSAP initialization failed:', error);
                // Fallback: make sure text is visible
                const wordElements = el.querySelectorAll<HTMLElement>('.word');
                wordElements.forEach((word) => {
                    word.style.opacity = '1';
                    word.style.filter = 'none';
                });
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initAnimation, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

    return (
        <div ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
            <p className={`scroll-reveal-text ${textClassName}`} style={{ fontFamily: 'Schibsted Grotesk', fontWeight: 500, color: '#1b3c44' }}>
                {splitText}
            </p>
        </div>
    );
};

export default ScrollReveal;
