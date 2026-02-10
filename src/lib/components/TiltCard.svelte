<script lang="ts">
    import { spring } from "svelte/motion";

    let el: HTMLDivElement;
    let rotation = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.4 });
    let scale = spring(1, { stiffness: 0.1, damping: 0.4 });

    let rafId: number;

    function handleMouseMove(e: MouseEvent) {
        // Optimization: Throttling via requestAnimationFrame
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
            rafId = 0; // Reset

            if (!el) return;
            // Disable on small screens
            if (window.innerWidth < 768) {
                rotation.set({ x: 0, y: 0 });
                return;
            }

            const rect = el.getBoundingClientRect();
            // Optional: Check if cursor is actually somewhat near/inside (event already guarantees inside, but bounds check helps robustness)

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            rotation.set({ x: rotateX, y: rotateY });
        });
    }

    function handleMouseEnter() {
        scale.set(1.05);
    }

    function handleMouseLeave() {
        rotation.set({ x: 0, y: 0 });
        scale.set(1);
    }
</script>

<div
    bind:this={el}
    class="perspective-1000 transform-style-3d interactive cursor-pointer md:cursor-none will-change-transform"
    on:mousemove={handleMouseMove}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    role="img"
    aria-label="Interactive 3D Card"
    style="transform: perspective(1000px) rotateX({$rotation.x}deg) rotateY({$rotation.y}deg) scale({$scale});"
>
    <!-- Removing touch-action inline as it's better handled in global CSS or parent if needed, 
         but 'manipulation' is good for avoiding zoom delays. Keeping it simple here. -->
    <slot />
</div>

<style>
    .perspective-1000 {
        perspective: 1000px;
    }
    .transform-style-3d {
        transform-style: preserve-3d;
    }
    .will-change-transform {
        will-change: transform;
    }
</style>
