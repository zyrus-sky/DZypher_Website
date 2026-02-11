<script lang="ts">
    import { RESOURCES, type Resource } from "$lib/data";
    import ResourceCard from "$lib/components/ResourceCard.svelte";
    import { fly, fade } from "svelte/transition";
    import { flip } from "svelte/animate";

    let selectedCategory = $state<string>("All");
    const categories = ["All", ...new Set(RESOURCES.map((r) => r.category))];

    let filteredResources = $derived(
        selectedCategory === "All"
            ? RESOURCES
            : RESOURCES.filter((r) => r.category === selectedCategory),
    );
</script>

<div
    id="resources"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center"
>
    <div class="container mx-auto px-6">
        <div class="text-center mb-12">
            <h1
                class="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-blue-500 mb-4"
            >
                Cheatsheet Library
            </h1>
            <p class="text-stone-400 text-lg max-w-2xl mx-auto">
                Essential references and guides for your Data Science journey.
            </p>
        </div>

        <!-- Filter Bar -->
        <div class="flex flex-wrap justify-center gap-3 mb-10">
            {#each categories as category}
                <button
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-white/10
                    {selectedCategory === category
                        ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_15px_var(--color-primary-500)]'
                        : 'bg-black/30 text-stone-400 hover:bg-white/10 hover:text-white'}"
                    onclick={() => (selectedCategory = category)}
                >
                    {category}
                </button>
            {/each}
        </div>

        <!-- Grid -->
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar p-2"
        >
            {#each filteredResources as resource (resource.title)}
                <div
                    animate:flip={{ duration: 300 }}
                    in:fly={{ y: 20, duration: 300 }}
                    out:fade={{ duration: 200 }}
                >
                    <ResourceCard {resource} />
                </div>
            {/each}
        </div>
    </div>
</div>
