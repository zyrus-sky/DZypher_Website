<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { fade, scale } from "svelte/transition";

    let isOpen = false;
    let query = "";
    let selectedIndex = 0;
    let searchInput: HTMLInputElement;

    const items = [
        {
            id: "home",
            title: "Home",
            type: "Page",
            action: () => scrollTo("top"),
        },
        {
            id: "programs",
            title: "Programs",
            type: "Section",
            action: () => scrollTo("programs"),
        },
        {
            id: "roadmap",
            title: "Roadmap",
            type: "Section",
            action: () => scrollTo("roadmap"),
        },
        {
            id: "showcase",
            title: "Showcase",
            type: "Section",
            action: () => scrollTo("gallery"),
        },
        {
            id: "team",
            title: "Team",
            type: "Section",
            action: () => scrollTo("team"),
        },
        {
            id: "fanfic",
            title: "Fanficx",
            type: "Section",
            action: () => scrollTo("fanficx"),
        },
        // Placeholder items - in a real app these would be dynamic
        {
            id: "mach",
            title: "Mach Learning",
            type: "Program",
            action: () => scrollTo("programs"),
        },
        {
            id: "web",
            title: "Web Dev",
            type: "Program",
            action: () => scrollTo("programs"),
        },
    ];

    $: filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()),
    );

    function scrollTo(id: string) {
        if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
        close();
    }

    function open() {
        isOpen = true;
        setTimeout(() => searchInput?.focus(), 50);
    }

    function close() {
        isOpen = false;
        query = "";
        selectedIndex = 0;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            isOpen ? close() : open();
        }

        if (!isOpen) return;

        if (e.key === "Escape") {
            close();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % filteredItems.length;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex =
                (selectedIndex - 1 + filteredItems.length) %
                filteredItems.length;
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = filteredItems[selectedIndex];
            if (item) item.action();
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
        on:click|self={close}
        transition:fade={{ duration: 150 }}
    >
        <div
            class="w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] glass-panel"
            transition:scale={{ start: 0.95, duration: 150 }}
        >
            <div class="flex items-center px-4 border-b border-white/10">
                <i class="fas fa-search text-gray-400 mr-3"></i>
                <input
                    bind:this={searchInput}
                    bind:value={query}
                    class="w-full bg-transparent py-4 text-white placeholder-gray-500 focus:outline-none"
                    placeholder="Type a command or search..."
                />
                <span
                    class="text-xs text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded"
                    >ESC</span
                >
            </div>

            <div class="overflow-y-auto py-2">
                {#if filteredItems.length === 0}
                    <div class="px-4 py-8 text-center text-gray-500">
                        No results found.
                    </div>
                {:else}
                    <div
                        class="text-xs font-semibold text-gray-500 px-4 py-2 uppercase tracking-wider"
                    >
                        Suggestions
                    </div>
                    {#each filteredItems as item, i}
                        <button
                            class="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left {i ===
                            selectedIndex
                                ? 'bg-white/10'
                                : ''}"
                            on:click={item.action}
                            on:mousemove={() => (selectedIndex = i)}
                        >
                            <span class="text-gray-200">{item.title}</span>
                            <span class="text-xs text-gray-500"
                                >{item.type}</span
                            >
                        </button>
                    {/each}
                {/if}
            </div>

            <div
                class="px-4 py-2 border-t border-white/10 bg-black/20 text-xs text-gray-500 flex justify-between"
            >
                <span
                    ><span class="font-bold text-gray-400">↑↓</span> to navigate</span
                >
                <span
                    ><span class="font-bold text-gray-400">↵</span> to select</span
                >
            </div>
        </div>
    </div>
{/if}
