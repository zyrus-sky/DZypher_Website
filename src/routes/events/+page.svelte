<script lang="ts">
    import { onMount } from "svelte";
    import SpotlightCard from "$lib/components/SpotlightCard.svelte";
    import Ticket3D from "$lib/components/Ticket3D/index.svelte";
    import EventListCard from "$lib/components/EventListCard.svelte";
    import { fetchEventsLive, type Event } from "$lib/csvParser";
    import { generateGoogleCalendarUrl } from "$lib/calendarUtils";
    import { fly, fade } from "svelte/transition";
    import Magnetic from "$lib/components/Magnetic.svelte";

    let allEvents: Event[] = [];
    let filteredEvents: Event[] = [];
    let loading = true;
    let selectedCategory = "All";

    // Categories for filtering
    const categories = ["All", "Workshops", "Competitions", "Entertainment"];

    onMount(async () => {
        // Scroll to top on load
        window.scrollTo(0, 0);

        allEvents = await fetchEventsLive();
        filterEvents("All");
        loading = false;
    });

    function filterEvents(category: string) {
        selectedCategory = category;
        if (category === "All") {
            filteredEvents = allEvents;
        } else if (category === "Workshops") {
            filteredEvents = allEvents.filter((e) =>
                e.type.toLowerCase().includes("workshop"),
            );
        } else {
            // "Competitions" and "Entertainment" might share "program" type currently
            // So we'll try to filter by title keyword if possible or just show all 'program' types
            // EXCEPT workshops
            // Refined logic:
            // If type is NOT workshop, it's generally a "Program".
            // We can try to guess if it's a competition or entertainment based on keywords or just dump them in both for now
            // Or simpler: Map 'program' -> 'Competitions & Entertainment'

            // For now, let's just do a basic text search on title + type
            // If strict separation is needed, we need new data tags.
            // Current fallback:
            const isWorkshop = (e: Event) =>
                e.type.toLowerCase().includes("workshop");

            if (category === "Competitions") {
                // Heuristic: contains 'hackathon', 'code', 'competition', 'jam' OR it's just a generic program that isn't a workshop
                filteredEvents = allEvents.filter(
                    (e) =>
                        !isWorkshop(e) &&
                        (e.title.toLowerCase().includes("hack") ||
                            e.title.toLowerCase().includes("code") ||
                            e.title.toLowerCase().includes("jam") ||
                            e.type.toLowerCase().includes("competition")),
                );
                // If empty, maybe just show all non-workshops to be safe?
                if (filteredEvents.length === 0) {
                    filteredEvents = allEvents.filter((e) => !isWorkshop(e));
                }
            } else if (category === "Entertainment") {
                // Heuristic: 'concert', 'music', 'game', 'fun', 'party'
                filteredEvents = allEvents.filter(
                    (e) =>
                        !isWorkshop(e) &&
                        (e.title.toLowerCase().includes("concert") ||
                            e.title.toLowerCase().includes("music") ||
                            e.title.toLowerCase().includes("game") ||
                            e.title.toLowerCase().includes("party") ||
                            e.title.toLowerCase().includes("show")),
                );
                // If empty, show all non-workshops? (Avoid duplicates if possible, but better to show something)
            }
        }
    }

    // Helper to parse date (reused from ProgramsSection)
    function parseDate(dateStr: string): Date | null {
        if (!dateStr || dateStr === "TBA") return null;
        let strToParse = dateStr.trim();
        const currentYear = 2026;

        if (strToParse.match(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/)) {
            const parts = strToParse.split(/[\/-]/);
            return new Date(
                parseInt(parts[2]),
                parseInt(parts[1]) - 1,
                parseInt(parts[0]),
            );
        }

        // Handle "21 Feb"
        const dayMonthMatch = strToParse.match(/^(\d{1,2})\s+([a-zA-Z]+)$/);
        if (dayMonthMatch) {
            strToParse = `${dayMonthMatch[1]} ${dayMonthMatch[2]} ${currentYear}`;
        }

        let d = new Date(strToParse);
        if (!isNaN(d.getTime())) return d;

        if (strToParse.toLowerCase().includes("jan")) {
            strToParse = `${strToParse} ${currentYear}`;
            d = new Date(strToParse);
            if (!isNaN(d.getTime())) return d;
        }

        return null;
    }

    function getGoogleCalLink(event: Event): string {
        const date = parseDate(event.date);
        if (!date) return "#";
        const startDate = new Date(date);
        startDate.setHours(9, 30, 0, 0); // Default 9:30 AM
        return generateGoogleCalendarUrl({
            title: event.title,
            description: event.description,
            start: startDate,
            location: "Vortix '26 Venue",
        });
    }

    let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<div
    class="min-h-screen pt-24 pb-12 px-4 md:px-8 relative flex flex-col items-center"
