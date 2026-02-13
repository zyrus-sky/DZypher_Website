<script lang="ts">
    import { onMount } from "svelte";
    import { fetchFanficsLive, type Fanfic } from "$lib/csvParser";
    import { reveal } from "$lib/actions";
    import { selectedFanfic } from "$lib/stores";

    let fanfics: Fanfic[] = [];
    let loading = true;

    onMount(async () => {
        try {
            fanfics = await fetchFanficsLive();
        } catch (e) {
            console.error("Fanfic load error:", e);
        } finally {
            loading = false;
        }
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
                {#each fanfics as fic, i}
                    <button
                        use:reveal
                        class="reveal-fade-up text-left group focus:outline-none"
                        style="transition-delay: {i * 80}ms"
                        on:click={() => openBook(fic)}
                    >
                        <div
                            class="relative aspect-[2/3] rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_rgba(var(--color-primary-500-rgb),0.15)]"
                        >
                            <!-- Cover Image or Gradient Fallback -->
                            {#if fic.cover}
                                <img
                                    src={fic.cover}
                                    alt="{fic.title} cover"
                                    class="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                                ></div>
                            {:else}
                                <div
                                    class="absolute inset-0 bg-gradient-to-br from-primary-950 via-stone-900 to-black"
                                ></div>
                                <!-- Decorative pattern for no-cover books -->
                                <div
                                    class="absolute inset-0 opacity-5"
                                    style="background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px);"
                                ></div>
                            {/if}

                            <!-- Book Spine -->
                            <div
                                class="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-primary-700/40 to-transparent z-20"
                            ></div>
                            <div
                                class="absolute left-[3px] top-0 bottom-0 w-px bg-white/10 z-20"
                            ></div>

                            <!-- Decorative border frame -->
                            <div
                                class="absolute inset-3 border border-white/10 rounded-sm z-10 pointer-events-none transition-colors duration-300 group-hover:border-primary-500/30"
                            ></div>

                            <!-- Title & Author (always visible) -->
                            <div
                                class="absolute inset-0 p-5 pl-6 flex flex-col justify-end z-10"
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

                            <!-- Hover Reveal: Description Overlay -->
                            <div
                                class="absolute inset-0 z-30 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            >
                                <div
                                    class="bg-gradient-to-t from-black via-black/95 to-black/70 backdrop-blur-sm p-5 pl-6 pt-10"
                                >
                                    <h3
                                        class="font-serif text-base md:text-lg text-white font-bold leading-snug mb-2"
                                    >
                                        {fic.title}
                                    </h3>
                                    <p
                                        class="text-stone-400 text-xs leading-relaxed line-clamp-4 mb-3"
                                    >
                                        {fic.description ||
                                            "A story from the DZypher universe..."}
                                    </p>
                                    <span
                                        class="inline-flex items-center text-primary-400 text-xs font-semibold tracking-wide group-hover:gap-2 transition-all"
                                    >
                                        Read <i
                                            class="fas fa-arrow-right text-[10px] ml-1 group-hover:translate-x-1 transition-transform"
                                        ></i>
                                    </span>
                                </div>
                            </div>

                            <!-- Top shine on hover -->
                            <div
                                class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                            ></div>
                        </div>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    /* No custom styles needed for new book design */
</style>
