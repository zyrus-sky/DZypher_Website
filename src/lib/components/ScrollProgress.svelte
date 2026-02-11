<script lang="ts">
    import { spring } from "svelte/motion";
    import { fade } from "svelte/transition";

    let scrollY = $state(0);
    let innerHeight = $state(0);
    let scrollHeight = $state(0);

    // Spring for smooth progress
    let progress = spring(0, { stiffness: 0.1, damping: 0.3 });

    // Svelte 5: Use $effect for reactive updates and to get scrollHeight
    $effect(() => {
        // Update scrollHeight from document
        scrollHeight = document.documentElement.scrollHeight;

        if (scrollHeight && innerHeight) {
            const maxScroll = scrollHeight - innerHeight;
            // Avoid division by zero
            const p = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
            progress.set(p);
        }
    });

    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    // Derived value for stroke-dashoffset
    let dashOffset = $derived(
        circumference - ($progress / 100) * circumference,
    );
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
    class="fixed bottom-8 right-8 z-50 pointer-events-none mix-blend-difference"
    transition:fade
>
    <svg class="transform -rotate-90 w-12 h-12" viewBox="0 0 50 50">
        <!-- Background Circle -->
        <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="4"
        />
        <!-- Progress Circle -->
        <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="var(--color-primary-500)"
            stroke-width="4"
            stroke-dasharray={circumference}
            stroke-dashoffset={dashOffset}
            stroke-linecap="round"
            class="transition-all duration-75"
        />
    </svg>
    <div
        class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white"
    >
        {Math.round($progress)}%
    </div>
</div>