>
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none -z-10">
        <div
            class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/20 blur-[120px] rounded-full"
        ></div>
        <div
            class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-900/10 blur-[120px] rounded-full"
        ></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
        <div
            class="flex flex-col lg:flex-row items-start"
            style="gap: clamp(3rem, 6vw, 6rem);"
        >
            <!-- LEFT: 3D TICKET SCENE (Fixed on Desktop) -->
            <!-- 
                Using 'sticky' allowed it to scroll with padding. 
                Switching to a phantom spacer + fixed element approach ensures it stays locked.
            -->
            <div class="hidden lg:block lg:w-1/2 relative order-1 lg:order-1">
                <!-- Spacer to occupy flow -->
            </div>

            <div
                class="w-full max-w-[100vw] lg:w-1/2 fixed top-0 left-0 h-screen hidden lg:flex justify-center items-center z-0"
            >
                <div
                    class="absolute inset-0 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"
                ></div>
                <!-- Threlte 3D Ticket -->
                <div class="w-full h-full">
                    <Ticket3D {scrollY} customCameraZ={11} />
                </div>
            </div>

            <!-- Mobile Only Ticket (Non-fixed) -->
            <!-- Added mx-8 to create safe scroll zones on sides -->
            <div
                class="w-full relative flex lg:hidden justify-center items-center h-[300px] px-8"
            >
                <!-- Threlte 3D Ticket -->
                <div class="w-full h-full">
                    <Ticket3D {scrollY} customCameraZ={20} />
                </div>
            </div>

            <!-- RIGHT: EVENT LIST -->
            <div
                class="w-full max-w-[100vw] lg:w-1/2 order-2 lg:order-2 space-y-8"
            >
                <!-- Header -->
                <div class="text-left mb-8 w-full">
                    <span
                        class="text-primary-400 font-mono text-sm tracking-widest uppercase mb-2 block"
                    >
                        Events
                    </span>
                    <h1
                        class="font-bold text-white mb-6 leading-tight break-words"
                        style="font-size: clamp(1.75rem, 5vw, 3.75rem); word-break: break-word;"
                    >
                        Explore All Events
                    </h1>
                </div>

                <!-- Filters -->
                <div class="flex flex-wrap gap-2 md:gap-3 mb-8">
                    {#each categories as category}
                        <Magnetic>
                            <button
                                on:click={() => filterEvents(category)}
                                class="rounded-full border font-bold transition-all duration-300 relative overflow-hidden group {selectedCategory ===
                                category
                                    ? 'border-primary-500 bg-primary-500/10 text-white shadow-[0_0_20px_rgb(var(--color-primary-500-rgb)/0.3)]'
                                    : 'border-white/10 text-stone-400 hover:border-white/30 hover:text-white'}"
                                style="
                                    font-size: clamp(0.7rem, 1.5vw, 0.875rem);
                                    padding: clamp(0.3rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1.25rem);
                                "
                            >
                                <span class="relative z-10">{category}</span>
                                {#if selectedCategory === category}
                                    <div
                                        class="absolute inset-0 bg-primary-500/10 blur-sm"
                                        transition:fade
                                    ></div>
                                {/if}
                            </button>
                        </Magnetic>
                    {/each}
                </div>

                <!-- Grid/List -->
                <div class="grid gap-6">
                    {#if loading}
                        {#each Array(4) as _}
                            <div
                                class="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/5"
                            ></div>
                        {/each}
                    {:else if filteredEvents.length === 0}
                        <div
                            class="p-8 text-center text-stone-500 bg-white/5 rounded-3xl border border-white/10"
                        >
                            No events found in this category.
                        </div>
                    {:else}
                        {#each filteredEvents as event, i (event.title)}
                            <div
                                in:fly={{ y: 20, delay: i * 50, duration: 400 }}
                            >
                                <EventListCard {event} />
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
