<script lang="ts">
    import { RESOURCES, type Resource } from "$lib/data";
    import { fly, fade } from "svelte/transition";
    import { flip } from "svelte/animate";

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

    function getConfig(category: string) {
        return categoryConfig[category] || categoryConfig["Other"];
    }
</script>

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
                {@const config = getConfig(resource.category)}
                <div
                    animate:flip={{ duration: 300 }}
                    in:fly={{ y: 20, duration: 300 }}
                    out:fade={{ duration: 200 }}
                >
                    <!-- INLINED RESOURCE CARD COMPONENT -->
                    <div
                        class="group relative bg-black/40 backdrop-blur-md border {config.border} p-6 rounded-xl overflow-hidden hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] flex flex-col h-full"
                    >
                        <!-- Decorator Glow -->
                        <div
                            class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl group-hover:from-white/20 transition-all"
                        ></div>

                        <div
                            class="flex justify-between items-start mb-4 relative z-10"
                        >
                            <div
                                class="p-3 bg-white/5 rounded-lg {config.color}"
                            >
                                <i class="{config.icon} text-2xl"></i>
                            </div>
                            <span
                                class="text-xs font-mono text-stone-500 px-2 py-1 bg-black/50 rounded border border-white/5"
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
                            class="text-stone-400 text-sm mb-6 flex-grow line-clamp-3"
                        >
                            {resource.description}
                        </p>

                        <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 text-sm font-semibold {config.color} hover:text-white transition-colors mt-auto"
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
                                    : 'fa-external-link-alt'} text-xs transform group-hover:translate-y-0.5 transition-transform"
                            ></i>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
