<script lang="ts">
    import { fetchFanficsLive, type Fanfic } from "$lib/csvParser";
    import TiltCard from "$lib/components/TiltCard.svelte";
    import { reveal } from "$lib/actions";
    import { selectedFanfic } from "$lib/stores";

    let fanfics = $state<Fanfic[]>([]);
    let loading = $state(true);

    // Svelte 5: Use $effect for async data loading
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

<div
    id="fanficx"
    class="min-h-screen w-full py-12 md:py-24 flex flex-col justify-center items-center relative"
>
    <div class="container mx-auto px-6 text-center">
        <h1
            use:reveal
            class="reveal-fade-up text-4xl md:text-6xl font-bold text-primary-500 mb-4 font-alan-sans tracking-widest uppercase"
        >
            Fanficx
        </h1>
        <p use:reveal class="reveal-fade-up delay-100 text-stone-400 mb-12">
            Stories from the DZypher Universe.
        </p>

        {#if loading}
            <div
                class="p-12 border border-primary-500/20 rounded-2xl bg-black/80"
            >
                <p class="text-xl text-stone-500 animate-pulse">
                    Scanning Library...
                </p>
            </div>
        {:else if fanfics.length === 0}
            <div
                class="p-12 border border-primary-500/20 rounded-2xl bg-black/80 max-w-lg mx-auto"
            >
                <i class="fas fa-book-open text-4xl text-primary-900 mb-4"></i>
                <p class="text-stone-400">No stories found yet.</p>
                <p class="text-stone-600 text-sm mt-2">
                    Check the Google Sheet 'fanficx' tab.
                </p>
            </div>
        {:else}
            <!-- Grid -->
            <div
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto"
            >
                {#each fanfics as fic}
                    <button
                        class="text-left group perspective-1000 focus:outline-none"
                        onclick={() => openBook(fic)}
                    >
                        <TiltCard>
                            <div
                                class="relative aspect-[2/3] bg-gradient-to-br from-stone-900 to-black rounded-r-lg border-l-4 border-l-stone-800 shadow-2xl transform transition-transform group-hover:-translate-y-2 group-hover:rotate-y-[-10deg] overflow-hidden"
                            >
                                <!-- Book Spine -->
                                <div
                                    class="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/10 to-transparent z-10"
                                ></div>

                                <div
                                    class="absolute inset-0 p-4 flex flex-col justify-between"
                                >
                                    <div
                                        class="border border-primary-900/30 inset-2 absolute rounded"
                                    ></div>

                                    <h3
                                        class="font-alan-sans text-xl md:text-2xl text-primary-100 mt-4 leading-tight drop-shadow-lg p-2 font-bold"
                                    >
                                        {fic.title}
                                    </h3>

                                    <div
                                        class="text-stone-500 text-xs md:text-sm font-mono p-2"
                                    >
                                        by {fic.author}
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    @font-face {
        font-family: "Alan Sans";
        src: local("Times New Roman"); /* Fallback to Serif for book feel */
    }
    .font-alan-sans {
        font-family: "Times New Roman", serif;
    }
    .perspective-1000 {
        perspective: 1000px;
    }
</style>
