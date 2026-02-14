<script lang="ts">
    import { fetchShowcaseLive, type ShowcaseItem } from "$lib/csvParser";
    import { reveal } from "$lib/actions";
    import { fade, slide } from "svelte/transition";
    import { flip } from "svelte/animate";
    import TiltCard from "$lib/components/TiltCard.svelte";
    import { onMount } from "svelte";

    let activeCategory = $state("All");
    let projects = $state<ShowcaseItem[]>([]);
    let isLoading = $state(true);

    const categories = ["All", "Code", "Design", "Art", "Event"];

    onMount(async () => {
        projects = await fetchShowcaseLive();
        isLoading = false;
    });

    let filteredItems = $derived(
        activeCategory === "All"
            ? projects
            : projects.filter((item) => item.category === activeCategory),
    );

    function setCategory(cat: string) {
        activeCategory = cat;
    }

    let activeProjectId = $state<string | null>(null);

    function toggleProject(title: string) {
        if (activeProjectId === title) {
            activeProjectId = null;
        } else {
            activeProjectId = title;
        }
    }

    function handleImageError(e: Event) {
        const img = e.target as HTMLImageElement;
        const src = img.src;
        // Check if it's already a fallback to avoid infinite loop
        if (src.includes("drive.google.com/uc?export=view")) return;

        // Extract ID from lh3 url: .../d/{id}
        // OR from thumbnail url: ...id={id}...
        let id = "";
        const match1 = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1) id = match1[1];
        else {
            const match2 = src.match(/id=([a-zA-Z0-9_-]+)/);
            if (match2) id = match2[1];
        }

        if (id) {
            // Switch to UC export view as fallback
            img.src = `https://drive.google.com/uc?export=view&id=${id}`;
        }
    }

    function extractGithubUser(url: string): string | null {
        if (!url) return null;
        const match = url.match(/github\.com\/([^\/]+)/);
        return match ? match[1] : null;
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
    {#if isLoading}
        <div class="text-center py-20">
            <i class="fas fa-spinner fa-spin text-3xl text-primary-400 mb-4"
            ></i>
            <p class="text-stone-500 font-mono">Loading showcase...</p>
        </div>
    {:else if projects.length > 0}
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
        >
            {#each filteredItems as item, i (item.title)}
                {@const githubUser = extractGithubUser(item.github)}
                {@const isActive = activeProjectId === item.title}
                <div
                    animate:flip={{ duration: 300 }}
                    in:fade={{ duration: 300, delay: i * 50 }}
                    class="h-auto"
                >
                    <!-- INLINED PROJECT CARD COMPONENT -->
                    <TiltCard>
                        <div
                            class="group relative overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm w-full cursor-pointer transition-all duration-300 transform"
                            onclick={() => toggleProject(item.title)}
                            onkeydown={(e) =>
                                e.key === "Enter" && toggleProject(item.title)}
                            role="button"
                            tabindex="0"
                        >
                            <!-- Image Container (Always Visible) -->
                            <div
                                class="relative h-56 overflow-hidden border-b border-white/5"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    referrerpolicy="no-referrer"
                                    onerror={handleImageError}
                                />

                                <!-- Floating Links -->
                                <div class="absolute top-3 right-3 flex gap-2">
                                    {#if item.github}
                                        <a
                                            href={item.github}
                                            target="_blank"
                                            class="p-2 bg-black/60 rounded-full hover:bg-white text-white hover:text-black transition-colors backdrop-blur-md border border-white/10"
                                            aria-label="View Source on GitHub"
                                            onclick={(e) => e.stopPropagation()}
                                        >
                                            <i class="fab fa-github"></i>
                                        </a>
                                    {/if}
                                    {#if item.link}
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            class="p-2 bg-black/60 rounded-full hover:bg-primary-600 text-white transition-colors backdrop-blur-md border border-white/10"
                                            aria-label="Visit Project Link"
                                            onclick={(e) => e.stopPropagation()}
                                        >
                                            <i class="fas fa-external-link-alt"
                                            ></i>
                                        </a>
                                    {/if}
                                </div>

                                <div class="absolute bottom-3 left-3">
                                    <span
                                        class="inline-block px-3 py-1 bg-primary-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg border border-white/10"
                                    >
                                        {item.student}
                                    </span>
                                </div>
                            </div>

                            <!-- Content Header -->
                            <div class="p-5 pb-2">
                                <h3
                                    class="text-xl font-bold text-white leading-tight"
                                >
                                    {item.title}
                                </h3>
                                <p
                                    class="text-stone-400 text-sm mt-1 line-clamp-2 {isActive
                                        ? 'hidden'
                                        : ''}"
                                >
                                    {item.description}
                                </p>
                            </div>

                            <!-- Expandable Content -->
                            {#if isActive}
                                <div
                                    transition:slide={{
                                        duration: 300,
                                        axis: "y",
                                    }}
                                    class="px-5 pb-5 pt-0 overflow-hidden"
                                >
                                    <div
                                        class="pt-2 border-t border-white/10 mt-2"
                                    >
                                        <p
                                            class="text-stone-300 text-sm leading-relaxed mb-4"
                                        >
                                            {item.description}
                                        </p>

                                        <!-- Tech Stack -->
                                        <div class="flex flex-wrap gap-2 mb-4">
                                            {#each item.techStack as tech}
                                                <span
                                                    class="px-2 py-1 text-[10px] font-mono text-cyan-300 bg-cyan-900/30 border border-cyan-500/30 rounded"
                                                >
                                                    {tech}
                                                </span>
                                            {/each}
                                        </div>

                                        <!-- GitHub Section -->
                                        {#if githubUser}
                                            <div
                                                class="bg-white/5 rounded-lg p-3 border border-white/10 mt-4"
                                            >
                                                <div
                                                    class="flex items-center gap-3 mb-3"
                                                >
                                                    <img
                                                        src="https://github.com/{githubUser}.png"
                                                        alt={githubUser}
                                                        class="w-10 h-10 rounded-full border border-white/20"
                                                    />
                                                    <div class="flex-1 min-w-0">
                                                        <p
                                                            class="text-[10px] text-stone-500 uppercase tracking-widest"
                                                        >
                                                            Maintainer
                                                        </p>
                                                        <p
                                                            class="text-white font-bold text-sm truncate"
                                                        >
                                                            @{githubUser}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={item.github}
                                                        target="_blank"
                                                        class="px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-stone-200 transition-colors"
                                                        onclick={(e) =>
                                                            e.stopPropagation()}
                                                    >
                                                        View Repo
                                                    </a>
                                                </div>

                                                <!-- Contribution Graph -->
                                                <div class="mt-3">
                                                    <div
                                                        class="flex justify-between items-end mb-1"
                                                    >
                                                        <span
                                                            class="text-[10px] text-stone-500 uppercase tracking-wider"
                                                            >Contribution Graph</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="bg-black/40 rounded p-1 overflow-hidden h-24 flex items-center justify-center"
                                                    >
                                                        <img
                                                            src="https://github-readme-activity-graph.vercel.app/graph?username={githubUser}&theme=react-dark&hide_border=true&area=true"
                                                            alt="Contribution Graph for {githubUser}"
                                                            class="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                                                            loading="lazy"
                                                            onerror={(e) => {
                                                                const img =
                                                                    e.target as HTMLImageElement;
                                                                // Use ghchart as fallback if the primary fails
                                                                if (
                                                                    img.src.includes(
                                                                        "github-readme-activity-graph",
                                                                    )
                                                                ) {
                                                                    img.src = `https://ghchart.rshah.io/409ba5/${githubUser}`;
                                                                } else {
                                                                    img.style.display =
                                                                        "none";
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {:else}
                                <!-- Minimized Footer (Tech Stack Preview) -->
                                <div
                                    class="px-5 pb-5 pt-2 flex flex-wrap gap-1 opacity-60"
                                >
                                    {#each item.techStack.slice(0, 3) as tech}
                                        <span
                                            class="w-2 h-2 rounded-full bg-cyan-500/50"
                                        ></span>
                                    {/each}
                                </div>
                            {/if}
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
