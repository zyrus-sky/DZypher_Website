<script lang="ts">
    import type { Project } from "$lib/data";
    import TiltCard from "./TiltCard.svelte";

    // Svelte 5: Props using $props()
    let { project }: { project: Project } = $props();
</script>

<TiltCard>
    <div
        class="group relative overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm h-full"
    >
        <!-- Image with Overlay -->
        <div class="relative h-48 overflow-hidden">
            <img
                src={project.image}
                alt={project.title}
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />
            <div
                class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"
            ></div>

            <!-- Floating Links -->
            <div
                class="absolute top-4 right-4 flex gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
            >
                {#if project.github}
                    <a
                        href={project.github}
                        target="_blank"
                        class="p-2 bg-black/50 rounded-full hover:bg-white text-white hover:text-black transition-colors backdrop-blur-md"
                    >
                        <i class="fab fa-github"></i>
                    </a>
                {/if}
                {#if project.link}
                    <a
                        href={project.link}
                        target="_blank"
                        class="p-2 bg-black/50 rounded-full hover:bg-red-600 text-white transition-colors backdrop-blur-md"
                    >
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                {/if}
            </div>
        </div>

        <!-- Content -->
        <div class="p-6 relative">
            <div class="absolute -top-10 left-6">
                <span
                    class="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg"
                >
                    {project.student}
                </span>
            </div>

            <h3 class="text-2xl font-bold text-white mb-2 mt-2">
                {project.title}
            </h3>
            <p class="text-stone-400 text-sm mb-4 line-clamp-2">
                {project.description}
            </p>

            <!-- Tech Stack -->
            <div class="flex flex-wrap gap-2 mt-auto">
                {#each project.techStack as tech}
                    <span
                        class="px-2 py-1 text-xs font-mono text-cyan-300 bg-cyan-900/20 border border-cyan-500/30 rounded"
                    >
                        {tech}
                    </span>
                {/each}
            </div>
        </div>
    </div>
</TiltCard>
