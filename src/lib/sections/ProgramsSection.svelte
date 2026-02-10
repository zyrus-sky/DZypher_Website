<script lang="ts">
    import { onMount } from "svelte";
    import { reveal } from "$lib/actions";
    import TiltCard from "$lib/components/TiltCard.svelte";
    import Calendar from "$lib/components/Calendar.svelte";
    import { fetchEventsLive, type Event } from "$lib/csvParser";

    let allEvents: Event[] = [];
    let loading = true;

    // Filtering Logic
    let currentMonth = 0;
    let currentYear = 2026;
    let eventsContainer: HTMLElement;

    onMount(async () => {
        allEvents = await fetchEventsLive();
        loading = false;
    });

    function handleMonthChange(event: CustomEvent) {
        currentMonth = event.detail.month;
        currentYear = event.detail.year;
    }

    // Helper to parse date
    function parseDate(dateStr: string): Date | null {
        if (!dateStr || dateStr === "TBA") return null;
        let strToParse = dateStr.trim();

        // Handle "25-01-2026" or "25/01/2026" manually to ensure DD/MM format
        if (strToParse.match(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/)) {
            const parts = strToParse.split(/[\/-]/);
            // Assume DD-MM-YYYY
            return new Date(
                parseInt(parts[2]),
                parseInt(parts[1]) - 1,
                parseInt(parts[0]),
            );
        }

        // Handle text based like "Jan 23"
        if (
            strToParse.toLowerCase().includes("jan") &&
            !strToParse.includes("2026")
        ) {
            strToParse = `${strToParse} 2026`;
        }

        let d = new Date(strToParse);
        if (!isNaN(d.getTime())) return d;

        // Fallback: try to extract any number and assume it's Jan 2026 for now (since event is seemingly Jan)
        const parts = strToParse.match(/(\d+)/g);
        if (parts && parts.length > 0) {
            // If looks like date
            const day = parseInt(parts[0]);
            if (day > 0 && day <= 31) return new Date(2026, 0, day);
        }

        return null;
    }

    // Derived filtered events
    $: filteredEvents = allEvents; // SHOW ALL EVENTS FOR DEBUGGING
</script>

<div
    id="programs"
    class="min-h-screen w-full flex flex-col justify-center py-12 md:py-24 snap-start relative"
>
    <div class="container mx-auto px-4 md:px-6 h-full flex flex-col">
        <h1
            class="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white shrink-0"
        >
            Programs & Events
        </h1>

        <div class="flex flex-col lg:flex-row gap-8 items-start h-full">
            <!-- Left Sidebar: Calendar -->
            <div
                class="w-full lg:w-1/3 lg:sticky lg:top-8 order-1 lg:order-none z-10 shrink-0"
            >
                <Calendar
                    events={allEvents}
                    on:monthChange={handleMonthChange}
                />
            </div>

            <!-- Right Content: Event List -->
            <!-- Fixed Height with Scroll for proper internal scrolling within the section -->
            <div
                class="w-full lg:w-2/3 space-y-6 order-2 lg:order-none overflow-y-auto max-h-[60vh] md:max-h-[70vh] custom-scrollbar pr-2"
                bind:this={eventsContainer}
            >
                {#if loading}
                    <div class="space-y-6">
                        {#each Array(3) as _}
                            <div
                                class="w-full h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5"
                            ></div>
                        {/each}
                    </div>
                {:else if filteredEvents.length === 0}
                    <div
                        class="text-center py-12 border border-white/10 rounded-2xl bg-black/30"
                    >
                        <p class="text-stone-400">
                            No events scheduled for this month.
                        </p>
                    </div>
                {/if}

                {#each filteredEvents as event (event.title)}
                    <TiltCard>
                        <div
                            class="h-full relative overflow-hidden rounded-2xl border border-red-900/30 bg-gradient-to-r from-red-950/10 to-black p-6 md:p-8 hover:border-red-500/40 transition-all group"
                        >
                            <div
                                class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                            >
                                <div
                                    class="text-6xl md:text-8xl text-red-500 rotate-12 font-bold select-none"
                                >
                                    {event.type === "workshop" ? "W" : "E"}
                                </div>
                            </div>

                            <div
                                class="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6"
                            >
                                <div
                                    class="flex flex-col md:flex-row gap-6 w-full"
                                >
                                    {#if event.image}
                                        <div
                                            class="w-full md:w-32 h-32 shrink-0 rounded-lg overflow-hidden border border-white/10"
                                        >
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    {/if}

                                    <div class="flex-1">
                                        <span
                                            class="inline-block px-3 py-1 text-xs font-bold tracking-wider text-red-200 bg-red-900/50 rounded-full mb-3 uppercase"
                                            >{event.type}</span
                                        >
                                        <h3
                                            class="text-xl md:text-2xl font-bold text-white mb-2 leading-tight"
                                        >
                                            {event.title}
                                        </h3>
                                        <p
                                            class="text-stone-400 mb-4 text-sm md:text-base leading-relaxed"
                                        >
                                            {event.description}
                                        </p>
                                        <div
                                            class="flex items-center text-sm text-red-400 gap-2 font-mono"
                                        >
                                            <i class="far fa-calendar"></i>
                                            <span>{event.date} (Raw)</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="mt-4 md:mt-0 md:self-center shrink-0 w-full md:w-auto"
                                >
                                    {#if event.registration_status === "OPEN"}
                                        <a
                                            href={event.registration_link}
                                            target="_blank"
                                            class="block w-full md:w-auto px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-center shadow-lg shadow-red-900/20"
                                        >
                                            Register
                                        </a>
                                    {:else}
                                        <button
                                            disabled
                                            class="block w-full md:w-auto px-6 py-3 bg-white/5 text-stone-600 rounded-lg font-semibold cursor-not-allowed border border-white/5"
                                        >
                                            Closed
                                        </button>
                                    {/if}
                                    {#if event.calendar_link}
                                        <a
                                            href={event.calendar_link}
                                            target="_blank"
                                            class="block w-full md:w-auto px-4 py-2 mt-2 text-sm text-stone-400 hover:text-white border border-white/10 hover:border-red-500 rounded-lg transition-colors text-center"
                                        >
                                            <i class="far fa-calendar-plus mr-2"
                                            ></i> Add to Cal
                                        </a>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                {/each}
            </div>
        </div>
    </div>
</div>
