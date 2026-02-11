<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import type { RoadmapItem } from "$lib/data";

    // Svelte 5: Props using $props()
    let {
        item,
        index,
        isLast = false,
    }: { item: RoadmapItem; index: number; isLast?: boolean } = $props();

    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div
    class="relative flex gap-8 items-start group"
    in:fly={{ y: 20, duration: 500, delay: index * 100 }}
>
    <!-- Timeline Line -->
    <div class="flex flex-col items-center self-stretch">
        <button
            type="button"
            class="w-12 h-12 rounded-full border-2 border-primary-600 bg-black flex items-center justify-center z-10
            group-hover:bg-primary-900/50 group-hover:scale-110 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgb(var(--color-primary-600-rgb)/0.3)] focus:outline-none focus:ring-2 focus:ring-primary-500"
            onclick={toggle}
            aria-label="Toggle details for {item.title}"
        >
            <i
                class="{item.icon} text-primary-500 text-xl group-hover:text-white transition-colors"
            ></i>
        </button>
        {#if !isLast}
            <div
                class="w-0.5 flex-grow bg-gradient-to-b from-primary-800 to-primary-900/10 my-2"
            ></div>
        {/if}
    </div>

    <!-- Content -->
    <div class="pb-12 flex-1 pt-2">
        <button
            type="button"
            class="text-left text-2xl font-bold text-white mb-2 cursor-pointer hover:text-red-400 transition-colors focus:outline-none"
            onclick={toggle}
        >
            {item.title}
        </button>
        <p class="text-stone-400 mb-4 font-light text-sm md:text-base">
            {item.description}
        </p>

        {#if isOpen}
            <div
                in:fly={{ y: -10, duration: 300 }}
                out:fade={{ duration: 200 }}
                class="bg-red-950/10 border border-red-900/30 rounded-lg p-4 backdrop-blur-sm"
            >
                <h4
                    class="text-red-300 text-xs uppercase font-bold tracking-wider mb-3"
                >
                    Event Highlights
                </h4>
                <ul class="space-y-2">
                    {#each item.resources as resource}
                        <li>
                            <div
                                class="flex items-center justify-between gap-4 text-sm bg-black/40 p-2 rounded border border-white/5"
                            >
                                <div
                                    class="flex items-center gap-2 text-stone-300"
                                >
                                    <i class="fas fa-star text-xs text-red-500"
                                    ></i>
                                    {resource.title}
                                </div>

                                {#if resource.registration_status === "OPEN"}
                                    <a
                                        href={resource.registration_link}
                                        target="_blank"
                                        class="text-xs px-2 py-1 bg-red-900/50 hover:bg-red-700 text-red-100 rounded transition-colors uppercase font-bold tracking-wider"
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
