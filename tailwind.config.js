/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts}'],
    theme: {
        extend: {
            colors: {
                blue: '#345FF6',
                gunmetal: '#253347',
                'dark-electric-blue': '#5E6E85',
                skyblue: '#D6E6FE',
                'blue-shadow': '#8FAECF',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
