<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Scene from "./Scene.svelte";

    export let scrollY = 0; // Accept scroll prop
    export let customCameraZ: number | null = null; // Accept custom camera Z

    let mouseX = 0;
    let mouseY = 0;

    function handleMouseMove(e: MouseEvent) {
        const { clientX, clientY, currentTarget } = e;
        const rect = (currentTarget as HTMLElement).getBoundingClientRect();

        // Calculate normalized coordinates (-1 to 1)
        mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    function handleTouchMove(e: TouchEvent) {
        // We do NOT call preventDefault(), allowing page scroll to happen naturally.
        const touch = e.touches[0];
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function handleMouseLeave() {
        mouseX = 0;
        mouseY = 0;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="w-full h-full cursor-grab active:cursor-grabbing"
    onmousemove={handleMouseMove}
    ontouchmove={handleTouchMove}
    onmouseleave={handleMouseLeave}
>
    <Canvas>
        <Scene {mouseX} {mouseY} {scrollY} {customCameraZ} />
    </Canvas>
</div>
