/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'schibsted': ['Schibsted Grotesk', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f2eee9',
                    100: '#f2eee9',
                    500: '#cd8453',
                    900: '#1b3c44',
                },
                background: '#f2eee9',
                accent: '#cd8453',
                dark: '#1b3c44',
            },
        },
    },
    plugins: [],
}
