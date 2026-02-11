<script lang="ts">
    import { spring } from "svelte/motion";

    let coords = spring(
        { x: -50, y: -50 },
        {
            stiffness: 1.0, // Maximum stiffness for immediate response
            damping: 1.0, // Critical damping to prevent overshoot
        },
    );

    let trailCoords = spring(
        { x: -50, y: -50 },
        {
            stiffness: 0.05,
            damping: 0.2,
        },
    );

    let size = spring(10, { stiffness: 0.3, damping: 0.6 });
    let isHovering = $state(false);

    function handleMouseMove(e: MouseEvent) {
        coords.set({ x: e.clientX, y: e.clientY });
        trailCoords.set({ x: e.clientX, y: e.clientY });
    }

    function handleMouseDown() {
        size.set(20);
    }

    function handleMouseUp() {
        size.set(isHovering ? 50 : 10);
    }

    // Global listener for hover effects on interactive elements
    function addHoverListeners() {
        const elements = document.querySelectorAll(
            "a, button, input, .interactive",
        );
        elements.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                isHovering = true;
                size.set(50);
            });
            el.addEventListener("mouseleave", () => {
                isHovering = false;
                size.set(10);
            });
        });
    }

    // Svelte 5: Use $effect for side effects
    $effect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        // Setup MutationObserver to watch for new elements (like after navigation)
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        addHoverListeners();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            observer.disconnect();
        };
    });
</script>

<div class="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block">
    <!-- Trail Cursor -->
    <div
        class="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-400/50 blur-[2px]"
        style="transform: translate({$trailCoords.x}px, {$trailCoords.y}px)"
    ></div>

    <!-- Main Cursor -->
    <div
        class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500 bg-red-500/10 backdrop-blur-[1px]"
        style="transform: translate({$coords.x}px, {$coords.y}px); width: {$size}px; height: {$size}px; transition: width 0.1s, height 0.1s"
    >
        <div
            class="absolute inset-0 rounded-full bg-red-500 opacity-40 blur-md"
        ></div>
    </div>

    <!-- Dot -->
    <div
        class="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_red]"
        style="transform: translate({$coords.x}px, {$coords.y}px)"
    ></div>
</div>
