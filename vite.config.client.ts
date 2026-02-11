import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [svelte()],
    build: {
        outDir: 'build',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/routes/+page.svelte')
            }
        }
    },
    resolve: {
        alias: {
            '$lib': path.resolve(__dirname, 'src/lib'),
            '$app': path.resolve(__dirname, '.svelte-kit/runtime/app')
        }
    }
});
