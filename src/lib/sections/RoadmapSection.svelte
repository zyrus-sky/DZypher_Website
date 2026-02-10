<script lang="ts">
    import { onMount } from "svelte";
    import { DS_ROADMAP } from "$lib/data";
    import { fetchEventsLive } from "$lib/csvParser";
    import RoadmapNode from "$lib/components/RoadmapNode.svelte";
    import { reveal } from "$lib/actions";

    let roadmap = JSON.parse(JSON.stringify(DS_ROADMAP)); // Local copy
    let loading = true;

    onMount(async () => {
        const events = await fetchEventsLive();

        // Find Yukthi'26 node and inject events
        const yukthiNode = roadmap.find((item: any) => item.id === "yukthi-26");
        if (yukthiNode && events.length > 0) {
            yukthiNode.resources = events.map((e: any) => ({
                title: e.title,
                link: e.registration_link || "#",
                registration_status: e.registration_status,
                // Add extra fields if TimelineNode supports them
            }));
        }
        loading = false;
    });
</script>

<div
    id="roadmap"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center relative overflow-hidden"
>
    <!-- Simple Background Decor -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none"
    ></div>

    <div class="container mx-auto px-6 relative z-10">
        <h2
            use:reveal
            class="reveal-fade-up text-4xl md:text-5xl font-bold mb-16 text-center text-red-500 font-neuropol"
        >
            Roadmap
        </h2>

        <div class="max-w-4xl mx-auto px-4">
            <div class="space-y-12">
                {#each roadmap as node, i}
                    <div
                        use:reveal
                        class="reveal-fade-up group relative pl-8 border-l-2 border-red-900/30 hover:border-red-500 transition-colors"
                        style="transition-delay: {i * 100}ms"
                    >
                        <RoadmapNode
                            item={node}
                            index={i}
                            isLast={i === roadmap.length - 1}
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
