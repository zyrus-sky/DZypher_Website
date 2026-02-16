<script lang="ts">
    import { onMount, onDestroy, type Snippet } from "svelte";
    import { browser } from "$app/environment";

    let { children }: { children: Snippet } = $props();
    let ref: HTMLDivElement;
    let mounted = false;

    onMount(() => {
        if (!browser) return;
        document.body.appendChild(ref);
        mounted = true;
    });

    onDestroy(() => {
        if (browser && ref && ref.parentNode) {
            document.body.removeChild(ref);
        }
    });
</script>

<div bind:this={ref} style="display: contents;">
    {@render children()}
</div>
