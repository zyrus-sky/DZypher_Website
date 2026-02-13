<script lang="ts">
    import { themeStore } from "$lib/stores";
    import { fade } from "svelte/transition";

    let isOpen = $state(false);
    let activeTab = $state("presets");

    // Hardcoded themes for now, later could be fetched
    const themes = [
        {
            name: "Vortix 26",
            colors: ["#4E56C0", "#9B5DE0", "#D78FEE", "#FDCFFA"],
            logo: "VORTIX",
        },
        {
            name: "DZypher Red",
            colors: ["#7f1d1d", "#ef4444", "#fca5a5", "#fef2f2"],
            logo: "DZypher",
        },
    ];

    function setTheme(theme: (typeof themes)[0]) {
        const newTheme = {
            colors: theme.colors,
            logo: theme.logo,
        };
        themeStore.set(newTheme);

        // Persist to local storage
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("themeData", JSON.stringify(newTheme));
        }

        isOpen = false;
    }

    function setCustomTheme(colors: string[]) {
        // Keep existing logo if possible, default to VORTIX
        const currentLogo = $themeStore?.logo || "VORTIX";

        const newTheme = {
            colors: colors,
            logo: currentLogo,
        };

        themeStore.set(newTheme);

        // Persist to local storage
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("themeData", JSON.stringify(newTheme));
        }
    }

    function updateCustomColor(index: number, hex: string) {
        let currentColors = [...($themeStore?.colors || [])];
        if (currentColors.length === 0) currentColors = ["#4E56C0"];

        currentColors[index] = hex;
        setCustomTheme(currentColors);
    }

    function removeCustomColor(index: number) {
        let currentColors = [...($themeStore?.colors || [])];
        // Set to null/undefined to clear it, but maintain array structure if needed?
        // Actually, let's just null it out so the index remains valid if we have index 2 but not 1.
        // Or simpler: We treat it as proper sparse array. ThemeManager handles "falsy" values.
        // We need to use 'delete' or splice?
        // If we splice, indices shift. But if we have Secondary(1) and Tertiary(2), and remove Secondary...
        // Tertiary becomes index 1? That changes its semantic meaning from Tertiary to Secondary.
        // So we must fill with null/undefined.

        // However, Typescript string[] doesn't like null.
        // We will use empty string as sentinel? Or splice if it's the last one.
        // Let's us undefined (cast as any if needed or update type)
        // OR better: use empty string "" and handle it in ThemeManager?
        // ThemeManager check: `secondaryHex = colors[1]` => if it is "", it is falsy.
        currentColors[index] = "";

        // Clean up trailing empty strings to keep array clean
        while (
            currentColors.length > 1 &&
            !currentColors[currentColors.length - 1]
        ) {
            currentColors.pop();
        }

        setCustomTheme(currentColors);
    }
</script>

