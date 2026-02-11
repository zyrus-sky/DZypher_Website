<script lang="ts">
    import TiltCard from "$lib/components/TiltCard.svelte";
    import { galleryStore, fetchGalleryData } from "$lib/stores";
    import { reveal } from "$lib/actions";

    // Svelte 5: Use $effect instead of onMount
    $effect(() => {
        fetchGalleryData();
    });
</script>

<div
    id="gallery"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center"
>
    <div class="container mx-auto px-6">
        <div class="text-center mb-12">
            <h1
                class="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4"
            >
                Moments
            </h1>
            <p class="text-stone-400 text-lg max-w-2xl mx-auto">
                Capturing the energy and innovation of DZypher events.
            </p>
        </div>

        <!-- Masonry Grid with Scroll -->
        <div
            class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar p-2"
        >
            {#each $galleryStore as photo}
                <div class="break-inside-avoid">
                    <TiltCard>
                        <div
                            class="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm"
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
                            >
                                <span class="text-white font-bold tracking-wide"
                                    >{photo.alt}</span
                                >
                            </div>
                        </div>
                    </TiltCard>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .break-inside-avoid {
        break-inside: avoid;
    }
</style>
