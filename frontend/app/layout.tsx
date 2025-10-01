import './globals.css'
import { Inter } from 'next/font/google'
import LenisProvider from '@/components/LenisProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { GuidesProvider } from '@/contexts/GuidesContext'
import { CategoriesProvider } from '@/contexts/CategoriesContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'TravelHosta - Budget Travel Guides',
    description: 'Comprehensive web platform for budget-conscious travelers with travel guides, blogs, and resources.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <CategoriesProvider>
                        <GuidesProvider>
                            <LenisProvider>
                                {children}
                            </LenisProvider>
                        </GuidesProvider>
                    </CategoriesProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
