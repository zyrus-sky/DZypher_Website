<script lang="ts">
    import { DS_ROADMAP, type RoadmapItem } from "$lib/data";
    import { fetchEventsLive } from "$lib/csvParser";
    import { reveal } from "$lib/actions";
    import { fly, fade } from "svelte/transition";

    // Initialize roadmap with isOpen state directly
    let roadmap = $state(
        JSON.parse(JSON.stringify(DS_ROADMAP)).map((node: RoadmapItem) => ({
            ...node,
            isOpen: false,
        })),
    );

    let loading = $state(true);

    function toggleNode(index: number) {
        roadmap[index].isOpen = !roadmap[index].isOpen;
    }

    $effect(() => {
        (async () => {
            const events = await fetchEventsLive();
            const vortixNode = roadmap.find(
                (item: any) => item.id === "vortix-26",
            );
            if (vortixNode && events.length > 0) {
                vortixNode.resources = events.map((e: any) => ({
                    title: e.title,
                    link: e.registration_link || "#",
                    registration_status: e.registration_status,
                }));
            }
            loading = false;
        })();
    });
</script>

<div
    id="roadmap"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center relative overflow-hidden"
>
    <!-- Background Glow -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-900/10 blur-[100px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
        <h2
            use:reveal
            class="reveal-fade-up text-4xl md:text-5xl font-bold mb-16 text-center text-primary-500 font-neuropol"
        >
            Roadmap
        </h2>

        <div class="max-w-4xl mx-auto px-4">
            <div class="space-y-12">
                {#each roadmap as node, i (node.id)}
                    <div
                        use:reveal
                        class="reveal-fade-up group relative pl-2 md:pl-8"
                        style="transition-delay: {i * 100}ms"
                    >
                        <!-- Animated Connecting Line -->
                        {#if i !== roadmap.length - 1}
                            <div
                                class="absolute left-[25px] md:left-[39px] top-[56px] w-[2px] h-[calc(100%-20px)] overflow-hidden"
                            >
                                <div
                                    class="w-full h-full bg-gradient-to-b from-primary-500/50 via-primary-500/20 to-transparent timeline-shimmer"
                                ></div>
                            </div>
                        {/if}

                        <!-- ROADMAP NODE -->
                        <div
                            class="relative flex gap-4 md:gap-8 items-start"
                            in:fly={{ y: 20, duration: 500, delay: i * 100 }}
                        >
                            <!-- Timeline Dot -->
                            <div
                                class="flex flex-col items-center self-stretch"
                            >
                                <button
                                    type="button"
                                    class="w-12 h-12 rounded-full border-2 border-primary-600 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10
                                    group-hover:bg-primary-900/50 group-hover:scale-110 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgb(var(--color-primary-600-rgb)/0.4)] focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                                    onclick={() => toggleNode(i)}
                                    aria-label="Toggle details for {node.title}"
                                >
                                    <i
                                        class="{node.icon} text-primary-500 text-xl group-hover:text-white transition-colors"
                                    ></i>
                                    <!-- Pulsing Ring -->
                                    <div
                                        class="absolute inset-0 rounded-full border border-primary-500/30 animate-ping opacity-30 pointer-events-none"
                                    ></div>
                                </button>
                            </div>

                            <!-- Content Card with Glassmorphism + Frost -->
                            <div class="pb-8 flex-1 pt-1">
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    class="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 md:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/8 hover:border-primary-500/20 hover:shadow-[0_0_30px_rgba(var(--color-primary-500-rgb),0.08)] idle-float overflow-hidden"
                                    style="animation-delay: {i * 0.5}s;"
                                    onmousemove={(e) => {
                                        const rect =
                                            e.currentTarget.getBoundingClientRect();
                                        e.currentTarget.style.setProperty(
                                            "--x",
                                            `${e.clientX - rect.left}px`,
                                        );
                                        e.currentTarget.style.setProperty(
                                            "--y",
                                            `${e.clientY - rect.top}px`,
                                        );
                                    }}
                                >
                                    <!-- Frost Spotlight -->
                                    <div
                                        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl z-0"
                                        style="background: radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.15), transparent 40%);"
                                    ></div>
                                    <button
                                        type="button"
                                        class="text-left text-xl md:text-2xl font-bold text-white mb-2 cursor-pointer hover:text-primary-400 transition-colors focus:outline-none block w-full"
                                        onclick={() => toggleNode(i)}
                                    >
                                        {node.title}
                                    </button>
                                    <p
                                        class="text-stone-400 mb-4 font-light text-sm md:text-base"
                                    >
                                        {node.description}
                                    </p>

                                    {#if node.isOpen}
                                        <div
                                            in:fly={{ y: -10, duration: 300 }}
                                            out:fade={{ duration: 200 }}
                                            class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                        >
                                            <h4
                                                class="text-primary-300 text-xs uppercase font-bold tracking-wider mb-3"
                                            >
                                                Event Highlights
                                            </h4>
                                            <ul class="space-y-2">
                                                {#each node.resources as resource}
                                                    <li>
                                                        <div
                                                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-sm bg-black/40 backdrop-blur-sm p-3 rounded-lg border border-white/5 hover:border-primary-500/20 transition-colors"
                                                        >
                                                            <div
                                                                class="flex items-center gap-2 text-stone-300"
                                                            >
                                                                <i
                                                                    class="fas fa-star text-xs text-primary-500"
                                                                ></i>
                                                                {resource.title}
                                                            </div>

                                                            {#if resource.registration_status === "OPEN"}
                                                                <a
                                                                    href={resource.link}
                                                                    target="_blank"
                                                                    class="text-xs px-3 py-1.5 bg-primary-900/50 hover:bg-primary-700 text-primary-100 rounded-lg transition-colors uppercase font-bold tracking-wider"
                                                                >
                                                                    Register
                                                                </a>
                                                            {:else if resource.registration_status === "CLOSED"}
                                                                <span
                                                                    class="text-xs text-stone-600 font-mono uppercase"
                                                                    >Closed</span
                                                                >
                                                            {/if}
                                                        </div>
                                                    </li>
                                                {/each}
                                            </ul>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
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

    .timeline-shimmer {
        background-size: 100% 200%;
        animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
        0%,
        100% {
            background-position: 0% 0%;
        }
        50% {
            background-position: 0% 100%;
        }
    }
</style>
