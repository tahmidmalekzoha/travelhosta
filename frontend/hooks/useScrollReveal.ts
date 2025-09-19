import { useEffect, useRef } from 'react';
import { ANIMATION_CONFIG } from '../constants';
import type { ScrollRevealConfig } from '../types';

/**
 * Custom hook for scroll-based text reveal animations using GSAP
 * Animates word-by-word reveal with optional blur effects
 * @param config - Configuration options for the animation
 * @returns Ref to attach to the container element
 */
export const useScrollReveal = (config: ScrollRevealConfig = {}) => {
    const {
        enableBlur = true,
        blurStrength = ANIMATION_CONFIG.BLUR_STRENGTH,
        scrollContainer = null,
        startTrigger = 'top bottom-=100px',
        endTrigger = 'bottom top+=300px',
        scrubValue = ANIMATION_CONFIG.SCROLL_SCRUB
    } = config;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const el = containerRef.current;
        if (!el) return;

        let cleanup: (() => void) | undefined;

        const initAnimation = async () => {
            try {
                // Dynamic import for SSR compatibility
                const { gsap } = await import('gsap');
                const { ScrollTrigger } = await import('gsap/ScrollTrigger');

                gsap.registerPlugin(ScrollTrigger);

                const scroller = scrollContainer || window;
                const wordElements = el.querySelectorAll<HTMLElement>('.word');

                if (wordElements.length === 0) {
                    return;
                }

                // Set initial state for all words
                gsap.set(wordElements, {
                    opacity: 0,
                    filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
                    willChange: 'opacity, filter, transform',
                    y: 30,
                    scale: 0.95,
                    transformOrigin: 'center center'
                });

                // Create scroll-triggered animation
                const scrollTrigger = ScrollTrigger.create({
                    trigger: el,
                    scroller,
                    start: startTrigger,
                    end: endTrigger,
                    scrub: scrubValue,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const totalWords = wordElements.length;
                        const waveLength = 0.6; // Duration for each word animation

                        wordElements.forEach((word, index) => {
                            // Calculate timing for each word
                            const wordCenter = index / (totalWords - 1);
                            const wordStart = Math.max(0, wordCenter - waveLength / 2);
                            const wordEnd = Math.min(1, wordCenter + waveLength / 2);

                            let wordProgress = 0;

                            if (progress >= wordStart && progress <= wordEnd) {
                                const localProgress = (progress - wordStart) / (wordEnd - wordStart);
                                wordProgress = gsap.parseEase('power2.out')(localProgress);
                            } else if (progress > wordEnd) {
                                wordProgress = 1;
                            }

                            // Apply smooth animations
                            const currentOpacity = gsap.utils.interpolate(0, 1, wordProgress);
                            const currentY = gsap.utils.interpolate(20, 0, wordProgress);
                            const currentScale = gsap.utils.interpolate(0.98, 1, wordProgress);
                            const currentBlur = enableBlur ?
                                gsap.utils.interpolate(blurStrength, 0, wordProgress) : 0;

                            gsap.to(word, {
                                opacity: currentOpacity,
                                y: currentY,
                                scale: currentScale,
                                filter: enableBlur ? `blur(${currentBlur}px)` : 'none',
                                duration: 0.2,
                                ease: 'power2.out'
                            });
                        });
                    }
                });

                cleanup = () => {
                    scrollTrigger.kill();
                };

            } catch (error) {
                console.error('ScrollReveal: GSAP initialization failed:', error);
                // Fallback: ensure text is visible
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
            cleanup?.();
        };
    }, [enableBlur, blurStrength, scrollContainer, startTrigger, endTrigger, scrubValue]);

    return containerRef;
};
