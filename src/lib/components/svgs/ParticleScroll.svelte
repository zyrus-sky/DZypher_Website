<script lang="ts">
    import { onMount } from "svelte";

    let scrollY = $state(0);

    // Parallax factor
    const speed = 0.2;

    function handleScroll() {
        scrollY = window.scrollY;
    }

    $effect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    // Calculate opacity for crossfade based on scroll (0 to 500px range)
    let transitionProgress = $derived(Math.min(scrollY / 500, 1));
</script>

<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-100">
    <!-- Frame 1: Fades OUT as you scroll down -->
    <div
        class="absolute inset-0 bg-primary-500 transition-transform duration-75 ease-out will-change-transform"
        style="
            mask-image: url('/assets/frame1.svg');
            -webkit-mask-image: url('/assets/frame1.svg');
            mask-size: cover;
            -webkit-mask-size: cover;
            mask-position: center;
            opacity: {1 - transitionProgress};
            transform: translateY({scrollY * speed * -1}px);
        "
    ></div>

    <!-- Frame 2: Fades IN as you scroll down -->
    <div
        class="absolute inset-0 bg-secondary-500 transition-transform duration-75 ease-out will-change-transform"
        style="
            mask-image: url('/assets/frame2.svg');
            -webkit-mask-image: url('/assets/frame2.svg');
            mask-size: cover;
            -webkit-mask-size: cover;
            mask-position: center;
            opacity: {transitionProgress};
            transform: translateY({scrollY * speed * -1.2}px) scale(1.05);
        "
    ></div>
</div>

<style>
    /* Ensure masks work across browsers */
    div {
        mask-repeat: no-repeat;
        -webkit-mask-repeat: no-repeat;
    }
</style>
