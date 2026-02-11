<script lang="ts">
    import { fade, slide } from "svelte/transition";

    // Svelte 5: Props using $props()
    let {}: {} = $props();

    let isPlaying = $state(false);
    let isMuted = $state(false);
    let volume = $state(0.5);
    let audio: HTMLAudioElement;
    let showControls = $state(false);

    const track = {
        title: "Cyberpunk Ambient",
        src: "https://cdn.pixabay.com/audio/2022/03/15/audio_73429393d2.mp3", // Placeholder lo-fi track
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
</script>

<div class="fixed bottom-6 left-6 z-40 flex items-end gap-2">
    <!-- Main Toggle Button -->
    <button
        class="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-primary-900/50 hover:border-primary-500/50 transition-all shadow-lg group"
        onclick={() => (showControls = !showControls)}
    >
        <div class="relative w-full h-full flex items-center justify-center">
            {#if isPlaying}
                <!-- Visualizer bars animation -->
                <div class="flex gap-[2px] items-end h-4">
                    <div
                        class="w-1 bg-primary-500 animate-[bounce_1s_infinite] h-2"
                    ></div>
                    <div
                        class="w-1 bg-primary-500 animate-[bounce_1.2s_infinite] h-3"
                    ></div>
                    <div
                        class="w-1 bg-primary-500 animate-[bounce_0.8s_infinite] h-1"
                    ></div>
                </div>
            {:else}
                <i class="fas fa-music text-xs group-hover:text-primary-400"
                ></i>
            {/if}
        </div>
    </button>

    <!-- Expanded Controls -->
    {#if showControls}
        <div
            class="bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-3 w-48 mb-2 absolute bottom-full left-0 origin-bottom-left glass-panel"
            transition:slide
        >
            <div class="flex items-center justify-between mb-2">
                <span
                    class="text-xs font-bold text-gray-300 truncate max-w-[100px]"
                    >{track.title}</span
                >
                <div class="flex gap-2">
                    <button
                        class="text-gray-400 hover:text-white"
                        onclick={toggleMute}
                    >
                        <i
                            class="fas {isMuted
                                ? 'fa-volume-mute'
                                : 'fa-volume-up'} text-xs"
                        ></i>
                    </button>
                    <button
                        class="text-gray-400 hover:text-white"
                        onclick={togglePlay}
                    >
                        <i
                            class="fas {isPlaying
                                ? 'fa-pause'
                                : 'fa-play'} text-xs"
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
                class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:rounded-full"
            />
        </div>
    {/if}

    <audio bind:this={audio} src={track.src}></audio>
</div>
