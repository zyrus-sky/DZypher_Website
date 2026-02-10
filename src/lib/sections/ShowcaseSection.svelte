<script lang="ts">
    import { PROJECTS } from "$lib/data";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import { reveal } from "$lib/actions";
</script>

<div
    id="gallery"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center"
>
    <div class="container mx-auto px-6">
        <div class="text-center mb-16">
            <h1
                use:reveal
                class="reveal-fade-up text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
            >
                Project Showcase
            </h1>
            <p
                use:reveal
                class="reveal-fade-up delay-100 text-stone-400 text-lg max-w-2xl mx-auto"
            >
                Innovation in action. See what DZypher members are building.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each PROJECTS as project, i}
                <div
                    use:reveal
                    class="reveal-scale"
                    style="transition-delay: {i * 100}ms"
                >
                    <ProjectCard {project} />
                </div>
            {/each}
        </div>

        <!-- Call to Action -->
        <div class="mt-20 text-center" use:reveal>
            <div
                class="reveal-scale inline-block p-[2px] rounded-full bg-gradient-to-r from-red-500 to-blue-500"
            >
                <div class="bg-black rounded-full px-8 py-4">
                    <p class="text-stone-300">
                        Have a project to feature? <a
                            href="#"
                            class="text-white font-bold hover:underline"
                            >Submit it here</a
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
