<script lang="ts">
    import { fade, scale } from "svelte/transition";

    // Svelte 5: Props using $props()
    let { events = [] }: { events?: any[] } = $props();

    let currentMonth = $state(0); // Jan
    let currentYear = $state(2026);
    let daysInMonth = $state<number[]>([]);
    let blankDays = $state<number[]>([]);
    let selectedEvent = $state<any>(null);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Svelte 5: Use $effect to update calendar when month/year changes
    $effect(() => {
        daysInMonth = new Array(
            new Date(currentYear, currentMonth + 1, 0).getDate(),
        )
            .fill(0)
            .map((_, i) => i + 1);
        blankDays = new Array(
            new Date(currentYear, currentMonth, 1).getDay(),
        ).fill(0);
    });

    // Derived: Events mapped by 'Day' number
    let parsedEvents = $derived(
        events.reduce(
            (acc, event) => {
                const dateObj = parseDate(event.date);
                if (
                    dateObj &&
                    dateObj.getMonth() === currentMonth &&
                    dateObj.getFullYear() === currentYear
                ) {
                    const day = dateObj.getDate();
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(event);
                }
                return acc;
            },
            {} as Record<number, any[]>,
        ),
    );

    function parseDate(dateStr: string): Date | null {
        if (!dateStr) return null;

        // 1. If it contains "Jan" but no year, append 2026 to ensure year is correct
        let strToParse = dateStr;
        if (
            dateStr.toLowerCase().includes("jan") &&
            !dateStr.includes("2026")
        ) {
            strToParse = `${dateStr} 2026`;
        }

        let d = new Date(strToParse);
        if (!isNaN(d.getTime())) return d;

        // 2. Fallback Regex
        const parts = dateStr.match(/(\d+)/g);
        if (
            dateStr.toLowerCase().includes("jan") &&
            parts &&
            parts.length > 0
        ) {
            return new Date(2026, 0, parseInt(parts[0]));
        }

        return null;
    }

    function changeMonth(increment: number) {
        let newMonth = currentMonth + increment;
        if (newMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (newMonth > 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth = newMonth;
        }
    }

    function openEvent(event: any) {
        selectedEvent = event;
        if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden"; // Lock Body Scroll
        }
    }

    function closeEvent() {
        selectedEvent = null;
        if (typeof document !== "undefined") {
            document.body.style.overflow = ""; // Unlock Body Scroll
        }
    }
</script>

<div
    class="w-full bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-4 md:p-6 shadow-2xl"
>
    <!-- Header -->
    <div class="flex items-center justify-between mb-4 md:mb-6">
        <h2
            class="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-white"
        >
            {monthNames[currentMonth]}
            {currentYear}
        </h2>
        <div class="flex gap-1 md:gap-2">
            <button
                class="p-2 text-stone-400 hover:text-white"
                onclick={() => changeMonth(-1)}>&lt;</button
            >
            <button
                class="p-2 text-stone-400 hover:text-white"
                onclick={() => changeMonth(1)}>&gt;</button
            >
        </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
        {#each ["S", "M", "T", "W", "T", "F", "S"] as day}
            <div
                class="text-primary-500 font-bold uppercase text-[10px] md:text-xs tracking-wider"
            >
                {day}
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-7 gap-1 md:gap-2">
        {#each blankDays as _}
            <div class="h-12 md:h-24 rounded bg-white/5 opacity-50"></div>
        {/each}

        {#each daysInMonth as day}
            <div
                class="relative h-12 md:h-24 rounded border border-white/5 bg-white/5 p-1 transition-all hover:border-primary-500/50 hover:bg-white/10 group flex flex-col justify-between"
            >
                <span
                    class="text-stone-500 text-[10px] md:text-sm font-mono group-hover:text-white"
                    >{day}</span
                >

                {#if parsedEvents[day] && parsedEvents[day].length > 0}
                    <!-- Dots for Mobile / Small -->
                    <div class="flex gap-1 justify-center md:hidden">
                        {#each parsedEvents[day] as _}
                            <div
                                class="w-1 h-1 rounded-full bg-primary-500 animate-pulse"
                            ></div>
                        {/each}
                    </div>

                    <!-- Labels for Desktop -->
                    <div class="hidden md:flex flex-col gap-1 overflow-hidden">
                        {#each parsedEvents[day] as event}
                            <button
                                onclick={(e) => {
                                    e.stopPropagation();
                                    openEvent(event);
                                }}
                                class="text-left text-[10px] bg-primary-900/80 text-white px-2 py-1 rounded truncate hover:bg-primary-600 transition-colors w-full"
                            >
                                {event.title}
                            </button>
                        {/each}
                    </div>

                    <button
                        class="absolute inset-0 md:hidden z-10"
                        onclick={() => openEvent(parsedEvents[day][0])}
                    ></button>
                {/if}
            </div>
        {/each}
    </div>
</div>

<!-- Event Modal (Fixed Z-Index & Centering) -->
{#if selectedEvent}
    <div
        class="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/95 backdrop-blur-sm"
        transition:fade
    >
        <div
            class="bg-stone-900 border border-primary-500/30 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row"
            transition:scale
        >
            <button
                class="absolute top-2 right-2 text-white hover:text-primary-500 z-20 bg-black/60 rounded-full p-2 backdrop-blur-md"
                onclick={closeEvent}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <!-- Poster Image -->
            <div
                class="w-full md:w-1/2 h-48 md:h-auto md:min-h-[400px] relative bg-black flex items-center justify-center shrink-0"
            >
                {#if selectedEvent.image}
                    <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        class="w-full h-full object-contain md:object-cover"
                    />
                {:else}
                    <div class="text-stone-600">No Poster Available</div>
                {/if}
            </div>

            <!-- Content -->
            <div
                class="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2"
            >
                <span
                    class="text-primary-500 text-xs font-bold tracking-widest uppercase mb-2"
                    >{selectedEvent.type}</span
                >
                <h3
                    class="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                >
                    {selectedEvent.title}
                </h3>
                <p
                    class="text-stone-300 mb-6 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar"
                >
                    {selectedEvent.description}
                </p>

                <div class="flex flex-col gap-3 mt-auto">
                    {#if selectedEvent.registration_status === "OPEN"}
                        <a
                            href={selectedEvent.registration_link}
                            target="_blank"
                            class="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-lg text-center transition-all shadow-lg shadow-primary-900/30"
                        >
                            Register Now
                        </a>
                    {:else}
                        <button
                            disabled
                            class="w-full bg-stone-800 text-stone-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                            Registration Closed
                        </button>
                    {/if}
                    <div
                        class="flex justify-between items-center text-xs text-stone-500 mt-2"
                    >
                        <span
                            >Event Date: <span class="text-stone-300"
                                >{selectedEvent.date}</span
                            ></span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
