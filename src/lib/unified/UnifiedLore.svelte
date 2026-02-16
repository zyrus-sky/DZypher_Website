<script lang="ts">
    import { reveal } from "$lib/actions";
    import { fetchFanficsLive, type Fanfic } from "$lib/csvParser";
    import { selectedFanfic } from "$lib/stores";

    // --- Origin Data ---
    const milestones = [
        {
            year: "Feb 14, 2025",
            title: "The Beginning",
            description:
                "The inception of DZypher. A vision to bridge the gap between theory and application was born.",
            icon: "fas fa-rocket",
        },
        {
            year: "Jan 23-24, 2026",
            title: "Yukthi Techfest",
            description:
                "Showcased our potential and hosted events at the college techfest, Yukthi.",
            icon: "fas fa-star",
        },
        {
            year: "Feb 20-21, 2026",
            title: "DZypher Techfest",
            description:
                "Our very first independent techfest. A milestone event celebrating innovation and community.",
            icon: "fas fa-trophy",
        },
    ];

    // --- Fanfic Data ---
    let fanfics = $state<Fanfic[]>([]);
    let loading = $state(true);
    let visibleLimit = $state(4);

    $effect(() => {
        (async () => {
            try {
                fanfics = await fetchFanficsLive();
            } catch (e) {
                console.error("Fanfic load error:", e);
            } finally {
                loading = false;
            }
        })();
    });

    function openBook(fic: Fanfic) {
        $selectedFanfic = fic;
    }
</script>

