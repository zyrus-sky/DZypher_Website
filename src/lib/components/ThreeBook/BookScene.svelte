<script lang="ts">
    import { Canvas } from "@threlte/core";
    import Experience from "./Experience.svelte";
    import UI from "./UI.svelte";

    // Explicit list of desired page contents
    const pages = [
        { front: "1", back: "2" }, // Cover (1), Inside Front (2)
        { front: "3", back: "4" }, // Page 1
        { front: "5", back: "6" }, // Page 2
        { front: "7", back: "8" }, // Page 3
        { front: "9", back: "book-back" }, // Page 4
    ];

    export let embedded: boolean = false;
</script>

<div
    class="relative w-full h-[100vh] {embedded
        ? 'bg-transparent'
        : 'bg-gray-900'}"
>
    {#if !embedded}
        <UI pagesCount={pages.length} />
    {/if}

    <Canvas shadows>
        <Experience {pages} interactive={embedded} />
    </Canvas>
</div>
