import { skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}'
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Neuropol X Free"', 'Inter', 'sans-serif'],
            },
        },
    },

    plugins: [
        skeleton({
            themes: [
                themes.cerberus,
                {
                    name: 'dzypher-dark',
                    properties: {
                        // Primary (Red theme)
                        '--color-primary-50': '254 242 242',
                        '--color-primary-100': '254 226 226',
                        '--color-primary-200': '254 202 202',
                        '--color-primary-300': '252 165 165',
                        '--color-primary-400': '248 113 113',
                        '--color-primary-500': '239 68 68',
                        '--color-primary-600': '220 38 38',
                        '--color-primary-700': '185 28 28',
                        '--color-primary-800': '153 27 27',
                        '--color-primary-900': '127 29 29',
                        '--color-primary-950': '69 10 10',

                        // Surface colors (dark theme)
                        '--color-surface-50': '250 250 250',
                        '--color-surface-100': '245 245 245',
                        '--color-surface-200': '229 229 229',
                        '--color-surface-300': '212 212 212',
                        '--color-surface-400': '163 163 163',
                        '--color-surface-500': '115 115 115',
                        '--color-surface-600': '82 82 82',
                        '--color-surface-700': '64 64 64',
                        '--color-surface-800': '38 38 38',
                        '--color-surface-900': '23 23 23',
                        '--color-surface-950': '10 10 10',
                    }
                }
            ]
        }),
        forms,
    ],
};
