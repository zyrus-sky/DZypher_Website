<script lang="ts">
    import { RESOURCES, type Resource } from "$lib/data";
    import { fly, fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import TiltCard from "$lib/components/TiltCard.svelte";

    let selectedCategory = $state<string>("All");
    const categories = ["All", ...new Set(RESOURCES.map((r) => r.category))];

    let filteredResources = $derived(
        selectedCategory === "All"
            ? RESOURCES
            : RESOURCES.filter((r) => r.category === selectedCategory),
    );

    // Map categories to colors/icons for Card Logic
    const categoryConfig: Record<string, any> = {
        Python: {
            color: "text-blue-400",
            border: "border-blue-500/30",
            icon: "fab fa-python",
        },
        Mathematics: {
            color: "text-purple-400",
            border: "border-purple-500/30",
            icon: "fas fa-square-root-alt",
        },
        "Machine Learning": {
            color: "text-green-400",
            border: "border-green-500/30",
            icon: "fas fa-brain",
        },
        "Deep Learning": {
            color: "text-primary-400",
            border: "border-primary-500/30",
            icon: "fas fa-network-wired",
        },
        Other: {
            color: "text-gray-400",
            border: "border-gray-500/30",
            icon: "fas fa-file-alt",
        },
    };

    let innerWidth = $state(0);
    let showAll = $state(false);

    // Determine limit based on screen size and showAll state
    const limit = $derived(
        showAll ? filteredResources.length : innerWidth < 768 ? 3 : 6,
    );
    const displayedResources = $derived(filteredResources.slice(0, limit));

    function getConfig(category: string) {
        return categoryConfig[category] || categoryConfig["Other"];
    }
</script>

<svelte:window bind:innerWidth />

<div
    id="resources"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center"
>
    <div class="container mx-auto px-6">
        <div class="text-center mb-12">
            <h1
                class="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-300 mb-4"
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
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm
                    {selectedCategory === category
                        ? 'bg-primary-600/80 text-white border-primary-500 shadow-[0_0_15px_var(--color-primary-500)]'
                        : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}"
                    onclick={() => {
                        selectedCategory = category;
                        showAll = false; // Reset view on filter change
                    }}
                >
                    {category}
                </button>
            {/each}
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
            {#each displayedResources as resource, i (resource.title)}
                {@const config = getConfig(resource.category)}
                <div
                    animate:flip={{ duration: 300 }}
                    in:fly={{ y: 20, duration: 300 }}
                    out:fade={{ duration: 200 }}
                    class="idle-float"
                    style="animation-delay: {i * 0.4}s;"
                >
                    <TiltCard>
                        <!-- INLINED RESOURCE CARD COMPONENT -->
                        <div
                            class="group relative bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--color-primary-500-rgb),0.15)] hover:border-primary-500/30 flex flex-col h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                        >
                            <!-- Decorator Glow -->
                            <div
                                class="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-500"
                            ></div>

                            <div
                                class="flex justify-between items-start mb-4 relative z-10"
                            >
                                <div
                                    class="p-3 bg-white/5 rounded-xl border border-white/10 {config.color} backdrop-blur-sm"
                                >
                                    <i class="{config.icon} text-2xl"></i>
                                </div>
                                <span
                                    class="text-xs font-mono text-stone-400 px-2 py-1 bg-black/20 rounded-md border border-white/10"
                                >
                                    {resource.size || "PDF"}
                                </span>
                            </div>

                            <h3
                                class="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1"
                            >
                                {resource.title}
                            </h3>

                            <p
                                class="text-stone-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed"
                            >
                                {resource.description}
                            </p>

                            <a
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 text-sm font-bold {config.color} hover:brightness-125 transition-all mt-auto group-hover:gap-3"
                            >
                                <span
                                    >{resource.size?.startsWith("PDF")
                                        ? "Download PDF"
                                        : resource.size?.startsWith("PNG")
                                          ? "View Image"
                                          : "Open Guide"}</span
                                >
                                <i
                                    class="fas {resource.size?.startsWith('PDF')
                                        ? 'fa-download'
                                        : 'fa-external-link-alt'} text-xs transform group-hover:translate-x-0.5 transition-transform"
                                ></i>
                            </a>
                        </div>
                    </TiltCard>
                </div>
            {/each}
        </div>

        <!-- View More Button -->
        {#if filteredResources.length > (innerWidth < 768 ? 3 : 6)}
            <div class="flex justify-center mt-12">
                <button
                    onclick={() => (showAll = !showAll)}
                    class="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 rounded-full text-white font-bold transition-all duration-300 backdrop-blur-md flex items-center gap-2 group"
                >
                    {showAll ? "Show Less" : "View All Resources"}
                    <i
                        class="fas {showAll
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down'} group-hover:translate-y-0.5 transition-transform"
                    ></i>
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .idle-float {
        animation: float 4s ease-in-out infinite;
    }
    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-6px);
        }
    }
</style>
