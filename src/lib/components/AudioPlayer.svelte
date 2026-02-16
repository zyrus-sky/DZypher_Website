<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import { onMount, onDestroy } from "svelte";

    // Svelte 5: Props using $props()
    let {}: {} = $props();

    let isPlaying = $state(false);
    let isMuted = $state(false);
    let volume = $state(0.5);
    let showControls = $state(false);

    // Audio State
    let audio: HTMLAudioElement | undefined = $state();

    const track = {
        title: "Legends Never Die (Theme)",
        // Use docs.google.com for better direct link handling
        src: "https://docs.google.com/uc?export=download&id=1mWZGoWAXMdn6k2Und1KgSGsMKkiOblwD",
    };

    function togglePlay() {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio
                .play()
                .catch((e: Error) =>
                    console.log("Audio autoplay prevented", e),
                );
        }
        isPlaying = !isPlaying;
    }

    function toggleMute() {
        if (!audio) return;
        audio.muted = !isMuted;
        isMuted = !isMuted;
    }

    function handleVolumeChange(e: Event) {
        const target = e.target as HTMLInputElement;
        volume = parseFloat(target.value);
        if (audio) audio.volume = volume;
    }

    // Svelte 5: Use $effect for side effects
    $effect(() => {
        if (audio) {
            audio.volume = volume;
            audio.loop = true;
        }
    });

    onDestroy(() => {
        // Cleanup if needed
    });
</script>

<div class="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
    <!-- Main Toggle Button -->
    <button
        class="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-primary-900/50 hover:border-primary-500/50 transition-all shadow-lg group relative overflow-hidden"
        onclick={() => (showControls = !showControls)}
        aria-label="Toggle Audio Controls"
    >
        <div
            class="relative w-full h-full flex items-center justify-center z-10"
        >
            {#if isPlaying}
                <!-- Visualizer bars animation -->
                <div class="flex gap-[3px] items-end h-5">
                    <div
                        class="w-1 bg-primary-500 animate-[bounce_1s_infinite] h-3"
                    ></div>
                    <div
                        class="w-1 bg-primary-500 animate-[bounce_1.2s_infinite] h-5"
                    ></div>
                    <div
                        class="w-1 bg-primary-500 animate-[bounce_0.8s_infinite] h-2"
                    ></div>
                </div>
            {:else}
                <i class="fas fa-music text-sm group-hover:text-primary-400"
                ></i>
            {/if}
        </div>
    </button>

    <!-- Expanded Controls -->
    {#if showControls}
        <div
            class="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-64 mb-3 absolute bottom-full right-0 origin-bottom-right glass-panel shadow-2xl"
            transition:slide
        >
            <div class="flex items-center justify-between mb-3">
                <div class="flex flex-col overflow-hidden mr-2">
                    <span class="text-xs font-bold text-white truncate"
                        >{track.title}</span
                    >
                </div>

                <div class="flex gap-3">
                    <button
                        class="text-gray-400 hover:text-white transition-colors"
                        onclick={toggleMute}
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        <i
                            class="fas {isMuted
                                ? 'fa-volume-mute'
                                : 'fa-volume-up'} text-sm"
                        ></i>
                    </button>
                    <button
                        class="text-white hover:text-primary-400 transition-colors"
                        onclick={togglePlay}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        <i
                            class="fas {isPlaying
                                ? 'fa-pause'
                                : 'fa-play'} text-lg"
                        ></i>
                    </button>
                </div>
            </div>

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                bind:value={volume}
                oninput={handleVolumeChange}
                class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
            />
        </div>
    {/if}

    <!-- Standard Audio Player -->
    <audio
        bind:this={audio}
        src={track.src}
        onerror={(e) => {
            console.error("Audio Load Error:", e);
            // Fallback to simple alert or ignore if user manually resolves
        }}
    ></audio>
</div>
