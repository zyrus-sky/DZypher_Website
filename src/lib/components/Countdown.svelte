<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let targetDate: string; // ISO string or parsable date
    export let title: string = "Event Starts In";

    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    let interval: any;

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
            clearInterval(interval);
        }
    }

    onMount(() => {
        calculateTimeLeft();
        interval = setInterval(calculateTimeLeft, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<div class="flex flex-col items-center justify-center py-12 relative group">
    <!-- Background Decor -->
    <div
        class="absolute inset-0 bg-primary-900/5 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
    ></div>

    <h3
        class="text-xl md:text-3xl text-primary-500 font-bold mb-8 tracking-[0.2em] uppercase animate-pulse-slow"
        style="text-shadow: 0 0 10px rgba(var(--color-primary-500-rgb), 0.5);"
    >
        {title}
    </h3>

    <div
        class="flex flex-wrap gap-4 md:gap-6 justify-center text-center relative z-10"
    >
        {#each Object.entries(timeLeft) as [unit, value]}
            <div class="flex flex-col items-center">
                <div class="relative group/box">
                    <!-- Glowing Border -->
                    <div
                        class="absolute -inset-1 bg-gradient-to-br from-primary-600 to-black rounded-xl opacity-50 blur-sm group-hover/box:opacity-100 transition-opacity duration-500"
                    ></div>

                    <div
                        class="w-20 h-20 md:w-32 md:h-32 bg-black border border-primary-500/30 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-xl"
                    >
                        <!-- Scanline -->
                        <div
                            class="absolute inset-0 pointer-events-none"
                            style="background-image: linear-gradient(transparent 50%, rgba(var(--color-primary-500-rgb), 0.1) 50%); background-size: 100% 4px;"
                        ></div>
                        <div
                            class="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent opacity-0 group-hover/box:opacity-20 transition-opacity"
                        ></div>

                        <span
                            class="text-4xl md:text-6xl font-bold text-white font-mono z-10"
                            style="text-shadow: 0 0 20px rgba(var(--color-primary-600-rgb), 0.5);"
                        >
                            {value.toString().padStart(2, "0")}
                        </span>
                    </div>
                </div>

                <span
                    class="text-xs md:text-sm text-primary-400 font-bold mt-3 uppercase tracking-widest"
                >
                    {unit}
                </span>
            </div>

            <!-- Separator (Desktop only, flexible) -->
            {#if unit !== "seconds"}
                <div class="hidden md:flex flex-col justify-center h-32">
                    <div
                        class="w-1 h-1 bg-primary-500 rounded-full mb-2 opacity-50"
                    ></div>
                    <div
                        class="w-1 h-1 bg-primary-500 rounded-full opacity-50"
                    ></div>
                </div>
            {/if}
        {/each}
    </div>
</div>
