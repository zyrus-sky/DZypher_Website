<script lang="ts">
    // Svelte 5: Props using $props()
    let {
        title = "Card Title",
        description = "Card description goes here",
        image = "",
    }: { title?: string; description?: string; image?: string } = $props();
    import { themeStore } from "$lib/stores";
</script>

<div
    class="card p-6 rounded-3xl bg-m3-surface-variant text-m3-on-surface-variant max-w-sm"
>
    <h2 class="text-2xl font-bold mb-2">Material You Card</h2>
    <p class="mb-4">
        This card uses <code>bg-m3-surface-variant</code> and
        <code>text-m3-on-surface-variant</code>.
    </p>
    <div class="flex gap-2">
        <button
            class="px-4 py-2 rounded-full bg-m3-primary text-m3-on-primary font-medium"
        >
            Primary
        </button>
        <button
            class="px-4 py-2 rounded-full bg-m3-secondary-container text-m3-on-secondary-container font-medium"
        >
            Secondary
        </button>
    </div>
</div>

<div class="p-8 grid gap-8">
    <div
        <div class="flex gap-2">
            <button
                class="px-4 py-2 rounded-full bg-m3-primary text-m3-on-primary font-medium"
            >
                Primary
            </button>
            <button
                class="px-4 py-2 rounded-full bg-m3-secondary-container text-m3-on-secondary-container font-medium"
            >
                Secondary
            </button>
        </div>
    </div>

    <div
        class="card p-6 rounded-3xl bg-surface text-surface-on max-w-sm border border-m3-outline"
    >
        <h2 class="text-2xl font-bold mb-2">Surface Card</h2>
        <p class="mb-4">
            This card uses <code>bg-surface</code> and
            <code>text-surface-on</code>
            with <code>border-m3-outline</code>.
        </p>
        <div class="flex flex-wrap gap-2">
            {#if $themeStore?.colors}
                {#each $themeStore.colors as color}
                    <div
                        class="w-8 h-8 rounded-full"
                        style="background-color: {color}"
                    ></div>
                {/each}
            {/if}
        </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
            class="p-4 rounded-xl bg-m3-primary-container text-m3-on-primary-container"
        >
            Primary Container
        </div>
        <div
            class="p-4 rounded-xl bg-m3-secondary-container text-m3-on-secondary-container"
        >
            Secondary Container
        </div>
        <div
            class="p-4 rounded-xl bg-m3-tertiary-container text-m3-on-tertiary-container"
        >
            Tertiary Container
        </div>
        <div
            class="p-4 rounded-xl bg-m3-error-container text-m3-on-error-container"
        >
            Error Container
        </div>
    </div>
</div>
