<script lang="ts">
    import { spring } from "svelte/motion";

    let el: HTMLDivElement;
    let rotation = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.4 });
    let scale = spring(1, { stiffness: 0.1, damping: 0.4 });

    // For spotlight/holographic effects
    let m = { x: 0, y: 0 };

    let rafId: number;

    function handleMouseMove(e: MouseEvent) {
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
            rafId = 0;

            if (!el) return;
            if (window.innerWidth < 768) {
                rotation.set({ x: 0, y: 0 });
                return;
            }

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            m = { x, y };

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
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
        m = { x: 0, y: 0 }; // Hide spotlight
    }
</script>

<div
    bind:this={el}
    class="perspective-1000 transform-style-3d interactive cursor-pointer md:cursor-none will-change-transform relative"
    on:mousemove={handleMouseMove}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    role="img"
    aria-label="Interactive 3D Card"
    style="
        transform: perspective(1000px) rotateX({$rotation.x}deg) rotateY({$rotation.y}deg) scale({$scale});
        --mouse-x: {m.x}px;
        --mouse-y: {m.y}px;
    "
>
    <!-- Holographic/Sheen Overlay -->
    <div
        class="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl overflow-hidden"
        style="
            background: radial-gradient(
                circle at var(--mouse-x) var(--mouse-y), 
                rgba(255,255,255,0.1) 0%, 
                transparent 60%
            );
            mix-blend-mode: overlay;
        "
    ></div>

    <!-- Iridescent Border Shine -->
    <div
        class="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style="
            background: linear-gradient(
                105deg,
                transparent 20%,
                rgba(255, 255, 255, 0.1) 40%, /* Subtle white shine */
                rgba(var(--color-primary-400), 0.2) 45%, /* Tint of primary */
                rgba(255, 255, 255, 0.1) 50%,
                transparent 70%
            );
            background-size: 200% 200%;
            background-position: calc((var(--mouse-x) + var(--mouse-y)) / 5) center;
            mix-blend-mode: color-dodge;
        "
    ></div>

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
