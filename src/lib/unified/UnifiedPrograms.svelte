<script lang="ts">
    import { reveal } from "$lib/actions";
    import { fetchEventsLive, type Event } from "$lib/csvParser";
    import { generateGoogleCalendarUrl } from "$lib/calendarUtils";
    import Marquee from "$lib/components/Marquee.svelte";
    import UnifiedRegistration from "$lib/unified/UnifiedRegistration.svelte";

    let allEvents = $state<Event[]>([]);
    let loading = $state(true);
    let eventsContainer = $state<HTMLElement>();

    // Svelte 5: Use $effect for async data loading
    $effect(() => {
        (async () => {
            allEvents = await fetchEventsLive();
            loading = false;
        })();
    });

    // Helper to parse date
    function parseDate(dateStr: string): Date | null {
        if (!dateStr || dateStr === "TBA") return null;
        let strToParse = dateStr.trim();
        const currentYear = 2026;

        // Handle "25-01-2026" or "25/01/2026"
        if (strToParse.match(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/)) {
            const parts = strToParse.split(/[\/-]/);
            return new Date(
                parseInt(parts[2]),
                parseInt(parts[1]) - 1,
                parseInt(parts[0]),
            );
        }

        // Handle "21 Feb" or "21 February"
        const dayMonthMatch = strToParse.match(/^(\d{1,2})\s+([a-zA-Z]+)$/);
        if (dayMonthMatch) {
            strToParse = `${dayMonthMatch[1]} ${dayMonthMatch[2]} ${currentYear}`;
        }

        let d = new Date(strToParse);
        if (!isNaN(d.getTime())) return d;

        // Fallback
        if (
            strToParse.toLowerCase().includes("jan") &&
            !strToParse.includes("2026")
        ) {
            strToParse = `${strToParse} 2026`;
            d = new Date(strToParse);
            if (!isNaN(d.getTime())) return d;
        }
        return null;
    }

    // Helper to get Google Cal Link
    function getGoogleCalLink(event: Event): string {
        const date = parseDate(event.date);
        if (!date) return "#";
        const startDate = new Date(date);
        startDate.setHours(9, 30, 0, 0);

        return generateGoogleCalendarUrl({
            title: event.title,
            description: event.description,
            start: startDate,
            location: "https://maps.app.goo.gl/uhLvwKTpvyLjnh3UA",
        });
    }

    let filteredEvents = $derived(allEvents);
</script>

<div
    id="programs"
    class="min-h-screen w-full flex flex-col justify-start snap-start relative"
    style="padding-top: clamp(2rem, 5vw, 6rem); padding-bottom: clamp(3rem, 10vh, 6rem);"
>
    <!-- Marquee Section (Double Tilted) -->
    <div
        class="w-full mb-12 md:mb-16 overflow-hidden relative"
        style="height: 200px;"
    >
        <div
            class="absolute w-[120%] -left-[10%] top-1/2 -translate-y-1/2 -rotate-6 flex flex-col gap-4"
        >
            <!-- Top Marquee (Left) -->
            <Marquee speed={25} direction="left">
                <div class="flex items-center gap-32 pr-96">
                    <span
                        class="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-stone-500 to-white/50 uppercase tracking-widest font-alan-sans whitespace-nowrap"
                    >
                        WORKSHOP • COMPETITION • ENTERTAINMENT • PROGRAMS
                    </span>
                    <img
                        src="/assets/DZypher_extend.svg"
                        alt="DZypher"
                        class="h-12 md:h-20 w-auto opacity-50 block"
                    />
                </div>
            </Marquee>

            <!-- Bottom Marquee (Right) -->
            <Marquee speed={25} direction="right">
                <div class="flex items-center gap-32 pr-96">
                    <span
                        class="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white/50 to-stone-500 uppercase tracking-widest font-alan-sans whitespace-nowrap"
                    >
                        WORKSHOP • COMPETITION • ENTERTAINMENT • PROGRAMS
                    </span>
                    <img
                        src="/assets/DZypher_extend.svg"
                        alt="DZypher"
                        class="h-12 md:h-20 w-auto opacity-50 block"
                    />
                </div>
            </Marquee>
        </div>
    </div>

    <div
        class="container mx-auto px-4 md:px-6 h-full flex flex-col items-center"
    >
        <!-- Registration Enhancement -->
        <UnifiedRegistration events={filteredEvents} />
    </div>
</div>
