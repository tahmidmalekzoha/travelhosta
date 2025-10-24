"use client";

import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { GuidesProvider } from '@/contexts/GuidesContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
import { HeroProvider } from '@/contexts/HeroContext';
import LenisProvider from '@/components/LenisProvider';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { configureSanitizer } from '@/utils/sanitization';

/**
 * Client-side providers wrapper
 * This component wraps all context providers that require client-side rendering
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    // Configure security utilities on app initialization
    useEffect(() => {
        configureSanitizer();
    }, []);

    return (
        <ErrorBoundary>
            <AuthProvider>
                <CategoriesProvider>
                    <GuidesProvider>
                        <HeroProvider>
                            <LenisProvider>
                                {children}
                            </LenisProvider>
                        </HeroProvider>
                    </GuidesProvider>
                </CategoriesProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}
