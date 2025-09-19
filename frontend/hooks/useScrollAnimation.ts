import { useEffect } from 'react';
import { ANIMATION_CONFIG, SCROLL_ANIMATION_CLASSES } from '../constants';
import type { ScrollAnimationOptions } from '../types';

/**
 * Custom hook for handling scroll-based animations using Intersection Observer
 * Observes elements with specified CSS classes and adds 'animate' class when they enter viewport
 */
export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
    const {
        animationClasses = SCROLL_ANIMATION_CLASSES,
        threshold = ANIMATION_CONFIG.SCROLL_THRESHOLD,
        rootMargin = ANIMATION_CONFIG.SCROLL_ROOT_MARGIN
    } = options;

    useEffect(() => {
        const observerOptions = {
            threshold,
            rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all elements with specified animation classes
        const selector = animationClasses.map(cls => `.${cls}`).join(', ');
        const animatedElements = document.querySelectorAll(selector);

        animatedElements.forEach((el) => observer.observe(el));

        // Cleanup function
        return () => {
            animatedElements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };
    }, [animationClasses, threshold, rootMargin]);
};
