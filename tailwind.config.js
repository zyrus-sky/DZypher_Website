import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,js,svelte,ts}',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Neuropol X Free"', 'Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: 'rgb(var(--color-primary-50-rgb) / <alpha-value>)',
                    100: 'rgb(var(--color-primary-100-rgb) / <alpha-value>)',
                    200: 'rgb(var(--color-primary-200-rgb) / <alpha-value>)',
                    300: 'rgb(var(--color-primary-300-rgb) / <alpha-value>)',
                    400: 'rgb(var(--color-primary-400-rgb) / <alpha-value>)',
                    500: 'rgb(var(--color-primary-500-rgb) / <alpha-value>)',
                    600: 'rgb(var(--color-primary-600-rgb) / <alpha-value>)',
                    700: 'rgb(var(--color-primary-700-rgb) / <alpha-value>)',
                    800: 'rgb(var(--color-primary-800-rgb) / <alpha-value>)',
                    900: 'rgb(var(--color-primary-900-rgb) / <alpha-value>)',
                    950: 'rgb(var(--color-primary-950-rgb) / <alpha-value>)',
                },
            },
        },
    },

    plugins: [forms],
};
