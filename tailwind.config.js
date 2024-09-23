/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts}'],
    theme: {
        extend: {
            colors: {
                blue: '#345FF6',
                gunmetal: '#253347',
                'dark-electric-blue': '#5E6E85',
                skyblue: 'rgba(214, 230, 254, 1)',
                'skyblue-soft': 'rgba(214, 230, 254, 0.25)',
                'blue-shadow': 'rgba(143, 174, 207, 0.25)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            spacing: {
                inner: '72.5rem',
                outer: '87rem',
            },
            boxShadow: {
                '3xl': '16px 32px 56px 0 rgba(0, 0, 0, 0.3)',
            },
            borderRadius: {
                '4xl': '2.1875rem',
            },
            lineHeight: {
                'extra-tight': '1.1',
            },
        },
        screens: {
            sm: '480px',
            md: '768px',
            lg: '1200px',
        },
    },
    plugins: [],
};
