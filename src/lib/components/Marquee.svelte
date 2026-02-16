<script lang="ts">
    import type { Snippet } from "svelte";
    import { viewport } from "$lib/actions";

    let {
        text = "VORTIX '26 • CHASE THE HORIZON • TECHNOLOGY • INNOVATION •",
        speed = 20,
        direction = "left",
        pauseOnHover = false,
        children,
    }: {
        text?: string;
        speed?: number;
        direction?: "left" | "right";
        pauseOnHover?: boolean;
        children?: Snippet;
    } = $props();

    const repeatCount = 2; // Reduced repeat count for children, relying on external flex loop
    let inView = $state(false);
</script>

<div
    class="relative w-full overflow-hidden py-4 bg-black/20 backdrop-blur-sm border-y border-white/5"
    use:viewport
    onenterViewport={() => (inView = true)}
    onexitViewport={() => (inView = false)}
>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="whitespace-nowrap flex gap-4 marquee-track"
        class:pause-on-hover={pauseOnHover}
        class:paused={!inView}
        style="
            --speed: {speed}s;
            --direction: {direction === 'left' ? 'normal' : 'reverse'};
        "
    >
        <!-- Render 2 copies of the content stream for seamless lopping -->
        {#each Array(2) as _}
            <div class="flex gap-4 items-center">
                {#each Array(4) as __}
                    <!-- If children snippet exists, render it. Else fallback to text -->
                    {#if children}
                        {@render children()}
                    {:else}
                        <span
                            class="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-stone-500 to-white/50 uppercase tracking-widest px-4"
                        >
                            {text}
                        </span>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .marquee-track {
        display: flex;
        width: fit-content;
        animation: scroll var(--speed) linear infinite;
        animation-direction: var(--direction);
    }

    /* Pause animation on hover if enabled */
    .pause-on-hover:hover {
        animation-play-state: paused;
    }

    /* Pause animation when out of view */
    .paused {
        animation-play-state: paused;
    }

    @keyframes scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }
</style>
