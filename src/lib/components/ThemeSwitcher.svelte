<script lang="ts">
    import { themeStore } from "$lib/stores";
    import { fade } from "svelte/transition";

    // Svelte 5: Use $state for reactive variables
    let isOpen = $state(false);

    // Hardcoded themes for now, later could be fetched
    const themes = [
        {
            name: "DZypher Red",
            colors: ["#7f1d1d", "#ef4444", "#fca5a5", "#fef2f2"],
            logo: "DZypher",
        },
        {
            name: "Vortix 26",
            colors: ["#4E56C0", "#9B5DE0", "#D78FEE", "#FDCFFA"],
            logo: "VORTIX",
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
</script>

<div class="fixed bottom-4 left-4 z-[9999]">
    {#if isOpen}
        <div
            class="mb-2 bg-black/90 border border-white/20 rounded-lg p-2 flex flex-col gap-2 shadow-xl"
            transition:fade
        >
            {#each themes as theme}
                <button
                    class="flex items-center gap-3 p-2 hover:bg-white/10 rounded text-left transition-colors"
                    onclick={() => setTheme(theme)}
                >
                    <div class="flex gap-1">
                        {#each theme.colors as color}
                            <div
                                class="w-4 h-4 rounded-full border border-white/20"
                                style="background-color: {color}"
                            ></div>
                        {/each}
                    </div>
                    <span class="text-sm text-stone-300 font-mono"
                        >{theme.name}</span
                    >
                </button>
            {/each}
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
