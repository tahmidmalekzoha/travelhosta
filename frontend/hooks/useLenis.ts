'use client'

import { useEffect, useRef } from 'react'

interface UseLenisScrollOptions {
    root?: boolean
    target?: HTMLElement
    priority?: boolean
}

export function useLenisScroll(
    callback: (lenis: any) => void,
    deps: any[] = [],
    options: UseLenisScrollOptions = {}
) {
    const { root = false, target, priority = false } = options

    useEffect(() => {
        if (!window.lenis) return

        const handler = (lenis: any) => callback(lenis)

        if (priority) {
            window.lenis.on('scroll', handler, { priority: true })
        } else {
            window.lenis.on('scroll', handler)
        }

        return () => {
            window.lenis.off('scroll', handler)
        }
    }, deps)
}

export function useLenisScrollTo() {
    return (target: string | number | HTMLElement, options?: any) => {
        if (window.lenis) {
            window.lenis.scrollTo(target, options)
        }
    }
}

// Declare global window.lenis for TypeScript
declare global {
    interface Window {
        lenis: any
    }
}
