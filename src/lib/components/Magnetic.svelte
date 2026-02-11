<script>
    import { spring } from "svelte/motion";

    export let strength = 0.5; // How strong the magnetic pull is (0-1)

    let coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.1,
            damping: 0.25,
        },
    );

    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        coords.set({ x: x * strength, y: y * strength });
    }

    function handleMouseLeave() {
        coords.set({ x: 0, y: 0 });
    }
</script>

<div
    class="inline-block"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    style="transform: translate({$coords.x}px, {$coords.y}px)"
    role="button"
    tabindex="0"
>
    <slot />
</div>