<div id="origin" class="snap-start">
    <!-- ORIGIN SECTION -->
    <div
        class="min-h-[80vh] flex flex-col justify-center py-24 relative overflow-hidden"
    >
        <!-- Background Effects -->
        <div
            class="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none"
        ></div>
        <div
            class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"
        ></div>

        <div class="container mx-auto px-6 relative z-10">
            <h2
                use:reveal
                class="reveal-fade-up text-4xl md:text-5xl font-bold text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-500"
            >
                Our Origin Story
            </h2>

            <div class="relative max-w-4xl mx-auto">
                <!-- Animated Central Line -->
                <div
                    class="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] hidden md:block overflow-hidden"
                >
                    <div
                        class="w-full h-full bg-gradient-to-b from-transparent via-primary-500/50 to-transparent timeline-shimmer"
                    ></div>
                </div>

                <!-- Mobile Line -->
                <div
                    class="absolute left-[19px] top-0 h-full w-[2px] md:hidden overflow-hidden"
                >
                    <div
                        class="w-full h-full bg-gradient-to-b from-transparent via-primary-500/30 to-transparent timeline-shimmer"
                    ></div>
                </div>

                <div class="space-y-8 md:space-y-20">
                    {#each milestones as milestone, i}
                        <div
                            use:reveal
                            class="{i % 2 === 0
                                ? 'reveal-fade-left'
                                : 'reveal-fade-right'} flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 pl-12 md:pl-0 relative {i %
                                2 ===
                            0
                                ? 'md:flex-row-reverse'
                                : ''}"
                            style="transition-delay: {i * 200}ms"
                        >
                            <!-- Glowing Dot -->
                            <div
                                class="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex-none z-20"
                            >
                                <div
                                    class="w-10 h-10 rounded-full border-2 border-primary-500 bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_25px_rgba(var(--color-primary-500-rgb),0.5)] relative"
                                >
                                    <i
                                        class="{milestone.icon} text-primary-400 text-sm"
                                    ></i>
                                    <div
                                        class="absolute inset-0 rounded-full border border-primary-500/30 animate-ping opacity-20 pointer-events-none"
                                    ></div>
                                </div>
                            </div>

                            <!-- Content Card with Glassmorphism + Frost -->
                            <div
                                class="flex-1 text-left {i % 2 === 0
                                    ? 'md:text-right'
                                    : 'md:text-left'}"
                            >
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    class="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/8 hover:border-primary-500/20 hover:shadow-[0_0_30px_rgba(var(--color-primary-500-rgb),0.1)] transition-all duration-500 idle-float origin-card overflow-hidden"
                                    style="animation-delay: {i * 0.7}s;"
                                    onmousemove={(e) => {
                                        const rect =
                                            e.currentTarget.getBoundingClientRect();
                                        e.currentTarget.style.setProperty(
                                            "--x",
                                            `${e.clientX - rect.left}px`,
                                        );
                                        e.currentTarget.style.setProperty(
                                            "--y",
                                            `${e.clientY - rect.top}px`,
                                        );
                                    }}
                                >
                                    <!-- Frost Spotlight -->
                                    <div
                                        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl z-0"
                                        style="background: radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.15), transparent 40%);"
                                    ></div>
                                    <span
                                        class="text-primary-400 text-sm font-mono tracking-wider mb-2 block"
                                        >{milestone.year}</span
                                    >
                                    <h3
                                        class="text-2xl md:text-3xl font-bold text-white mb-3"
                                    >
                                        {milestone.title}
                                    </h3>
                                    <p
                                        class="text-stone-400 leading-relaxed text-sm md:text-base"
                                    >
                                        {milestone.description}
                                    </p>
                                </div>
                            </div>

                            <!-- Spacer for desktop alternating layout -->
                            <div class="flex-1 hidden md:block"></div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<div id="fanficx" class="snap-start relative border-t border-white/5">
    <!-- FANFIC SECTION -->
    <div
        class="min-h-screen w-full py-12 md:py-24 flex flex-col justify-center items-center relative"
    >
        <!-- Background -->
        <div
            class="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none"
        ></div>

        <div class="container mx-auto px-6 text-center">
            <h1
                use:reveal
                class="reveal-fade-up text-4xl md:text-6xl font-bold text-primary-500 mb-4 font-serif tracking-widest uppercase"
            >
                Fanficx
            </h1>
            <p use:reveal class="reveal-fade-up delay-100 text-stone-400 mb-12">
                Stories from the DZypher Universe.
            </p>

            {#if loading}
                <div
                    class="p-12 border border-primary-500/20 rounded-2xl bg-white/5 backdrop-blur-lg"
                >
                    <p class="text-xl text-stone-500 animate-pulse">
                        Scanning Library...
                    </p>
                </div>
            {:else if fanfics.length === 0}
                <div
                    class="p-12 border border-primary-500/20 rounded-2xl bg-white/5 backdrop-blur-lg max-w-lg mx-auto"
                >
                    <i class="fas fa-book-open text-4xl text-primary-900 mb-4"
                    ></i>
                    <p class="text-stone-400">No stories found yet.</p>
                </div>
            {:else}
                <div
                    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto"
                >
                    {#each fanfics.slice(0, visibleLimit) as fic, i}
                        <button
                            use:reveal
                            class="reveal-fade-up text-left group focus:outline-none book-float {i %
                                2 ===
                            1
                                ? 'md:mt-10'
                                : ''}"
                            style="transition-delay: {i *
                                100}ms; animation-delay: {i * 0.6}s;"
                            onclick={() => openBook(fic)}
                        >
                            <!-- 3D Book Container with Perspective -->
                            <div class="perspective-[1000px] group/book">
                                <div
                                    class="relative aspect-[2/3] transition-all duration-500 ease-out transform-style-3d group-hover/book:rotate-y-[-15deg] group-hover/book:rotate-x-[5deg] group-hover/book:translate-z-[20px] shadow-2xl"
                                >
                                    <!-- Front Cover -->
                                    <div
                                        class="absolute inset-0 rounded-r-md overflow-hidden z-20 backface-hidden"
                                    >
                                        <!-- Cover Image -->
                                        {#if fic.cover}
                                            <img
                                                src={fic.cover}
                                                alt="{fic.title} cover"
                                                class="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <div
                                                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                                            ></div>
                                        {:else}
                                            <div
                                                class="absolute inset-0 bg-gradient-to-br from-primary-950 via-stone-900 to-black"
                                            ></div>
                                            <div
                                                class="absolute inset-0 opacity-5"
                                                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px);"
                                            ></div>
                                        {/if}

                                        <!-- Glassy Gloss Overlay -->
                                        <div
                                            class="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-50 pointer-events-none mix-blend-overlay"
                                        ></div>
                                        <div
                                            class="absolute inset-0 bg-[url('/textures/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"
                                        ></div>

                                        <!-- Spine Highlight -->
                                        <div
                                            class="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-white/30 to-transparent z-30"
                                        ></div>

                                        <!-- Border Glow -->
                                        <div
                                            class="absolute inset-0 border border-white/10 rounded-r-md z-30 group-hover/book:border-primary-500/30 transition-colors duration-300"
                                        ></div>

                                        <!-- Content -->
                                        <div
                                            class="absolute inset-0 p-5 pl-6 flex flex-col justify-end z-30"
                                        >
                                            <h3
                                                class="font-serif text-lg md:text-xl text-white font-bold leading-snug drop-shadow-lg line-clamp-3"
                                            >
                                                {fic.title}
                                            </h3>
                                            <p
                                                class="text-primary-300/80 text-xs mt-1.5 font-mono tracking-wide"
                                            >
                                                by {fic.author}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Fake Pages (Thickness) - Right Side -->
                                    <div
                                        class="absolute top-[2px] bottom-[2px] right-0 w-[12px] bg-[#ddd] origin-right rotate-y-[90deg] translate-z-[-1px] transform-style-3d"
                                        style="background-image: linear-gradient(to right, #ccc 1px, transparent 1px); background-size: 2px 100%;"
                                    ></div>

                                    <!-- Fake Pages (Thickness) - Bottom Side -->
                                    <div
                                        class="absolute bottom-0 left-[3px] right-0 h-[10px] bg-[#ccc] origin-bottom rotate-x-[90deg] translate-z-[-1px]"
                                    ></div>

                                    <!-- Hover Reveal: Description Overlay with Glassmorphism -->
                                    <div
                                        class="absolute inset-0 z-40 bg-black/60 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-end opacity-0 group-hover/book:opacity-100 transition-opacity duration-300 rounded-r-md translate-z-[1px]"
                                    >
                                        <h3
                                            class="font-serif text-base text-white font-bold mb-2 leading-tight"
                                        >
                                            {fic.title}
                                        </h3>
                                        <p
                                            class="text-stone-300 text-xs leading-relaxed line-clamp-4 mb-3"
                                        >
                                            {fic.description ||
                                                "A story from the DZypher universe..."}
                                        </p>
                                        <span
                                            class="text-primary-400 text-xs font-bold uppercase tracking-wider"
                                            >Read Now <i
                                                class="fas fa-arrow-right ml-1"
                                            ></i></span
                                        >
                                    </div>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>

                {#if fanfics.length > 4}
                    <div class="mt-16 relative z-10">
                        <button
                            class="relative px-10 py-4 group overflow-hidden rounded-full transition-all duration-300"
                            onclick={() =>
                                (visibleLimit =
                                    visibleLimit === 4 ? fanfics.length : 4)}
                        >
                            <!-- Liquid Glass Background -->
                            <div
                                class="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_0_20px_rgba(var(--color-primary-500-rgb),0.3)]"
                            ></div>

                            <!-- Fluid Shine Effect -->
                            <div
                                class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style="background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, transparent);"
                            ></div>

                            <span
                                class="relative z-10 text-white font-bold tracking-widest uppercase text-sm group-hover:text-primary-200 transition-colors"
                            >
                                {visibleLimit === 4
                                    ? "View More Stories"
                                    : "Show Less"}
                            </span>
                        </button>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

<style>
    .idle-float {
        animation: float 4s ease-in-out infinite;
    }

    .book-float {
        animation: bookFloat 5s ease-in-out infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-6px);
        }
    }

    @keyframes bookFloat {
        0%,
        100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-8px) rotate(0.5deg);
        }
    }

    .timeline-shimmer {
        background-size: 100% 200%;
        animation: shimmer 3s ease-in-out infinite;
    }

    @keyframes shimmer {
        0%,
        100% {
            background-position: 0% 0%;
        }
        50% {
            background-position: 0% 100%;
        }
    }

    .origin-card {
        transition: transform 0.5s ease;
    }
    .origin-card:hover {
        transform: translateY(-6px) scale(1.02);
    }
</style>
