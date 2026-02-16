<script lang="ts">
    import { pageAtom } from "./store";
    import { onMount } from "svelte";

    export let pagesCount: number = 0;

    let audio: HTMLAudioElement;
    onMount(() => {
        audio = new Audio("/audios/page-flip-01a.mp3");
    });

    $: if (audio && $pageAtom !== undefined) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.log("Audio play failed", e));
    }

    function setPage(n: number) {
        $pageAtom = n;
    }

    function handleLogoError(e: Event) {
        const target = e.target as HTMLImageElement;
        if (target) {
            target.style.display = "none";
        }
    }
</script>

<main
    class="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col"
>
    <button
        class="pointer-events-auto mt-10 ml-10 bg-transparent border-none p-0 cursor-pointer"
        on:click={() => (window.location.href = "/")}
    >
        <img
            class="w-20"
            src="/vortix_logo.svg"
            alt="Logo"
            on:error={handleLogoError}
        />
    </button>
    <div class="w-full overflow-auto pointer-events-auto flex justify-center">
        <div class="overflow-auto flex items-center gap-4 max-w-full p-10">
            <button
                class={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border bg-black/30 text-white ${
                    $pageAtom === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                on:click={() => $pageAtom > 0 && setPage($pageAtom - 1)}
                disabled={$pageAtom === 0}
            >
                &lt;
            </button>

            {#each Array(pagesCount) as _, index}
                <button
                    class={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                        index === $pageAtom
                            ? "bg-white/90 text-black"
                            : "bg-black/30 text-white"
                    }`}
                    on:click={() => setPage(index)}
                >
                    {index === 0 ? "Cover" : `Page ${index}`}
                </button>
            {/each}

            <button
                class={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border bg-black/30 text-white ${
                    $pageAtom === pagesCount && "opacity-50 cursor-not-allowed"
                }`}
                on:click={() =>
                    $pageAtom < pagesCount && setPage($pageAtom + 1)}
                disabled={$pageAtom === pagesCount}
            >
                &gt;
            </button>
        </div>
    </div>
</main>
