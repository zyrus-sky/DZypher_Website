<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import Countdown from "$lib/components/Countdown.svelte";
    import { SOCIALS } from "$lib/data";
    import { onMount } from "svelte";
    import { reveal, typewriter } from "$lib/actions";
    import { countdownStore, fetchCountdownData } from "$lib/stores";
    import { generateGoogleCalendarUrl } from "$lib/calendarUtils";

    onMount(() => {
        fetchCountdownData();
    });

    function getCountdownCalLink(title: string, dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "#";

        // Default start time: 9 AM
        date.setHours(9, 0, 0, 0);

        return generateGoogleCalendarUrl({
            title: title || "Vortix '26",
            description: "Join us for Vortix '26 - The Ultimate Tech Fest!",
            start: date,
            location: "https://maps.app.goo.gl/uhLvwKTpvyLjnh3UA",
        });
    }
</script>

<div
    id="home"
    class="min-h-screen flex flex-col items-center justify-center px-4 text-center snap-start relative"
>
    <Logo className="w-full max-w-2xl mb-8 animate-fade-in-up" />

    <div class="relative group reveal-scale" use:reveal>
        <h1
            use:typewriter={{ speed: 100, delay: 200 }}
            class="text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600 pb-2 tracking-tight relative z-10 min-h-[1.2em]"
        >
            DZypher
        </h1>
        <h1
            class="absolute top-0 left-0 text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold text-red-600 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1 z-0 pb-2 tracking-tight"
        >
            DZypher
        </h1>
        <h1
            class="absolute top-0 left-0 text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold text-blue-600 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2 z-0 pb-2 tracking-tight"
        >
            DZypher
        </h1>
    </div>
    <p
        use:reveal
        class="reveal-fade-up delay-300 text-xl md:text-2xl text-stone-300 mt-4 max-w-2xl font-light"
    >
        Unlocking the Future of <span class="text-red-400 font-normal"
            >Data Science</span
        >
    </p>

    <div
        class="w-full mt-8 reveal-fade-up delay-500 flex flex-col items-center"
        use:reveal
    >
        {#if $countdownStore}
            <Countdown
                targetDate={$countdownStore.date}
                title={$countdownStore.title}
            />

            <a
                href={getCountdownCalLink(
                    $countdownStore.title,
                    $countdownStore.date,
                )}
                target="_blank"
                class="mt-6 px-6 py-2 bg-white/5 hover:bg-red-900/40 text-stone-300 hover:text-white border border-white/10 hover:border-red-500/50 rounded-full transition-all text-sm font-semibold backdrop-blur-sm flex items-center gap-2"
            >
                <i class="far fa-calendar-plus"></i> Add to Google Calendar
            </a>
        {/if}
    </div>

    <div
        class="mt-12 flex flex-wrap gap-4 justify-center reveal-fade-up delay-500"
        use:reveal
    >
        <a
            href={SOCIALS.discord}
            target="_blank"
            rel="noreferrer"
            class="group relative px-8 py-3 bg-red-700/80 hover:bg-red-600 text-white rounded-full transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] font-semibold flex items-center gap-2 overflow-hidden"
        >
            <span class="relative z-10">Join Discord</span>
            <div
                class="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
        </a>

        <button
            on:click={() =>
                document
                    .getElementById("programs")
                    ?.scrollIntoView({ behavior: "smooth" })}
            class="relative px-8 py-3 border border-red-500/50 hover:border-red-500 hover:bg-red-950/30 text-red-100 rounded-full transition-all font-semibold backdrop-blur-sm"
        >
            View Events
        </button>
    </div>

    <div
        class="mt-16 flex flex-wrap justify-center gap-6 md:gap-8 text-xl md:text-2xl text-stone-400 px-4 w-full"
    >
        <a
            href={SOCIALS.linkedin}
            class="hover:text-red-500 transition-colors flex items-center gap-2"
            ><i class="fab fa-linkedin"></i>
            <span class="hidden sm:inline">LinkedIn</span></a
        >
        <a
            href={SOCIALS.instagram}
            class="hover:text-red-500 transition-colors flex items-center gap-2"
            ><i class="fab fa-instagram"></i>
            <span class="hidden sm:inline">Instagram</span></a
        >
        <a
            href={SOCIALS.github}
            class="hover:text-red-500 transition-colors flex items-center gap-2"
            ><i class="fab fa-github"></i>
            <span class="hidden sm:inline">GitHub</span></a
        >
    </div>
</div>
