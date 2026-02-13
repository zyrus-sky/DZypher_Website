<script lang="ts">
    import { spring } from "svelte/motion";

    // Svelte 5: Props using $props()
    let { strength = 0.5 }: { strength?: number } = $props();

    // Svelte 5: Reactive state using $state()
    let coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.1,
            damping: 0.25,
        },
    );

    function handleMouseMove(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        if (!target) return;

        const rect = target.getBoundingClientRect();
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
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    style="transform: translate({$coords.x}px, {$coords.y}px)"
    role="button"
    tabindex="0"
>
    <slot />
</div>
