<script lang="ts">
    import { themeStore } from "$lib/stores";
    // @ts-ignore
    import {
        argbFromHex,
        hexFromArgb,
        themeFromSourceColor,
        TonalPalette,
    } from "@material/material-color-utilities";
    import { onMount } from "svelte";

    // Default Red Palette Source Color
    const defaultSourceColor = "#ef4444";

    $: if ($themeStore?.colors && $themeStore.colors.length > 0) {
        // Use the first color as the primary source for M3 generation
        // M3 algorithms work best with a single source color to generate a harmonious palette.
        // If we have multiple, we could potentially use them for other semantic roles, but for now
        // let's stick to the primary source for the main theme.
        updateColors($themeStore.colors[0]);
    } else {
        updateColors(defaultSourceColor);
    }

    function updateColors(sourceHex: string) {
        if (typeof document === "undefined") return;

        // 1. Generate M3 Theme
        const sourceArgb = argbFromHex(sourceHex);
        const theme = themeFromSourceColor(sourceArgb);
        const root = document.documentElement;
        const isDark = root.classList.contains("dark");

        // 2. Set Semantic CSS Variables (e.g., --md-sys-color-primary)
        // We iterate over the 'schemes' (light/dark)
        const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

        for (const [key, value] of Object.entries(scheme.toJSON())) {
            // key is like 'primary', 'onPrimary', 'surface', etc.
            // value is ARGB number
            const kebabCase = key
                .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
                .toLowerCase();
            const hexValue = hexFromArgb(value);
            root.style.setProperty(`--md-sys-color-${kebabCase}`, hexValue);
        }

        // 3. Set Tonal Palette Variables (Backward Compatibility: --color-primary-50 to 950)
        // We map M3 Tones to Tailwind's 50-950 scale.
        // M3 Tones: 0 (black), 10, 20, ..., 90, 95, 99, 100 (white)
        // Tailwind: 50 (lightest), ..., 950 (darkest)
        // Note: M3 0 is black, 100 is white. Tailwind 950 is dark, 50 is light.
        // So M3 Tone 10 ~= Tailwind 900. M3 Tone 90 ~= Tailwind 100.

        const primaryPalette = theme.palettes.primary;

        const tonalMap = {
            50: 95, // M3 Tone 95 -> Tailwind 50
            100: 90, // M3 Tone 90 -> Tailwind 100
            200: 80, // M3 Tone 80 -> Tailwind 200
            300: 70, // M3 Tone 70 -> Tailwind 300
            400: 60, // M3 Tone 60 -> Tailwind 400
            500: 40, // M3 Tone 40 -> Tailwind 500 (Standard Primary)
            600: 30, // M3 Tone 30 -> Tailwind 600
            700: 20, // M3 Tone 20 -> Tailwind 700
            800: 10, // M3 Tone 10 -> Tailwind 800
            900: 5, // M3 Tone 5  -> Tailwind 900 (custom addition if needed, or stick to 10)
            950: 0, // M3 Tone 0  -> Tailwind 950
        };

        for (const [twShade, m3Tone] of Object.entries(tonalMap)) {
            const argb = primaryPalette.tone(m3Tone);
            const hex = hexFromArgb(argb);
            root.style.setProperty(`--color-primary-${twShade}`, hex);

            // Set RGB components for rgba() usage
            // hex is #RRGGBB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            root.style.setProperty(
                `--color-primary-${twShade}-rgb`,
                `${r}, ${g}, ${b}`,
            );
        }

        // Also set the surface/neutral tones if we want to be thorough, but maybe just start with primary for now.
    }

    onMount(() => {
        // Initial load
        const defaultHex = $themeStore?.colors?.[0] || defaultSourceColor;
        updateColors(defaultHex);

        // Listen for dark mode changes if handled via class on html
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    const defaultHex =
                        $themeStore?.colors?.[0] || defaultSourceColor;
                    updateColors(defaultHex);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    });
</script>

<!-- No markup needed, just logic -->
