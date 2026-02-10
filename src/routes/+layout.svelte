<script>
    import { page } from "$app/stores";
    import "../app.css";
    import Background from "$lib/components/Background.svelte";
    import CustomCursor from "$lib/components/CustomCursor.svelte";
    import ProgressBar from "$lib/components/ProgressBar.svelte";
    import { isMenuOpen } from "$lib/stores";
    import SplashScreen from "$lib/components/SplashScreen.svelte";
    import BookReader from "$lib/components/BookReader.svelte";

    function toggleMenu() {
        $isMenuOpen = !$isMenuOpen;
    }

    function closeMenu() {
        $isMenuOpen = false;
    }
    import { onMount } from "svelte";

    let lastError = "";

    onMount(() => {
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            lastError = `Error: ${msg} at ${lineNo}:${columnNo}`;
            return false;
        };
        window.onunhandledrejection = function (event) {
            lastError = `Promise Rejection: ${event.reason}`;
        };
    });

    function clearError() {
        lastError = "";
    }
</script>

{#if lastError}
    <div
        class="fixed top-0 left-0 w-full bg-red-900 text-white z-[99999] p-4 text-xs font-mono overflow-auto max-h-40 border-b-2 border-red-500 shadow-xl"
    >
        <div class="flex justify-between items-start">
            <pre>{lastError}</pre>
            <button
                class="bg-black/50 px-2 py-1 rounded ml-4 hover:bg-black"
                on:click={clearError}>X</button
            >
        </div>
        <p class="mt-2 text-red-200">Please take a screenshot of this error.</p>
    </div>
{/if}

<!-- Fixed Overlay Elements (Outside perspective context) -->
<Background />
<SplashScreen />
<CustomCursor />
<BookReader />
<ProgressBar />

<nav
    class="fixed top-0 w-full z-50 p-6 backdrop-blur-md bg-black/40 border-b border-red-900/10 transition-all duration-300"
>
    <!-- Container for width constraint (7xl matches typical max-w for content) -->
    <div class="max-w-7xl mx-auto flex justify-between items-center">
        <a
            href="/"
            class="text-xl font-bold tracking-tighter text-red-500 relative z-50 hover:text-red-400 transition-colors cursor-pointer"
            on:click={closeMenu}
        >
            DZypher
        </a>

        <!-- Desktop Menu -->
        <div class="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" class="hover:text-red-400 transition-colors">Home</a>
            <a href="#programs" class="hover:text-red-400 transition-colors"
                >Programs</a
            >
            <a href="#roadmap" class="hover:text-red-400 transition-colors"
                >Roadmap</a
            >
            <a href="#resources" class="hover:text-red-400 transition-colors"
                >Library</a
            >
            <a href="#gallery" class="hover:text-red-400 transition-colors"
                >Showcase</a
            >
            <a href="#team" class="hover:text-red-400 transition-colors">Team</a
            >
            <a
                href="#fanficx"
                class="hover:text-red-400 transition-colors text-red-500"
                >Fanficx</a
            >
        </div>

        <!-- Mobile Hamburger -->
        <button
            class="md:hidden z-50 text-white focus:outline-none"
            on:click={toggleMenu}
        >
            <i class="fas {$isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl"></i>
        </button>
    </div>
</nav>

<div
    class="min-h-screen relative z-10 overflow-x-hidden text-white selection:bg-red-900 selection:text-white perspective-container"
>
    <!-- Background was here, causing the issue -->

    <div
        class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        {$isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'}"
    >
        <button
            class="absolute top-8 right-8 text-stone-400 hover:text-white transition-colors"
            on:click={closeMenu}
            aria-label="Close Menu"
        >
            <i class="fas fa-times text-3xl"></i>
        </button>

        <a
            href="#"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Home</a
        >
        <a
            href="#programs"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Programs</a
        >
        <a
            href="#roadmap"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Roadmap</a
        >
        <a
            href="#gallery"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Showcase</a
        >
        <a
            href="#resources"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Library</a
        >
        <a
            href="#team"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Team</a
        >
        <a
            href="#fanficx"
            on:click={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-red-500"
            >Fanficx</a
        >
    </div>

    <!-- Main Content Wrapper with Push Effect -->
    <div
        class="relative z-10 font-sans transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top-left pt-24
        {$isMenuOpen
            ? 'transform scale-[0.85] translate-y-[100px] -translate-x-[20px] opacity-50 blur-[1px] rotate-[-5deg]'
            : ''}"
        style="transform-style: preserve-3d;"
    >
        <slot />
    </div>
</div>

<style>
    .perspective-container {
        perspective: 1000px;
        /* overflow-y: auto;  Removed to allow body scroll */
        min-height: 100vh; /* Changed from height: 100vh */
        /* scroll-snap-type: y mandatory; Removed */
        scroll-behavior: smooth;
    }

    /* Hide scrollbar when menu is open to prevent double scroll interactions if desired, 
       but standard behavior usually locks body. Here we just push content. */
</style>
