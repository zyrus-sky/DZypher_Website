<script lang="ts">
    import { T } from "@threlte/core";
    import { pageAtom } from "./store";
    import Page from "./Page.svelte";

    interface PageData {
        front: string;
        back: string;
    }

    export let pages: PageData[] = []; // Array of page data

    let delayedPage: number = $pageAtom; // Initialize with store value

    // Reactive statement to handle delayed page turning
    $: targetPage = $pageAtom;

    let timeout: ReturnType<typeof setTimeout>;

    // Audio for page flip
    const pageFlipAudio = new Audio("/audios/page-flip-01a.mp3");
    pageFlipAudio.volume = 0.4; // Subtle volume

    function playFlipSound() {
        // Reset and play to allow rapid firing
        pageFlipAudio.currentTime = 0;
        pageFlipAudio.play().catch(() => {});
    }

    // We need to continuously update delayedPage until it reaches targetPage
    function updateDelayedPage() {
        if (delayedPage === targetPage) return;

        const diff = Math.abs(targetPage - delayedPage);

        timeout = setTimeout(
            () => {
                if (delayedPage < targetPage) {
                    delayedPage += 1;
                    playFlipSound();
                } else {
                    delayedPage -= 1;
                    playFlipSound();
                }

                if (delayedPage !== targetPage) {
                    updateDelayedPage();
                }
            },
            diff > 2 ? 50 : 150,
        );
    }

    $: if (targetPage !== delayedPage) {
        clearTimeout(timeout);
        updateDelayedPage();
    }
</script>

<T.Group rotation.y={-Math.PI / 2}>
    {#each pages as pageData, index (index)}
        <Page
            {...pageData}
            number={index}
            page={delayedPage}
            opened={delayedPage > index}
            bookClosed={delayedPage === 0 || delayedPage === pages.length}
            totalPages={pages.length}
        />
    {/each}
</T.Group>
