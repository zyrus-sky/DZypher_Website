<script>
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";

    let progress = spring(0, { stiffness: 0.1, damping: 0.6 });

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

<div class="fixed top-0 left-0 w-full h-1 z-[100]">
    <div
        class="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_red]"
        style="width: {$progress}%"
    ></div>
</div>
