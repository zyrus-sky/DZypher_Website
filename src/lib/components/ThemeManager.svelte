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
            updateColors($themeStore.colors);
        } else {
            updateColors([defaultSourceColor]);
        }
    });

    function updateColors(colors: string[]) {
        if (typeof document === "undefined") return;

        const primaryHex = colors[0];
        const secondaryHex = colors[1];
        const tertiaryHex = colors[2];

        // 1. Generate Base Theme from Primary
        const sourceArgb = argbFromHex(primaryHex);
        const theme = themeFromSourceColor(sourceArgb);
        const root = document.documentElement;

        // 2. Define Palettes
        // If Custom Secondary/Tertiary provided, use them as SOURCE for their own Primary logic
        // (This ensures the user gets the color they picked as the main tone)
        // Otherwise, use the Harmonic palettes generated from the Primary Source.

        const primaryPalette = theme.palettes.primary;

        const secondaryPalette = secondaryHex
            ? themeFromSourceColor(argbFromHex(secondaryHex)).palettes.primary
            : theme.palettes.secondary;

        const tertiaryPalette = tertiaryHex
            ? themeFromSourceColor(argbFromHex(tertiaryHex)).palettes.primary
            : theme.palettes.tertiary;

        const surfacePalette = theme.palettes.neutral;
        const errorPalette = theme.palettes.error;

        // 3. Update Favicon based on Logo
        const logo = $themeStore?.logo || "VORTIX";
        const link = document.querySelector(
            "link[rel*='icon']",
        ) as HTMLLinkElement;
        if (link) {
            // Use explicit assets we verified in static/assets
            const favicon =
                logo === "VORTIX"
                    ? "/assets/vortix_logo_tx.svg"
                    : "/assets/DZypher_logo.svg";
            link.href = favicon;
        }

        // 4. Map to Tailwind variables
        const tonalMap = {
            50: 95,
            100: 90,
            200: 80,
            300: 70,
            400: 60,
            500: 40,
            600: 30,
            700: 20,
            800: 10,
            900: 5,
            950: 0,
        };

        const setPalette = (name: string, palette: any) => {
            for (const [twShade, m3Tone] of Object.entries(tonalMap)) {
                const argb = palette.tone(m3Tone);
                const hex = hexFromArgb(argb);
                root.style.setProperty(`--color-${name}-${twShade}`, hex);

                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                root.style.setProperty(
                    `--color-${name}-${twShade}-rgb`,
                    `${r}, ${g}, ${b}`,
                );
            }
        };

        setPalette("primary", primaryPalette);
        setPalette("secondary", secondaryPalette);
        setPalette("tertiary", tertiaryPalette);
        setPalette("surface", surfacePalette);
        setPalette("error", errorPalette); // Optional, usually just error-500 needed but consistency is good

        console.log("ThemeManager applied:", { colors, logo });
    }
</script>

```
<!-- No markup needed, just logic -->
