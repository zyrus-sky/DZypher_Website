<script lang="ts">
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
    import { initTheme, loadThemeFromStorage, themeStore } from "$lib/stores";
    import ThemeManager from "$lib/components/ThemeManager.svelte";
    import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
    import ScrollProgress from "$lib/components/ScrollProgress.svelte";
    import Magnetic from "$lib/components/Magnetic.svelte";
    import CommandPalette from "$lib/components/CommandPalette.svelte";
    import AudioPlayer from "$lib/components/AudioPlayer.svelte";
    import { browser } from "$app/environment";
    import Lenis from "lenis";

    // Immediate synchronous theme loading from storage to prevent flash of wrong theme
    if (browser) {
        loadThemeFromStorage();
    }

    let lastError = $state("");

    let activeSection = $state("");

    // Svelte 5: Use $effect instead of onMount
    $effect(() => {
        initTheme(); // Fetch fresh theme

        // Lenis Smooth Scroll
        if (browser) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
            });

            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            // Scrollspy
            const sections = [
                "home",
                "programs",
                "roadmap",
                "resources",
                "gallery",
                "team",
                "fanficx",
            ];
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            activeSection = entry.target.id;
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: "-40% 0px -40% 0px",
                },
            );

            // Delay to ensure elements are mounted
            setTimeout(() => {
                sections.forEach((id) => {
                    const el = document.getElementById(id);
                    if (el) observer.observe(el);
                });
            }, 500);

            return () => observer.disconnect();
        }

        window.onerror = function (msg, url, lineNo, columnNo, error) {
            lastError = `Error: ${msg} at ${lineNo}:${columnNo}`;
            return false;
        };
        window.onunhandledrejection = function (event) {
            lastError = `Promise Rejection: ${event.reason}`;
        };
    });

    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Footer from "$lib/components/Footer.svelte";

    function clearError() {
        lastError = "";
    }
</script>

<!-- Fixed Overlay Elements (Outside perspective context) -->
<ThemeManager />
<ThemeSwitcher />
<ScrollProgress />
<CommandPalette />
<AudioPlayer />
<Background />
<SplashScreen />
<CustomCursor />
<BookReader />
<ProgressBar />

<nav
    class="fixed top-0 w-full z-50 p-6 backdrop-blur-md bg-black/40 transition-all duration-300"
>
    <!-- Container for width constraint (7xl matches typical max-w for content) -->
    <div class="max-w-7xl mx-auto flex justify-between items-center">
        <Magnetic>
            <a
                href="/"
                class="text-xl font-bold tracking-tighter text-red-500 relative z-50 hover:text-red-400 transition-colors cursor-pointer block"
                onclick={closeMenu}
            >
                {$themeStore?.logo || "DZypher"}
            </a>
        </Magnetic>

        <!-- Desktop Menu -->
        <div class="hidden md:flex gap-6 text-sm font-medium items-center">
            <Magnetic>
                <a
                    href="/"
                    class="transition-colors py-2 px-1 block {activeSection ===
                        'home' ||
                    (!$page.url.hash && $page.url.pathname === '/')
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Home</a
                >
            </Magnetic>
            <Magnetic>
                <a
                    href="/#programs"
                    class="transition-colors py-2 px-1 block {activeSection ===
                        'programs' || $page.url.pathname === '/events'
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Programs</a
                >
            </Magnetic>
            <Magnetic>
                <a
                    href="/#roadmap"
                    class="transition-colors py-2 px-1 block {activeSection ===
                    'roadmap'
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Roadmap</a
                >
            </Magnetic>
            <Magnetic>
                <a
                    href="/#resources"
                    class="transition-colors py-2 px-1 block {activeSection ===
                    'resources'
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Library</a
                >
            </Magnetic>
            <Magnetic>
                <a
                    href="/#gallery"
                    class="transition-colors py-2 px-1 block {activeSection ===
                    'gallery'
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Showcase</a
                >
            </Magnetic>
            <Magnetic>
                <a
                    href="/#team"
                    class="transition-colors py-2 px-1 block {activeSection ===
                    'team'
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Team</a
                >
            </Magnetic>
            <Magnetic>
                <a
                    href="/#fanficx"
                    class="transition-colors py-2 px-1 block {activeSection ===
                    'fanficx'
                        ? 'text-primary-500 font-bold'
                        : 'text-stone-300 hover:text-primary-400'}">Fanficx</a
                >
            </Magnetic>
        </div>
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
            onclick={closeMenu}
            aria-label="Close Menu"
        >
            <i class="fas fa-times text-3xl"></i>
        </button>

        <a
            href="/"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Home</a
        >
        <a
            href="/#programs"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Programs</a
        >
        <a
            href="/#roadmap"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Roadmap</a
        >
        <a
            href="/#gallery"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Showcase</a
        >
        <a
            href="/#resources"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Library</a
        >
        <a
            href="/#team"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-red-500 transition-colors text-white"
            >Team</a
        >
        <a
            href="/#fanficx"
            onclick={closeMenu}
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
        {#key $page.url.pathname}
            <div
                in:fly={{ y: 20, duration: 600, delay: 300, easing: cubicOut }}
                out:fly={{ y: -20, duration: 300, easing: cubicOut }}
            >
                <slot />
            </div>
        {/key}
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
