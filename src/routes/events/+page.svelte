<script lang="ts">
    import { onMount } from "svelte";
    import TiltCard from "$lib/components/TiltCard.svelte";
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
</script>

<div class="min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none -z-10">
        <div
            class="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full"
        ></div>
        <div
            class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full"
        ></div>
    </div>

    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1
                class="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-500"
            >
                Events Calendar
            </h1>
            <p class="text-stone-400 text-lg max-w-2xl mx-auto">
                Discover workshops, competitions, and entertainment events
                happening at DZypher.
            </p>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
            {#each categories as category}
                <Magnetic>
                    <button
                        on:click={() => filterEvents(category)}
                        class="px-6 py-2 rounded-full border transition-all duration-300 relative overflow-hidden group {selectedCategory ===
                        category
                            ? 'border-red-500 bg-red-500/10 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                            : 'border-white/10 text-stone-400 hover:border-white/30 hover:text-white'}"
                    >
                        <span class="relative z-10">{category}</span>
                        {#if selectedCategory === category}
                            <div
                                class="absolute inset-0 bg-red-500/10 blur-sm"
                                transition:fade
                            ></div>
                        {/if}
                    </button>
                </Magnetic>
            {/each}
        </div>

        <!-- Grid -->
        {#if loading}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each Array(6) as _}
                    <div
                        class="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/5"
                    ></div>
                {/each}
            </div>
        {:else if filteredEvents.length === 0}
            <div
                class="text-center py-24 border border-white/10 rounded-2xl bg-black/30 backdrop-blur-sm"
            >
                <i class="fas fa-calendar-times text-4xl text-stone-600 mb-4"
                ></i>
                <p class="text-stone-400 text-xl">
                    No events found in this category.
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each filteredEvents as event, i (event.title)}
                    <div in:fly={{ y: 20, delay: i * 50, duration: 400 }}>
                        <TiltCard>
                            <div
                                class="h-full group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-red-500/50 transition-all duration-500 flex flex-col"
                            >
                                <!-- Image -->
                                <div
                                    class="w-full aspect-square overflow-hidden relative"
                                >
                                    {#if event.image}
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            referrerpolicy="no-referrer"
                                        />
                                    {:else}
                                        <div
                                            class="w-full h-full bg-gradient-to-br from-stone-900 to-black flex items-center justify-center"
                                        >
                                            <i
                                                class="fas fa-image text-3xl text-stone-700"
                                            ></i>
                                        </div>
                                    {/if}
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"
                                    ></div>

                                    <span
                                        class="absolute top-4 right-4 px-3 py-1 text-xs font-bold tracking-wider text-white bg-red-600 rounded-full shadow-lg z-10"
                                    >
                                        {event.type}
                                    </span>
                                </div>

                                <!-- Content -->
                                <div
                                    class="p-6 flex-1 flex flex-col relative z-10"
                                >
                                    <h3
                                        class="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-red-400 transition-colors"
                                    >
                                        {event.title}
                                    </h3>

                                    <div
                                        class="flex items-center gap-2 text-sm text-stone-400 mb-4 font-mono"
                                    >
                                        <i class="far fa-calendar text-red-500"
                                        ></i>
                                        <span>{event.date}</span>
                                    </div>

                                    <p
                                        class="text-stone-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1"
                                    >
                                        {event.description}
                                    </p>

                                    <div class="space-y-3 mt-auto">
                                        {#if event.registration_status === "OPEN"}
                                            <a
                                                href={event.registration_link}
                                                target="_blank"
                                                class="w-full block py-2.5 bg-white text-black font-bold text-center rounded-lg hover:bg-stone-200 transition-colors"
                                            >
                                                Register Now
                                            </a>
                                        {:else}
                                            <button
                                                disabled
                                                class="w-full py-2.5 bg-white/5 text-stone-500 font-bold text-center rounded-lg cursor-not-allowed"
                                            >
                                                Registration Closed
                                            </button>
                                        {/if}

                                        <a
                                            href={getGoogleCalLink(event)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 text-stone-300 font-medium text-center rounded-lg hover:border-white/30 hover:text-white transition-colors text-sm"
                                        >
                                            <i class="far fa-calendar-plus"></i>
                                            Add to Calendar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
