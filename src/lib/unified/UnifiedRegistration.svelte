<script lang="ts">
    import Ticket3D from "$lib/components/Ticket3D/index.svelte";
    import EventListCard from "$lib/components/EventListCard.svelte";
    import Magnetic from "$lib/components/Magnetic.svelte";
    import { fade, slide } from "svelte/transition";

    export let events: any[] = [];

    // Filter Logic
    let selectedCategory = "Workshops"; // Default to Workshops as per screenshot focus? Or 'All'? User asked to add options.
    // Let's default to 'Workshops' to match the specific "Workshop" tag in screenshot if desired, but 'All' is safer.
    // Actually, user said "filter workshops, competition, and entertainment".
    // Let's start with "Workshops" if that's the primary focus, or "All".
    // I'll stick to "All" or the first available category.
    // Actually, let's default to 'All'.
    let categoryFilter = "All";

    const categories = ["All", "Workshops", "Competitions", "Entertainment"];

    // Reactive filtering
    $: filteredEvents = events.filter((e) => {
        if (categoryFilter === "All") return true;

        const type = e.type?.toLowerCase() || "";
        const title = e.title?.toLowerCase() || "";

        if (categoryFilter === "Workshops") {
            return type.includes("workshop");
        }
        if (categoryFilter === "Competitions") {
            return (
                type.includes("competition") ||
                title.includes("hack") ||
                title.includes("code") ||
                title.includes("contest")
            );
        }
        if (categoryFilter === "Entertainment") {
            return (
                type.includes("entertainment") ||
                title.includes("concert") ||
                title.includes("party") ||
                title.includes("music") ||
                type.includes("game")
            );
        }
        return true;
    });

    // We only show top 2 in this view
    $: displayedEvents = filteredEvents.slice(0, 2);

    function setFilter(cat: string) {
        categoryFilter = cat;
    }

    let innerWidth = 0;
    // Responsive Camera Z: Zoom out on mobile (20) to make it smaller, tighter on desktop (9)
    // Reduce from 20 to 15 to fill empty space better
    $: responsiveCameraZ = innerWidth < 768 ? 15 : 9;
</script>

<svelte:window bind:innerWidth />

<section
    id="registration"
    class="min-h-screen relative flex items-center justify-center overflow-hidden snap-start"
    style="padding-top: clamp(3rem, 10vh, 6rem); padding-bottom: clamp(3rem, 10vh, 6rem);"
>
    <!-- Background Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
        <div
            class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px]"
        ></div>
        <div
            class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"
        ></div>
    </div>

    <div
        class="container mx-auto px-6 relative z-10 max-w-[100vw] overflow-hidden"
    >
        <div
            class="flex flex-col lg:flex-row items-center w-full"
            style="gap: clamp(1.5rem, 4vw, 6rem);"
        >
            <!-- LEFT: 3D TICKET SCENE -->
            <!-- Added px-8 for mobile safe scroll zones. Decreased min height to 300px for mobile. -->
            <div
                class="w-full max-w-[100vw] lg:w-1/2 relative order-1 lg:order-1 flex justify-center items-center px-8 lg:px-0"
                style="height: clamp(300px, 50vh, 900px);"
            >
                <div
                    class="absolute inset-0 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"
                ></div>

                <!-- Threlte 3D Ticket -->
                <Ticket3D customCameraZ={responsiveCameraZ} />
            </div>

            <!-- RIGHT: EVENT CARDS -->
            <div
                class="w-full max-w-[100vw] lg:w-1/2 order-2 lg:order-2 flex flex-col"
                style="gap: clamp(1.5rem, 4vw, 2rem);"
            >
                <div class="text-left mb-2 w-full">
                    <span
                        class="text-primary-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-2 block"
                    >
                        Registration
                    </span>
                    <h2
                        class="font-bold text-white mb-4 lg:mb-6 leading-tight break-words"
                        style="font-size: clamp(1.5rem, 5vw, 3.75rem); word-break: break-word;"
                    >
                        Unlock Your Horizon
                    </h2>

                    <!-- Filters -->
                    <div class="flex flex-wrap gap-2 md:gap-3">
                        {#each categories as category}
                            <Magnetic>
                                <button
                                    on:click={() => setFilter(category)}
                                    class="rounded-full border font-bold transition-all duration-300 relative overflow-hidden group {categoryFilter ===
                                    category
                                        ? 'border-primary-500 bg-primary-500/10 text-white shadow-[0_0_20px_rgb(var(--color-primary-500-rgb)/0.3)]'
                                        : 'border-white/10 text-stone-400 hover:border-white/30 hover:text-white'}"
                                    style="
                                        font-size: clamp(0.7rem, 1.5vw, 0.875rem);
                                        padding: clamp(0.3rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1.25rem);
                                    "
                                >
                                    <span class="relative z-10">{category}</span
                                    >
                                    {#if categoryFilter === category}
                                        <div
                                            class="absolute inset-0 bg-primary-500/10 blur-sm"
                                            transition:fade
                                        ></div>
                                    {/if}
                                </button>
                            </Magnetic>
                        {/each}
                    </div>
                </div>

                <div class="grid gap-6">
                    {#if displayedEvents.length > 0}
                        {#each displayedEvents as event (event.title)}
                            <div transition:slide|local>
                                <EventListCard {event} />
                            </div>
                        {/each}
                    {:else}
                        <div
                            class="p-8 text-center text-stone-500 bg-white/5 rounded-3xl border border-white/10"
                            transition:fade
                        >
                            No events found for {categoryFilter}.
                        </div>
                    {/if}
                </div>

                <!-- View More Button -->
                <div class="flex justify-start pt-4">
                    <a
                        href="/events"
                        class="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold hover:bg-white/10 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300 group flex items-center gap-2"
                    >
                        View More Programs <i
                            class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"
                        ></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
