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

```
<div
    id="roadmap"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center relative overflow-hidden"
>
    <!-- Simple Background Decor -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-900/10 blur-[100px] rounded-full pointer-events-none"
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
                        class="reveal-fade-up group relative pl-8 border-l-2 border-primary-900/30 hover:border-primary-500 transition-colors"
                        style="transition-delay: {i * 100}ms"
                    >
                        <!-- INLINED ROADMAP NODE COMPONENT -->
                        <div
                            class="relative flex gap-8 items-start group"
                            in:fly={{ y: 20, duration: 500, delay: i * 100 }}
                        >
                            <!-- Timeline Line -->
                            <div
                                class="flex flex-col items-center self-stretch"
                            >
                                <button
                                    type="button"
                                    class="w-12 h-12 rounded-full border-2 border-primary-600 bg-black flex items-center justify-center z-10
                                    group-hover:bg-primary-900/50 group-hover:scale-110 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgb(var(--color-primary-600-rgb)/0.3)] focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    onclick={() => toggleNode(i)}
                                    aria-label="Toggle details for {node.title}"
                                >
                                    <i
                                        class="{node.icon} text-primary-500 text-xl group-hover:text-white transition-colors"
                                    ></i>
                                </button>
                                {#if i !== roadmap.length - 1}
                                    <div
                                        class="w-0.5 flex-grow bg-gradient-to-b from-primary-800 to-primary-900/10 my-2"
                                    ></div>
                                {/if}
                            </div>

                            <!-- Content -->
                            <div class="pb-12 flex-1 pt-2">
                                <button
                                    type="button"
                                    class="text-left text-2xl font-bold text-white mb-2 cursor-pointer hover:text-primary-400 transition-colors focus:outline-none"
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
                                        class="bg-primary-950/10 border border-primary-900/30 rounded-lg p-4 backdrop-blur-sm"
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
                                                        class="flex items-center justify-between gap-4 text-sm bg-black/40 p-2 rounded border border-white/5"
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
                                                                class="text-xs px-2 py-1 bg-primary-900/50 hover:bg-primary-700 text-primary-100 rounded transition-colors uppercase font-bold tracking-wider"
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
                {/each}
            </div>
        </div>
    </div>
</div>
