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
                'schibsted-grotesk': ['Schibsted Grotesk', 'sans-serif'],
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
                // Figma design colors
                white: '#fff',
                linen: '#f2eee9',
                darkslategray: '#1b3c44',
                gainsboro: '#e4d9d3',
                black: '#000',
                peru: '#cd8453',
            },
        },
    },
    plugins: [],
}
