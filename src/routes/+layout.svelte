<script lang="ts">
    import { page } from "$app/stores";
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
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
    let scrolled = $state(false);

    function handleScroll() {
        scrolled = window.scrollY > 250;
    }

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

    let innerWidth = $state(0);
    let scrollY = $state(0);
    let lastScrollY = 0;
    let headerProgress = $state(0);

    // Easing: cubic-bezier(0.19,1,0.22,1) approx via code or just smoothstep
    // Let's use a simple ease-out for the scrub
    let easedProgress = $derived(1 - Math.pow(1 - headerProgress, 3));

    // Calculate width: Start at innerWidth (minus padding), End at 500px
    // safeWidth ensures we don't break SSR (default to 1000 or handle via onMount)
    let targetWidth = $derived(Math.min(500, innerWidth - 32));
    let currentWidth = $derived(
        browser
            ? innerWidth - (innerWidth - targetWidth) * easedProgress
            : 1200,
    );

    $effect(() => {
        // Only run logic if browser is available
        if (!browser) return;

        // Force expanded state at the very top
        if (scrollY < 50) {
            headerProgress = 0;
            scrolled = false;
            lastScrollY = scrollY;
            return;
        }

        scrolled = true;
        const delta = scrollY - lastScrollY;
        const range = 400; // Total scroll distance to complete animation
        const change = delta / range;

        // Update progress based on direction:
        // Scroll Down (+) -> Increase Progress -> Converge
        // Scroll Up (-) -> Decrease Progress -> Diverge
        headerProgress = Math.min(1, Math.max(0, headerProgress + change));

        lastScrollY = scrollY;
    });
</script>

<svelte:window bind:scrollY bind:innerWidth />

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

<!-- Dynamic Header -->
<nav
    class="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none transition-all duration-500"
    class:pt-8={scrollY < 50}
    class:pt-4={scrollY >= 50}
>
    <!-- 
        WIDTH is now driven directly by SCROLL (Scrubbing).
        This removes "timing" and relies on "distance". 
    -->
    <div
        class="flex items-center gap-16 pointer-events-auto transition-colors duration-500"
        style="width: {currentWidth}px;"
        class:bg-black_40={scrolled}
        class:backdrop-blur-xl={scrolled}
        class:shadow-lg={scrolled}
        class:rounded-full={true}
        class:px-6={scrolled}
        class:py-2={scrolled}
        class:px-10={!scrolled}
        class:py-6={!scrolled}
        class:justify-between={true}
        class:bg-transparent={!scrolled}
    >
        <Magnetic>
            <a
                href="/"
                class="block relative z-50 transition-transform duration-300 hover:scale-105"
                onclick={closeMenu}
            >
                <img
                    src={$themeStore?.logo === "VORTIX"
                        ? "/assets/Vortix_text.svg"
                        : "/assets/DZypher_extend.svg"}
                    alt="Logo"
                    class="h-8 w-auto object-contain transition-all duration-500"
                    class:h-6={scrolled}
                />
            </a>
        </Magnetic>

        <Magnetic>
            <a
                href="/events"
                class="btn-glass px-6 py-2 group hover:bg-white/20"
            >
                <span
                    class="text-xs font-bold tracking-wider uppercase text-center"
                    >View<br />Events</span
                >
            </a>
        </Magnetic>
    </div>
</nav>

<div
    class="min-h-screen relative z-10 text-white selection:bg-primary-900 selection:text-white perspective-container"
    style={$isMenuOpen ? "perspective: 1000px;" : "perspective: none;"}
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
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-white"
            >Home</a
        >
        <a
            href="/#programs"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-white"
            >Programs</a
        >
        <a
            href="/#roadmap"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-white"
            >Roadmap</a
        >
        <a
            href="/#gallery"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-white"
            >Showcase</a
        >
        <a
            href="/#resources"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-white"
            >Library</a
        >
        <a
            href="/#team"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-white"
            >Team</a
        >
        <a
            href="/#fanficx"
            onclick={closeMenu}
            class="text-3xl font-bold hover:text-primary-500 transition-colors text-primary-500"
            >Fanficx</a
        >
    </div>

    <!-- Main Content Wrapper with Push Effect -->
    <div
        class="relative z-10 font-sans transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top-left pt-24
        {$isMenuOpen
            ? 'transform scale-[0.85] translate-y-[100px] -translate-x-[20px] opacity-50 blur-[1px] rotate-[-5deg]'
            : ''}"
        style={$isMenuOpen ? "transform-style: preserve-3d;" : ""}
    >
        {#key $page.url.pathname}
            <div
                in:fly={{ y: 20, duration: 600, delay: 300, easing: cubicOut }}
                out:fly={{ y: -20, duration: 300, easing: cubicOut }}
            >
                {@render children()}
            </div>
        {/key}
    </div>
</div>

<style>
    .perspective-container {
        /* perspective: 1000px;  Moved to inline style for conditional application */
        /* overflow-y: auto;  Removed to allow body scroll */
        min-height: 100vh; /* Changed from height: 100vh */
        /* scroll-snap-type: y mandatory; Removed */
        scroll-behavior: smooth;
    }

    /* Hide scrollbar when menu is open to prevent double scroll interactions if desired, 
       but standard behavior usually locks body. Here we just push content. */
</style>
