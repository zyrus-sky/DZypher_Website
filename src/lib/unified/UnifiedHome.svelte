<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import { SOCIALS } from "$lib/data";
    import { reveal, typewriter } from "$lib/actions";
    import {
        countdownStore,
        fetchCountdownData,
        themeStore,
    } from "$lib/stores";
    import { generateGoogleCalendarUrl } from "$lib/calendarUtils";

    // --- Countdown Logic ---
    let timeLeft = $state({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    let interval: any;

    function calculateTimeLeft() {
        // Use store directly
        const targetDate = $countdownStore?.date;
        if (!targetDate) return;

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

    // --- Effects ---
    $effect(() => {
        fetchCountdownData();
    });

    $effect(() => {
        calculateTimeLeft();
        interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    });

    // --- Calendar Link Logic ---
    function getCountdownCalLink(title: string, dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "#";
        date.setHours(9, 0, 0, 0); // Default 9 AM

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
    <!-- Background Decor -->
    <div
        class="absolute inset-0 z-0 text-center flex items-center justify-center pointer-events-none"
        style="transform: translateY({(typeof window !== 'undefined'
            ? window.scrollY
            : 0) * 0.5}px);"
    >
        <!-- Optional background elements -->
    </div>

    <!-- LOGO COMPONENT -->
    <Logo className="w-full max-w-2xl mb-8 animate-fade-in-up relative z-10" />

    <!-- REVEAL/INTERACTIVE VORTIX TEXT -->
    <div
        class="relative z-10 perspective-container"
        use:reveal
        role="group"
        aria-label="Interactive Logo Container"
        onmousemove={(e: MouseEvent & { currentTarget: HTMLDivElement }) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            e.currentTarget.style.setProperty("--tx", `${x / 50}deg`);
            e.currentTarget.style.setProperty("--ty", `${-y / 50}deg`);
        }}
        onmouseleave={(e: MouseEvent & { currentTarget: HTMLDivElement }) => {
            e.currentTarget.style.setProperty("--tx", "0deg");
            e.currentTarget.style.setProperty("--ty", "0deg");
        }}
        style="--tx: 0deg; --ty: 0deg;"
    >
        <div
            class="transform-3d transition-transform duration-200 ease-out"
            style="transform: rotateX(var(--ty)) rotateY(var(--tx))"
        >
            {#key $themeStore?.logo}
                {#if $themeStore?.logo?.includes("VORTIX")}
                    <div class="relative z-20 group">
                        <img
                            src="/assets/Vortix_text.svg"
                            alt="VORTIX"
                            class="w-full md:w-[800px] h-auto object-contain relative z-20 animate-fade-in-up"
                        />
                        <!-- Glitch Layers -->
                        <img
                            src="/assets/Vortix_text.svg"
                            alt="glitch-layer-1"
                            class="absolute top-0 left-0 w-full md:w-[800px] h-auto object-contain opacity-0 group-hover:opacity-50 group-hover:animate-glitch-1 z-10 mix-blend-screen pointer-events-none"
                            style="transform: translateZ(-10px); filter: drop-shadow(5px 0 0 rgb(var(--color-primary-500-rgb)));"
                        />
                        <img
                            src="/assets/Vortix_text.svg"
                            alt="glitch-layer-2"
                            class="absolute top-0 left-0 w-full md:w-[800px] h-auto object-contain opacity-0 group-hover:opacity-50 group-hover:animate-glitch-2 z-30 mix-blend-screen pointer-events-none"
                            style="transform: translateZ(10px); filter: drop-shadow(-5px 0 0 rgb(var(--color-primary-300-rgb)));"
                        />
                    </div>
                {:else}
                    <div class="group relative">
                        <h1
                            use:typewriter={{ speed: 100, delay: 200 }}
                            class="text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold bg-clip-text text-transparent pb-2 tracking-tight relative z-20 min-h-[1.2em]"
                            style="background-image: linear-gradient(to right, var(--color-primary-500), var(--color-primary-600))"
                        >
                            {$themeStore?.logo || "DZypher"}
                        </h1>
                        <h1
                            class="absolute top-0 left-0 text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold text-primary-600 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1 z-10 pb-2 tracking-tight"
                            style="transform: translateZ(-20px);"
                        >
                            {$themeStore?.logo || "DZypher"}
                        </h1>
                        <h1
                            class="absolute top-0 left-0 text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl font-bold text-primary-400 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2 z-30 pb-2 tracking-tight"
                            style="transform: translateZ(20px);"
                        >
                            {$themeStore?.logo || "DZypher"}
                        </h1>
                    </div>
                {/if}
            {/key}
        </div>
    </div>
    <p
        use:reveal
        class="reveal-fade-up delay-300 text-xl md:text-2xl text-stone-300 mt-4 max-w-2xl font-light relative z-10"
    >
        {#if $themeStore?.logo?.includes("VORTIX")}
            Chase The Horizon
        {:else}
            Unlocking the Future of <span class="text-primary-400 font-normal"
                >Data Science</span
            >
        {/if}
    </p>

    <!-- INLINED COUNTDOWN COMPONENT -->
    <div
        class="w-full mt-8 reveal-fade-up delay-500 flex flex-col items-center relative z-10"
        use:reveal
    >
        {#if $countdownStore}
            <!-- Countdown Markup -->
            <div
                class="flex flex-col items-center justify-center py-12 relative group"
            >
                <!-- Background Decor -->
                <div
                    class="absolute inset-0 bg-primary-900/5 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
                ></div>

                <h3
                    class="text-xl md:text-3xl text-primary-500 font-bold mb-8 tracking-[0.2em] uppercase animate-pulse-slow"
                    style="text-shadow: 0 0 10px rgba(var(--color-primary-500-rgb), 0.5);"
                >
                    {$countdownStore.title || "Event Starts In"}
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

                        <!-- Separator -->
                        {#if unit !== "seconds"}
                            <div
                                class="hidden md:flex flex-col justify-center h-32"
                            >
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

            <!-- Calendar Link -->
            <a
                href={getCountdownCalLink(
                    $countdownStore.title,
                    $countdownStore.date,
                )}
                target="_blank"
                class="mt-6 px-6 py-2 bg-white/5 hover:bg-primary-900/40 text-stone-300 hover:text-white border border-white/10 hover:border-primary-500/50 rounded-full transition-all text-sm font-semibold backdrop-blur-sm flex items-center gap-2"
            >
                <i class="far fa-calendar-plus"></i> Add to Google Calendar
            </a>
        {/if}
    </div>

    <!-- SOCIALS & BUTTONS -->
    <div
        class="mt-12 flex flex-wrap gap-4 justify-center reveal-fade-up delay-500 relative z-10"
        use:reveal
    >
        <a
            href={SOCIALS.discord}
            target="_blank"
            rel="noreferrer"
            class="group relative px-8 py-3 bg-primary-700/80 hover:bg-primary-600 text-white rounded-full transition-all shadow-[0_0_20px_var(--color-primary-900)] hover:shadow-[0_0_30px_var(--color-primary-600)] font-semibold flex items-center gap-2 overflow-hidden"
            style="background-color: rgba(var(--color-primary-700-rgb), 0.8);"
        >
            <span class="relative z-10">Join Discord</span>
            <div
                class="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
        </a>

        <button
            onclick={() =>
                document
                    .getElementById("programs")
                    ?.scrollIntoView({ behavior: "smooth" })}
            class="relative px-8 py-3 border border-primary-500/50 hover:border-primary-500 hover:bg-primary-950/30 text-primary-100 rounded-full transition-all font-semibold backdrop-blur-sm"
        >
            View Events
        </button>
    </div>

    <!-- FOOTER LINKS -->
    <div
        class="mt-16 flex flex-wrap justify-center gap-6 md:gap-8 text-xl md:text-2xl text-stone-400 px-4 w-full relative z-10"
    >
        <a
            href={SOCIALS.linkedin}
            class="hover:text-primary-500 transition-colors flex items-center gap-2"
            ><i class="fab fa-linkedin"></i>
            <span class="hidden sm:inline">LinkedIn</span></a
        >
        <a
            href={SOCIALS.instagram}
            class="hover:text-primary-500 transition-colors flex items-center gap-2"
            ><i class="fab fa-instagram"></i>
            <span class="hidden sm:inline">Instagram</span></a
        >
        <a
            href={SOCIALS.github}
            class="hover:text-primary-500 transition-colors flex items-center gap-2"
            ><i class="fab fa-github"></i>
            <span class="hidden sm:inline">GitHub</span></a
        >
    </div>
</div>
