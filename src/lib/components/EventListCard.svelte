<script lang="ts">
    import { generateGoogleCalendarUrl } from "$lib/calendarUtils";

    export let event: any;

    // Helper to parse date (can be hoisted to utils if needed, but keeping simple here for now)
    // Actually, assume event.date is string.

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

    function getGoogleCalLink(event: any): string {
        const date = parseDate(event.date);
        if (!date) return "#";
        const startDate = new Date(date);
        startDate.setHours(9, 30, 0, 0);

        return generateGoogleCalendarUrl({
            title: event.title,
            description: event.description,
            start: startDate,
            location: "Vortix '26 Venue",
        });
    }

    // Interactive spotlight effect
    function handleMouseMove(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const el = e.currentTarget as HTMLElement;
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
    }

    let isExpanded = false;

    function toggleExpand() {
        if (window.innerWidth < 768) {
            isExpanded = !isExpanded;
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl transition-all duration-500 hover:bg-white/10 hover:border-primary-500/30 hover:shadow-[0_0_30px_rgba(var(--color-primary-500-rgb),0.15)] overflow-hidden cursor-pointer md:cursor-default"
    style="padding: clamp(0.75rem, 2vw, 2rem);"
    onmousemove={handleMouseMove}
    onclick={toggleExpand}
>
    <!-- Gradient Spotlight (Frozen Effect) -->
    <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style="
            background: radial-gradient(
                600px circle at var(--x) var(--y),
                rgba(255, 255, 255, 0.15),
                transparent 40%
            );
        "
    ></div>

    <div class="relative z-10 flex flex-row justify-between gap-4 md:gap-6">
        <!-- LEFT COLUMN: Content -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="flex flex-col items-start gap-1 md:gap-3 mb-1 md:mb-2">
                <span
                    class="px-2 py-0.5 md:px-3 md:py-1 font-bold tracking-wider uppercase bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30 whitespace-nowrap mb-1 md:mb-0"
                    style="font-size: clamp(0.5rem, 1.5vw, 0.75rem);"
                >
                    {event.type}
                </span>
                <h3
                    class="font-bold text-white group-hover:text-primary-200 transition-colors break-words text-wrap leading-tight"
                    style="font-size: clamp(1rem, 4vw, 1.5rem);"
                >
                    {event.title}
                </h3>
            </div>

            <!-- Description: Tap to expand on mobile, Hover on Desktop -->
            <div
                class="transition-all duration-500 ease-in-out overflow-hidden relative
                {isExpanded
                    ? 'max-h-96 opacity-100 mb-4'
                    : 'max-h-0 opacity-0 mb-0'} 
                md:max-h-20 md:opacity-100 md:mb-6 md:group-hover:max-h-96"
            >
                <p class="text-stone-400 text-sm max-w-sm">
                    {event.description}
                </p>
                <div
                    class="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300 hidden md:block"
                ></div>
            </div>

            <!-- Date/Time -->
            <div class="space-y-1 md:space-y-3 mt-1 md:mt-4">
                <div
                    class="flex items-center gap-2 md:gap-3 text-stone-300 font-medium"
                    style="font-size: clamp(0.7rem, 2vw, 0.875rem);"
                >
                    <i class="far fa-calendar text-primary-400"></i>
                    {event.date}
                </div>
                <div
                    class="flex items-center gap-2 md:gap-3 text-stone-300 font-medium"
                    style="font-size: clamp(0.7rem, 2vw, 0.875rem);"
                >
                    <i class="far fa-clock text-primary-400"></i>
                    10:00 AM
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN: Image & Actions -->
        <div
            class="flex flex-col justify-between items-end gap-2 md:gap-4 shrink-0 w-24 md:w-auto"
        >
            {#if event.image}
                <img
                    src={event.image}
                    alt={event.title}
                    class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl md:rounded-2xl border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
            {/if}

            <div class="flex flex-col gap-2 w-full">
                <a
                    href={event.registration_link}
                    target="_blank"
                    onclick={(e) => e.stopPropagation()}
                    class="w-full px-2 py-1.5 md:px-6 md:py-3 bg-white/10 hover:bg-white text-white hover:text-black border border-white/10 rounded-lg md:rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 group/btn"
                    style="font-size: clamp(0.6rem, 1.5vw, 1rem);"
                >
                    <span>Get Ticket</span>
                    <i
                        class="fas fa-arrow-right -rotate-45 group-hover/btn:rotate-0 transition-transform text-[0.6rem] md:text-base"
                    ></i>
                </a>

                <!-- Hide 'Add to Cal' on very small screens if needed, or keep compact -->
                <a
                    href={getGoogleCalLink(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onclick={(e) => e.stopPropagation()}
                    class="w-full flex items-center justify-center gap-1 md:gap-2 py-1 text-stone-500 hover:text-white transition-colors"
                    style="font-size: clamp(0.5rem, 1.5vw, 0.75rem);"
                >
                    <i class="far fa-calendar-plus"></i> Cal
                </a>
            </div>
        </div>
    </div>
</div>
