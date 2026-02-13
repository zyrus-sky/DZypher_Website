<script lang="ts">
    import { PROJECTS } from "$lib/data";
    import { reveal } from "$lib/actions";
    import { fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import TiltCard from "$lib/components/TiltCard.svelte";

    let activeCategory = $state("All");
    const categories = ["All", "Code", "Design", "Art", "Event"];

    let filteredItems = $derived(
        activeCategory === "All"
            ? PROJECTS
            : PROJECTS.filter((item) => item.category === activeCategory),
    );

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
                        ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_15px_var(--color-primary-500)]'
                        : 'bg-black/30 text-stone-400 hover:text-white hover:bg-white/5'}"
                    onclick={() => setCategory(cat)}
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
                    <!-- INLINED PROJECT CARD COMPONENT -->
                    <TiltCard>
                        <div
                            class="group relative overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm h-full"
                        >
                            <!-- Image with Overlay -->
                            <div class="relative h-48 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"
                                ></div>

                                <!-- Floating Links -->
                                <div
                                    class="absolute top-4 right-4 flex gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                    {#if item.github}
                                        <a
                                            href={item.github}
                                            target="_blank"
                                            class="p-2 bg-black/50 rounded-full hover:bg-white text-white hover:text-black transition-colors backdrop-blur-md"
                                            aria-label="View Source on GitHub"
                                        >
                                            <i class="fab fa-github"></i>
                                        </a>
                                    {/if}
                                    {#if item.link}
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            class="p-2 bg-black/50 rounded-full hover:bg-primary-600 text-white transition-colors backdrop-blur-md"
                                            aria-label="Visit Project Link"
                                        >
                                            <i class="fas fa-external-link-alt"
                                            ></i>
                                        </a>
                                    {/if}
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="p-6 relative">
                                <div class="absolute -top-10 left-6">
                                    <span
                                        class="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg"
                                    >
                                        {item.student}
                                    </span>
                                </div>

                                <h3
                                    class="text-2xl font-bold text-white mb-2 mt-2"
                                >
                                    {item.title}
                                </h3>
                                <p
                                    class="text-stone-400 text-sm mb-4 line-clamp-2"
                                >
                                    {item.description}
                                </p>

                                <!-- Tech Stack -->
                                <div class="flex flex-wrap gap-2 mt-auto">
                                    {#each item.techStack as tech}
                                        <span
                                            class="px-2 py-1 text-xs font-mono text-cyan-300 bg-cyan-900/20 border border-cyan-500/30 rounded"
                                        >
                                            {tech}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            {/each}
        </div>
    {:else}
        <div class="text-center text-stone-500 py-20 italic">
            No projects found.
        </div>
    {/if}

    <!-- Call to Action -->
    <div class="mt-20 text-center" use:reveal>
        <div
            class="reveal-scale inline-block p-[2px] rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
        >
            <div class="bg-black rounded-full px-8 py-4">
                <p class="text-stone-300">
                    Have a project to feature? <a
                        href="/#contact"
                        class="text-white font-bold hover:underline"
                        >Submit it here</a
                    >
                </p>
            </div>
        </div>
    </div>
</div>
