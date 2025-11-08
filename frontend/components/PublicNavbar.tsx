import Link from 'next/link';

// Lightweight, server-friendly top navigation for static pages
export default function PublicNavbar() {
    return (
        <header className="w-full bg-[#1b3c44] text-[#f2eee9]">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="text-xl font-semibold tracking-wide">
                    TravelHosta
                </Link>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link href="/guides" className="transition-colors hover:text-[#cd8453]">
                        Guides
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-[#cd8453]">
                        About
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-[#cd8453]">
                        Contact
                    </Link>
                    <Link
                        href="/signin"
                        className="rounded-full border border-[#cd8453] px-4 py-1.5 text-[#cd8453] transition-colors hover:bg-[#cd8453] hover:text-[#1b3c44]"
                    >
                        Sign in
                    </Link>
                </div>
            </nav>
        </header>
    );
}
