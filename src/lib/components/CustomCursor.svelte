<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { spring } from "svelte/motion";

    let { className = "" }: { className?: string } = $props();

    let coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.15,
            damping: 0.35,
        },
    );

    let dotCoords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 1, // Instant follow
            damping: 1,
        },
    );

    let isLinkHovered = $state(false);
    let isVisible = $state(false);

    function onMouseMove(e: MouseEvent) {
        isVisible = true;
        coords.set({ x: e.clientX, y: e.clientY });
        dotCoords.set({ x: e.clientX, y: e.clientY });
    }

    function onMouseLeave() {
        isVisible = false;
    }

    function onMouseEnter() {
        isVisible = true;
    }

    function onLinkHover(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const clickable = target.closest(
            'a, button, [role="button"], input, select, textarea',
        );
        isLinkHovered = !!clickable;
    }

    onMount(() => {
        if (matchMedia("(pointer: fine)").matches) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseout", onMouseLeave);
            window.addEventListener("mouseover", onMouseEnter);
            window.addEventListener("mouseover", onLinkHover); // Check on every hover
        }
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseout", onMouseLeave);
            window.removeEventListener("mouseover", onMouseEnter);
            window.removeEventListener("mouseover", onLinkHover);
        }
    });
</script>

{#if isVisible}
    <div class="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
        <!-- Trail Circle -->
        <div
            class="fixed w-10 h-10 border-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out will-change-transform shadow-[0_0_15px_var(--color-primary-500)]"
            style="
                left: {$coords.x}px; 
                top: {$coords.y}px;
                opacity: {isLinkHovered ? 0.6 : 0.8};
                transform: translate(-50%, -50%) scale({isLinkHovered
                ? 1.5
                : 1});
                background-color: {isLinkHovered
                ? 'rgba(var(--color-primary-500-rgb), 0.1)'
                : 'transparent'};
                border-color: rgba(var(--color-primary-400-rgb), 0.8);
            "
        ></div>

        <!-- Inner Dot (Bright White Core) -->
        <div
            class="fixed w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_white,0_0_30px_var(--color-primary-400)]"
            style="
                left: {$dotCoords.x}px; 
                top: {$dotCoords.y}px;
                display: {isLinkHovered ? 'none' : 'block'};
                opacity: 1;
            "
        ></div>
    </div>
{/if}

<style>
    /* Global cursor hiding should be done in global.css, but we can't edit it easily here without risk. 
       Usually better to just let the system cursor exist or hide it on body if desired.
       For now, we overlay.
       To hide system cursor:
    */

    /* Safest approach: Only hide cursor if we are sure custom cursor is active. 
       Or just leave system cursor visible as a fallback (hybrid mode).
       User asked for "better mouse pointer", implying replacement.
       Let's inject a style to hide cursor on non-touch devices.
    */
    @media (pointer: fine) {
        :global(body),
        :global(a),
        :global(button),
        :global(input) {
            cursor: none !important;
        }
    }
</style>
