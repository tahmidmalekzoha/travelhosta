'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    
    useEffect(() => {
        // Disable Lenis on admin pages to allow native scrolling
        if (pathname?.startsWith('/admin')) {
            return
        }

        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        })

        // Make lenis globally available
        window.lenis = lenis

        // Get scroll value
        lenis.on('scroll', (e: any) => {
            // Optional: You can listen to scroll events here
            // console.log(e)
        })

        // Use requestAnimationFrame to continuously update the scroll
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // Cleanup function
        return () => {
            lenis.destroy()
            window.lenis = undefined
        }
    }, [pathname])

    return <>{children}</>
}
