/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'icimdqlnkndmdhdoicsm.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '*.netlify.app',
            },
            {
                protocol: 'https',
                hostname: '*.vercel.app',
            },
        ],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: false,
    },
    typescript: {
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: false,
    },
}

module.exports = nextConfig
