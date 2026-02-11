<script lang="ts">
    import { PROJECTS } from "$lib/data";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import { reveal } from "$lib/actions";
    import { fade } from "svelte/transition";
    import { flip } from "svelte/animate";

    let activeCategory = "All";
    const categories = ["All", "Code", "Design", "Art", "Event"];

    // Reactive statement to filter items based on activeCategory
    $: filteredItems =
        activeCategory === "All"
            ? PROJECTS
            : PROJECTS.filter((item) => item.category === activeCategory);

    function setCategory(cat: string) {
        activeCategory = cat;
    }
</script>

<div
    id="gallery"
    class="min-h-screen py-24 px-6 md:px-12 flex flex-col justify-center snap-start"
>
    <!-- Header with Filters -->
    <div
        class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
    >
        <div>
            <h2
                use:reveal
                class="reveal-fade-right text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-white mb-4"
            >
                Showcase
            </h2>
            <p
                use:reveal
                class="reveal-fade-right delay-100 text-stone-400 max-w-xl text-lg font-light leading-relaxed"
            >
                Highlighted projects and creative works from our community.
            </p>
        </div>

        <!-- Filter Buttons -->
        <div use:reveal class="reveal-fade-left delay-200 flex flex-wrap gap-2">
            {#each categories as cat}
                <button
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10
                    {activeCategory === cat
                        ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                        : 'bg-black/30 text-stone-400 hover:text-white hover:bg-white/5'}"
                    on:click={() => setCategory(cat)}
                >
                    {cat}
                </button>
            {/each}
        </div>
    </div>

    <!-- Grid -->
    {#if PROJECTS.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each filteredItems as item, i (item.title)}
                <div
                    animate:flip={{ duration: 300 }}
                    in:fade={{ duration: 300, delay: i * 50 }}
                >
                    <ProjectCard project={item} />
                </div>
            {/each}
        </div>
    {:else}
        <!-- This block will likely not be reached if PROJECTS is directly imported and not empty -->
        <div class="text-center text-stone-500 py-20 italic">
            No projects found.
        </div>
    {/if}

    <!-- Call to Action -->
    <div class="mt-20 text-center" use:reveal>
        <div
            class="reveal-scale inline-block p-[2px] rounded-full bg-gradient-to-r from-red-500 to-blue-500"
        >
            <div class="bg-black rounded-full px-8 py-4">
                <p class="text-stone-300">
                    Have a project to feature? <a
                        href="javascript:void(0)"
                        class="text-white font-bold hover:underline"
                        >Submit it here</a
                    >
                </p>
            </div>
        </div>
    </div>
</div>
