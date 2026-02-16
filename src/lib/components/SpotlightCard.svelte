<script lang="ts">
    import { onMount } from "svelte";

    // Props
    export let className: string = "";

    let el: HTMLDivElement;

    function handleMouseMove(e: MouseEvent) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={el}
    on:mousemove={handleMouseMove}
    class="group relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl transition-all duration-500 hover:bg-white/10 hover:border-primary-500/30 hover:shadow-[0_0_30px_rgba(var(--color-primary-500-rgb),0.15)] {className}"
>
    <!-- Gradient Spotlight (Frozen Effect) -->
    <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style="
            background: radial-gradient(
                600px circle at var(--x) var(--y),
                rgba(255, 255, 255, 0.1),
                transparent 40%
            );
        "
    ></div>

    <div class="relative z-10 w-full h-full">
        <slot />
    </div>
</div>
