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
                secondary: {
                    50: 'rgb(var(--color-secondary-50-rgb) / <alpha-value>)',
                    100: 'rgb(var(--color-secondary-100-rgb) / <alpha-value>)',
                    200: 'rgb(var(--color-secondary-200-rgb) / <alpha-value>)',
                    300: 'rgb(var(--color-secondary-300-rgb) / <alpha-value>)',
                    400: 'rgb(var(--color-secondary-400-rgb) / <alpha-value>)',
                    500: 'rgb(var(--color-secondary-500-rgb) / <alpha-value>)',
                    600: 'rgb(var(--color-secondary-600-rgb) / <alpha-value>)',
                    700: 'rgb(var(--color-secondary-700-rgb) / <alpha-value>)',
                    800: 'rgb(var(--color-secondary-800-rgb) / <alpha-value>)',
                    900: 'rgb(var(--color-secondary-900-rgb) / <alpha-value>)',
                    950: 'rgb(var(--color-secondary-950-rgb) / <alpha-value>)',
                },
                tertiary: {
                    50: 'rgb(var(--color-tertiary-50-rgb) / <alpha-value>)',
                    100: 'rgb(var(--color-tertiary-100-rgb) / <alpha-value>)',
                    200: 'rgb(var(--color-tertiary-200-rgb) / <alpha-value>)',
                    300: 'rgb(var(--color-tertiary-300-rgb) / <alpha-value>)',
                    400: 'rgb(var(--color-tertiary-400-rgb) / <alpha-value>)',
                    500: 'rgb(var(--color-tertiary-500-rgb) / <alpha-value>)',
                    600: 'rgb(var(--color-tertiary-600-rgb) / <alpha-value>)',
                    700: 'rgb(var(--color-tertiary-700-rgb) / <alpha-value>)',
                    800: 'rgb(var(--color-tertiary-800-rgb) / <alpha-value>)',
                    900: 'rgb(var(--color-tertiary-900-rgb) / <alpha-value>)',
                    950: 'rgb(var(--color-tertiary-950-rgb) / <alpha-value>)',
                },
                surface: {
                    50: 'rgb(var(--color-surface-50-rgb) / <alpha-value>)',
                    100: 'rgb(var(--color-surface-100-rgb) / <alpha-value>)',
                    200: 'rgb(var(--color-surface-200-rgb) / <alpha-value>)',
                    300: 'rgb(var(--color-surface-300-rgb) / <alpha-value>)',
                    400: 'rgb(var(--color-surface-400-rgb) / <alpha-value>)',
                    500: 'rgb(var(--color-surface-500-rgb) / <alpha-value>)',
                    600: 'rgb(var(--color-surface-600-rgb) / <alpha-value>)',
                    700: 'rgb(var(--color-surface-700-rgb) / <alpha-value>)',
                    800: 'rgb(var(--color-surface-800-rgb) / <alpha-value>)',
                    900: 'rgb(var(--color-surface-900-rgb) / <alpha-value>)',
                    950: 'rgb(var(--color-surface-950-rgb) / <alpha-value>)',
                },
                error: {
                    500: 'rgb(var(--color-error-500-rgb) / <alpha-value>)',
                },
            },
        },
    },

    plugins: [forms],
};
