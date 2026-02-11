<script lang="ts">
    import { reveal } from "$lib/actions";

    const milestones = [
        {
            year: "Feb 14, 2025",
            title: "The Beginning",
            description:
                "The inception of DZypher. A vision to bridge the gap between theory and application was born.",
        },
        {
            year: "Jan 23-24, 2026",
            title: "Yukthi Techfest",
            description:
                "Showcased our potential and hosted events at the college techfest, Yukthi.",
        },
        {
            year: "Feb 20-21, 2026",
            title: "DZypher Techfest",
            description:
                "Our very first independent techfest. A milestone event celebrating innovation and community.",
        },
    ];
</script>

<div
    id="resources"
    class="min-h-[80vh] flex flex-col justify-center py-24 relative overflow-hidden"
>
    <div class="container mx-auto px-6 relative z-10">
        <h2
            use:reveal
            class="reveal-fade-up text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-500"
        >
            Our Origin Story
        </h2>

        <div class="relative">
            <!-- Central Line -->
            <div
                class="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-primary-500/50 to-transparent hidden md:block"
            ></div>

            <div class="space-y-12 md:space-y-24">
                {#each milestones as milestone, i}
                    <div
                        use:reveal
                        class="reveal-fade-up flex flex-col md:flex-row items-center gap-8 md:gap-16 {i %
                            2 ===
                        0
                            ? 'md:flex-row-reverse'
                            : ''}"
                        style="transition-delay: {i * 100}ms"
                    >
                        <!-- Content -->
                        <div
                            class="flex-1 text-center md:text-left {i % 2 === 0
                                ? 'md:text-right'
                                : ''}"
                        >
                            <h3
                                class="text-3xl font-bold text-primary-400 mb-2"
                            >
                                {milestone.year}
                            </h3>
                            <h4 class="text-xl font-semibold text-white mb-3">
                                {milestone.title}
                            </h4>
                            <p
                                class="text-stone-400 leading-relaxed text-sm md:text-base"
                            >
                                {milestone.description}
                            </p>
                        </div>

                        <!-- Dot -->
                        <div class="relative flex-none">
                            <div
                                class="w-4 h-4 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] z-10 relative"
                            ></div>
                            <div
                                class="absolute inset-0 bg-primary-500/30 blur-md rounded-full animate-pulse"
                            ></div>
                        </div>

                        <!-- Spacer for opposite side -->
                        <div class="flex-1 hidden md:block"></div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
