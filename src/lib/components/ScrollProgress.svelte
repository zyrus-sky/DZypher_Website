<script lang="ts">
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";

    let progress = spring(0, { stiffness: 0.1, damping: 0.3 });

    function handleScroll() {
        const winScroll =
            document.body.scrollTop || document.documentElement.scrollTop;
        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progress.set(scrolled);
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<div class="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
    <div
        class="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_100%] animate-gradient-x"
        style="width: {$progress}%;"
    ></div>
</div>

<style>
    .animate-gradient-x {
        animation: gradient-x 3s ease infinite;
    }
    @keyframes gradient-x {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>