<div class="fixed bottom-4 left-4 z-[9999]">
    {#if isOpen}
        <div
            class="mb-2 bg-black/90 border border-white/20 rounded-lg p-2 flex flex-col gap-2 shadow-xl"
            transition:fade
        >
            <!-- Headers/Tabs -->
            <div class="flex border-b border-white/10 mb-2">
                <button
                    class="flex-1 p-2 text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-colors {activeTab ===
                    'presets'
                        ? 'text-white border-b-2 border-primary-400'
                        : 'text-stone-500'}"
                    onclick={() => (activeTab = "presets")}>Presets</button
                >
                <button
                    class="flex-1 p-2 text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-colors {activeTab ===
                    'custom'
                        ? 'text-white border-b-2 border-primary-400'
                        : 'text-stone-500'}"
                    onclick={() => (activeTab = "custom")}>Custom</button
                >
            </div>

            {#if activeTab === "presets"}
                <div class="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                    {#each themes as theme}
                        <button
                            class="flex items-center gap-3 p-2 hover:bg-white/10 rounded text-left transition-colors w-full group"
                            onclick={() => setTheme(theme)}
                        >
                            <div class="flex gap-1">
                                {#each theme.colors.slice(0, 4) as color}
                                    <div
                                        class="w-4 h-4 rounded-full border border-white/20 group-hover:scale-110 transition-transform"
                                        style="background-color: {color}"
                                    ></div>
                                {/each}
                            </div>
                            <span
                                class="text-sm text-stone-300 font-mono group-hover:text-white transition-colors"
                                >{theme.name}</span
                            >
                        </button>
                    {/each}
                </div>
            {:else}
                <!-- Custom / Material You Editor -->
                <div class="flex flex-col gap-3 p-1">
                    <!-- Primary (Required) -->
                    <div class="flex flex-col gap-1">
                        <span
                            class="text-[10px] uppercase text-stone-500 font-bold tracking-widest"
                            >Primary</span
                        >
                        <label
                            class="flex items-center gap-3 p-2 bg-white/5 rounded cursor-pointer group hover:bg-white/10 transition-colors"
                        >
                            <div
                                class="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-inner"
                            >
                                <input
                                    type="color"
                                    class="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                    oninput={(e) =>
                                        updateCustomColor(
                                            0,
                                            e.currentTarget.value,
                                        )}
                                    value={$themeStore?.colors?.[0] ||
                                        "#4E56C0"}
                                />
                            </div>
                            <span class="text-xs font-mono text-stone-300"
                                >Source Color</span
                            >
                        </label>
                    </div>

                    <!-- Secondary -->
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-center">
                            <span
                                class="text-[10px] uppercase text-stone-500 font-bold tracking-widest"
                                >Secondary</span
                            >
                            {#if $themeStore?.colors?.[1]}
                                <button
                                    class="text-[10px] text-red-400 hover:text-red-300"
                                    onclick={() => removeCustomColor(1)}
                                    >Reset</button
                                >
                            {/if}
                        </div>
                        {#if $themeStore?.colors?.[1]}
                            <label
                                class="flex items-center gap-3 p-2 bg-white/5 rounded cursor-pointer group hover:bg-white/10 transition-colors"
                            >
                                <div
                                    class="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-inner"
                                >
                                    <input
                                        type="color"
                                        class="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                        oninput={(e) =>
                                            updateCustomColor(
                                                1,
                                                e.currentTarget.value,
                                            )}
                                        value={$themeStore.colors[1]}
                                    />
                                </div>
                                <span class="text-xs font-mono text-stone-300"
                                    >Override</span
                                >
                            </label>
                        {:else}
                            <button
                                class="p-2 text-xs text-stone-400 border border-dashed border-white/20 rounded hover:bg-white/5 hover:text-white transition-colors text-left"
                                onclick={() =>
                                    updateCustomColor(
                                        1,
                                        $themeStore?.colors?.[0] || "#4E56C0",
                                    )}
                            >
                                + Set Custom Secondary
                            </button>
                        {/if}
                    </div>

                    <!-- Tertiary -->
                    <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-center">
                            <span
                                class="text-[10px] uppercase text-stone-500 font-bold tracking-widest"
                                >Tertiary</span
                            >
                            {#if $themeStore?.colors?.[2]}
                                <button
                                    class="text-[10px] text-red-400 hover:text-red-300"
                                    onclick={() => removeCustomColor(2)}
                                    >Reset</button
                                >
                            {/if}
                        </div>
                        {#if $themeStore?.colors?.[2]}
                            <label
                                class="flex items-center gap-3 p-2 bg-white/5 rounded cursor-pointer group hover:bg-white/10 transition-colors"
                            >
                                <div
                                    class="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-inner"
                                >
                                    <input
                                        type="color"
                                        class="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
                                        oninput={(e) =>
                                            updateCustomColor(
                                                2,
                                                e.currentTarget.value,
                                            )}
                                        value={$themeStore.colors[2]}
                                    />
                                </div>
                                <span class="text-xs font-mono text-stone-300"
                                    >Override</span
                                >
                            </label>
                        {:else}
                            <button
                                class="p-2 text-xs text-stone-400 border border-dashed border-white/20 rounded hover:bg-white/5 hover:text-white transition-colors text-left"
                                onclick={() =>
                                    updateCustomColor(
                                        2,
                                        $themeStore?.colors?.[0] || "#4E56C0",
                                    )}
                            >
                                + Set Custom Tertiary
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    <button
        class="w-10 h-10 bg-black/80 hover:bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white transition-all shadow-lg backdrop-blur-sm"
        onclick={() => (isOpen = !isOpen)}
        title="Switch Theme"
    >
        <i
            class="fas fa-palette transition-transform duration-500"
            style="transform: rotate({isOpen ? 180 : 0}deg)"
        ></i>
    </button>
</div>
