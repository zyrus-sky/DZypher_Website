<script lang="ts">
    import { themeStore } from "$lib/stores";
    // @ts-ignore
    import {
        argbFromHex,
        hexFromArgb,
        themeFromSourceColor,
        TonalPalette,
    } from "@material/material-color-utilities";

    // Default Vortix Palette Source Color (Purple)
    const defaultSourceColor = "#4E56C0";

    // Svelte 5: Apply theme colors when they change
    $effect(() => {
        if ($themeStore?.colors && $themeStore.colors.length > 0) {
            // Use the first color as the primary source for M3 generation
            // M3 algorithms work best with a single source color to generate a harmonious palette.
            // If we have multiple, we could potentially use them for other semantic roles, but for now
            // let's stick to the primary source for the main theme.
            updateColors($themeStore.colors[0]);
        } else {
            updateColors(defaultSourceColor);
        }
    });

    function updateColors(sourceHex: string) {
        if (typeof document === "undefined") return;

        // 1. Generate M3 Theme
        const sourceArgb = argbFromHex(sourceHex);
        const theme = themeFromSourceColor(sourceArgb);
        const root = document.documentElement;

        // 2. Set Tonal Palette Variables (--color-primary-50 to 950)
        // We map M3 Tones to Tailwind's 50-950 scale.
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
            900: 5, // M3 Tone 5  -> Tailwind 900
            950: 0, // M3 Tone 0  -> Tailwind 950
        };

        for (const [twShade, m3Tone] of Object.entries(tonalMap)) {
            const argb = primaryPalette.tone(m3Tone);
            const hex = hexFromArgb(argb);
            root.style.setProperty(`--color-primary-${twShade}`, hex);

            // Set RGB components for rgba() usage
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            root.style.setProperty(
                `--color-primary-${twShade}-rgb`,
                `${r}, ${g}, ${b}`,
            );
        }

        console.log("ThemeManager applied colors:", {
            sourceHex,
            primary500: hexFromArgb(primaryPalette.tone(40)),
        });
    }
</script>

```
<!-- No markup needed, just logic -->
