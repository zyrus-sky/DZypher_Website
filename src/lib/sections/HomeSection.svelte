<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import Countdown from "$lib/components/Countdown.svelte";
    import { SOCIALS } from "$lib/data";
    import { reveal, typewriter } from "$lib/actions";
    import {
        countdownStore,
        fetchCountdownData,
        themeStore,
    } from "$lib/stores";
    import { generateGoogleCalendarUrl } from "$lib/calendarUtils";

    // Svelte 5: Use $effect instead of onMount
    $effect(() => {
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
    <!-- Absolute background div for parallax -->
    <div
        class="absolute inset-0 z-0"
        style="transform: translateY({scrollY * 0.5}px);"
    >
        <!-- Add your background elements here if any, e.g., gradients, images -->
    </div>

    <Logo className="w-full max-w-2xl mb-8 animate-fade-in-up relative z-10" />

    <div
        class="relative z-10 perspective-container"
        use:reveal
        role="group"
        aria-label="Interactive Logo Container"
        onmousemove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            e.currentTarget.style.setProperty("--tx", `${x / 50}deg`);
            e.currentTarget.style.setProperty("--ty", `${-y / 50}deg`);
        }}
        onmouseleave={(e) => {
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
                            alt=""
                            class="absolute top-0 left-0 w-full md:w-[800px] h-auto object-contain opacity-0 group-hover:opacity-50 group-hover:animate-glitch-1 z-10 mix-blend-screen pointer-events-none"
                            style="transform: translateZ(-10px); filter: drop-shadow(5px 0 0 red);"
                        />
                        <img
                            src="/assets/Vortix_text.svg"
                            alt=""
                            class="absolute top-0 left-0 w-full md:w-[800px] h-auto object-contain opacity-0 group-hover:opacity-50 group-hover:animate-glitch-2 z-30 mix-blend-screen pointer-events-none"
                            style="transform: translateZ(10px); filter: drop-shadow(-5px 0 0 cyan);"
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

    <div
        class="w-full mt-8 reveal-fade-up delay-500 flex flex-col items-center relative z-10"
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
                class="mt-6 px-6 py-2 bg-white/5 hover:bg-primary-900/40 text-stone-300 hover:text-white border border-white/10 hover:border-primary-500/50 rounded-full transition-all text-sm font-semibold backdrop-blur-sm flex items-center gap-2"
            >
                <i class="far fa-calendar-plus"></i> Add to Google Calendar
            </a>
        {/if}
    </div>

    <div
        class="mt-12 flex flex-wrap gap-4 justify-center reveal-fade-up delay-500 relative z-10"
        use:reveal
    >
        <a
            href={SOCIALS.discord}
            target="_blank"
            rel="noreferrer"
            class="group relative px-8 py-3 bg-primary-700/80 hover:bg-primary-600 text-white rounded-full transition-all shadow-[0_0_20px_var(--color-primary-900)] hover:shadow-[0_0_30px_var(--color-primary-600)] font-semibold flex items-center gap-2 overflow-hidden"
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
