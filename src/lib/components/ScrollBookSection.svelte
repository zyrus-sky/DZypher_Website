<script lang="ts">
    import BookScene from "./ThreeBook/BookScene.svelte";
    import Portal from "./Portal.svelte";
    import { pageAtom } from "./ThreeBook/store";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import Marquee from "./Marquee.svelte";

    let container: HTMLDivElement;
    let sceneWrapper: HTMLDivElement;
    let rafId: number;

    const totalPages = 6;
    const marqueeText =
        "Cyber Security Workshop • iot workshop • Cloud computing and ai • AI & entrepreneurship • Vibe Coding-workshop • Deep Learning Workshop • Keyboard Mastery • Clutch: Gaming events • Fanfic’x • ideathon-sl • Phantasm: VR Games • Research’X • LAN PARTY • ideathon-cl";

    function update() {
        if (!container || !sceneWrapper) {
            rafId = requestAnimationFrame(update);
            return;
        }

        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollDistance = rect.height - viewportHeight;

        // --- Position Sync Logic ---
        const y = Math.min(Math.max(rect.top, 0), rect.bottom - viewportHeight);

        // Apply transform directly to the fixed wrapper
        sceneWrapper.style.transform = `translate3d(0, ${y}px, 0)`;

        // --- Page Turn Logic ---
        const currentScroll = -rect.top;
        const progress = Math.max(
            0,
            Math.min(1, currentScroll / scrollDistance),
        );
        const targetPage = Math.round(progress * (totalPages - 1));

        if ($pageAtom !== targetPage) {
            $pageAtom = targetPage;
        }

        rafId = requestAnimationFrame(update);
    }

    onMount(() => {
        if (browser) {
            rafId = requestAnimationFrame(update);
        }
    });

    onDestroy(() => {
        if (browser && rafId) {
            cancelAnimationFrame(rafId);
        }
    });
</script>

<!-- The track that defines the scroll length -->
<div bind:this={container} class="relative w-full h-[400vh]"></div>

<!-- The Book (Portaled to Body to avoid layout clipping/transforms) -->
<Portal>
    <div
        bind:this={sceneWrapper}
        class="fixed top-0 left-0 w-full h-screen z-40 pointer-events-none will-change-transform"
        style="transform: translate3d(0, 100vh, 0);"
    >
        <!-- Background Cross Marquee -->
        <div
            class="absolute inset-0 flex items-center justify-center -z-10 opacity-10 overflow-hidden pointer-events-none"
        >
            <!-- Marquee 1 (Rotated +) -->
            <div
                class="absolute w-[150vw] rotate-12 scale-110 origin-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <Marquee text={marqueeText} speed={250} direction="left">
                    {#snippet children()}
                        <span
                            class="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase tracking-widest px-8"
                        >
                            {marqueeText}
                        </span>
                    {/snippet}
                </Marquee>
            </div>

            <!-- Marquee 2 (Rotated -) -->
            <div
                class="absolute w-[150vw] -rotate-12 scale-110 origin-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <Marquee text={marqueeText} speed={300} direction="right">
                    {#snippet children()}
                        <span
                            class="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase tracking-widest px-8"
                        >
                            {marqueeText}
                        </span>
                    {/snippet}
                </Marquee>
            </div>
        </div>

        <!-- Initial transform off-screen (100vh) until RAF loop starts to avoid flash -->

        <div class="w-full h-full pointer-events-auto">
            <BookScene embedded={true} />
        </div>

        <div
            class="absolute bottom-10 left-10 text-white/50 text-sm font-mono pointer-events-none z-10"
        >
            SCROLL TO READ
        </div>
    </div>
</Portal>
