<script lang="ts">
    import { page } from "$app/stores";
    import { EVENTS } from "$lib/data";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    $: slug = $page.params.slug;

    // Helper to slugify title
    const slugify = (text: string) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

    $: program = EVENTS.find((e) => slugify(e.title) === slug);

    // Placeholder data for extended details since CSV/Data is limited
    const extendedDetails = {
        schedule: [
            { time: "10:00 AM", activity: "Introduction & Keynote" },
            { time: "11:00 AM", activity: "Hands-on Session" },
            { time: "01:00 PM", activity: "Lunch Break" },
            { time: "02:00 PM", activity: "Advanced Topics" },
            { time: "04:00 PM", activity: "Q&A and Networking" },
        ],
        requirements: [
            "Laptop with 8GB+ RAM",
            "Basic knowledge of Python",
            "VS Code installed",
            "Enthusiasm to learn!",
        ],
    };
</script>

<div class="min-h-screen py-32 px-6">
    {#if program}
        <div class="container mx-auto max-w-4xl">
            <!-- Header -->
            <div class="mb-12 text-center" in:fly={{ y: 20, duration: 800 }}>
                <span
                    class="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary-400 border border-primary-500/30 rounded-full bg-primary-950/30"
                >
                    {program.type.toUpperCase()}
                </span>
                <h1
                    class="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-400 mb-6"
                >
                    {program.title}
                </h1>
                <div
                    class="flex items-center justify-center gap-6 text-stone-400"
                >
                    <span
                        ><i class="far fa-calendar mr-2"
                        ></i>{program.date}</span
                    >
                    <span
                        ><i class="fas fa-map-marker-alt mr-2"></i>Main
                        Auditorium</span
                    >
                </div>
            </div>

            <!-- Content Grid -->
            <div class="grid md:grid-cols-3 gap-12">
                <!-- Main Info -->
                <div
                    class="md:col-span-2 space-y-12"
                    in:fly={{ y: 20, duration: 800, delay: 200 }}
                >
                    <!-- Description -->
                    <section>
                        <h2 class="text-2xl font-bold text-white mb-4">
                            About the Event
                        </h2>
                        <p class="text-stone-300 leading-relaxed text-lg">
                            {program.description}
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </section>

                    <!-- Schedule -->
                    <section>
                        <h2 class="text-2xl font-bold text-white mb-6">
                            Schedule
                        </h2>
                        <div class="space-y-4">
                            {#each extendedDetails.schedule as slot, i}
                                <div
                                    class="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary-500/30 transition-colors"
                                >
                                    <span
                                        class="text-primary-400 font-mono text-sm whitespace-nowrap"
                                        >{slot.time}</span
                                    >
                                    <span class="text-stone-300"
                                        >{slot.activity}</span
                                    >
                                </div>
                            {/each}
                        </div>
                    </section>
                </div>

                <!-- Sidebar -->
                <div
                    class="space-y-8"
                    in:fly={{ x: 20, duration: 800, delay: 400 }}
                >
                    <!-- Registration Card -->
                    <div
                        class="p-6 rounded-2xl bg-gradient-to-br from-stone-900 to-black border border-white/10 sticky top-32"
                    >
                        <div class="mb-6">
                            <span class="text-stone-400 text-sm">Status</span>
                            <div class="flex items-center gap-2 mt-1">
                                <div
                                    class="w-2 h-2 rounded-full {program.registration_status ===
                                    'OPEN'
                                        ? 'bg-green-500 animate-pulse'
                                        : 'bg-red-500'}"
                                ></div>
                                <span class="text-white font-bold tracking-wide"
                                    >{program.registration_status ||
                                        "CLOSED"}</span
                                >
                            </div>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-white font-semibold mb-4">
                                Requirements
                            </h3>
                            <ul class="space-y-2 text-sm text-stone-400">
                                {#each extendedDetails.requirements as req}
                                    <li class="flex items-start gap-2">
                                        <i
                                            class="fas fa-check text-primary-500 mt-1"
                                        ></i>
                                        <span>{req}</span>
                                    </li>
                                {/each}
                            </ul>
                        </div>

                        {#if program.registration_status === "OPEN"}
                            <a
                                href={program.registration_link || "#"}
                                target="_blank"
                                class="block w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-center rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1"
                            >
                                Register Now
                            </a>
                        {:else}
                            <button
                                disabled
                                class="block w-full py-4 bg-stone-800 text-stone-500 font-bold text-center rounded-xl cursor-not-allowed"
                            >
                                Registration Closed
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center min-h-[50vh]">
            <h1 class="text-4xl font-bold text-stone-700 mb-4">404</h1>
            <p class="text-stone-500">Program not found.</p>
            <a href="/" class="mt-8 text-primary-400 hover:underline"
                >Return Home</a
            >
        </div>
    {/if}
</div>
