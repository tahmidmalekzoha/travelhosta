import './globals.css';
import { Inter, Anek_Bangla } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });
const anekBangla = Anek_Bangla({ 
    subsets: ['bengali', 'latin'],
    weight: ['400', '500', '700'],
    variable: '--font-anek-bangla',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'TravelHosta - Budget Travel Guides',
    description: 'Comprehensive web platform for budget-conscious travelers with travel guides, blogs, and resources.',
};

interface RootLayoutProps {
    children: React.ReactNode;
}

/**
 * Root layout component that wraps the entire application
 * Provides context providers for authentication, guides, and categories
 * Includes smooth scrolling via LenisProvider
 */
export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${anekBangla.variable}`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
