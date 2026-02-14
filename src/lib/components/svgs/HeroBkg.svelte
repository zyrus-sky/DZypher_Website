<script lang="ts">
    import { onMount } from "svelte";

    // HeroBkg.svelte
    // Renders the Hero SVG with dynamic coloring and animations

    let scrollY = $state(0);

    function handleScroll() {
        scrollY = window.scrollY;
    }

    $effect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    // Fade out quickly as user scrolls (0 to 1 opacity)
    // Disappears completely after 400px of scrolling
    let opacity = $derived(Math.max(0, 1 - scrollY / 400) * 0.8);
</script>

<div
    class="hero-bkg-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen z-0"
    style="opacity: {opacity};"
>
    <!-- Removed blur, added dynamic opacity -->
    <svg
        width="1000"
        height="1000"
        viewBox="0 0 142 142"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-[120vw] h-[120vw] md:w-[900px] md:h-[900px] max-w-none max-h-none transition-transform duration-1000"
    >
        <!-- Group for overall rotation -->
        <g class="animate-slow-spin-hero origin-center">
            <path
                class="animate-wobble-1"
                d="M87.6158 60.8848L87.6383 60.9375L87.6725 60.9834L112.924 95.083L70.7672 90.2646L70.7106 90.2578L70.6539 90.2646L28.4957 95.083L53.7486 60.9834L53.7828 60.9375L53.8053 60.8848L70.7106 21.9658L87.6158 60.8848Z"
                stroke="url(#paint0_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-2"
                d="M88.4079 62.3956L88.4257 62.4501L88.4557 62.4988L110.64 98.6695L69.0627 90.1952L69.0069 90.1835L68.9499 90.1853L26.5322 91.311L54.661 59.5421L54.699 59.4994L54.726 59.4488L74.959 22.1514L88.4079 62.3956Z"
                stroke="url(#paint1_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-3"
                d="M89.0653 63.9696L89.0783 64.0254L89.1039 64.0765L108.051 102.043L67.3709 89.9774L67.3163 89.9608L67.2593 89.9577L24.9049 87.3822L55.6955 58.1857L55.7371 58.1465L55.7684 58.0984L79.1751 22.7063L89.0653 63.9696Z"
                stroke="url(#paint2_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-1"
                d="M89.583 65.5949L89.591 65.6517L89.6122 65.7049L105.178 105.178L65.7044 89.613L65.6514 89.5917L65.595 89.5837L23.6262 83.3265L56.8443 56.9247L56.8892 56.8892L56.9245 56.8441L83.3267 23.6267L89.583 65.5949Z"
                stroke="url(#paint3_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-2"
                d="M89.9571 67.259L89.9602 67.3162L89.9766 67.3711L102.043 108.051L64.076 89.1045L64.0252 89.0787L63.9696 89.0657L22.7059 79.1746L58.0986 55.7684L58.1464 55.737L58.1856 55.6951L87.3824 24.9052L89.9571 67.259Z"
                stroke="url(#paint4_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-3"
                d="M90.1847 68.9494L90.1828 69.0067L90.1943 69.0627L98.6693 110.639L62.4982 88.4561L62.4497 88.426L62.3955 88.4082L22.1509 74.9583L59.4489 54.7259L59.4993 54.6988L59.5419 54.6605L91.3112 26.5324L90.1847 68.9494Z"
                stroke="url(#paint5_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-1"
                d="M90.264 70.6534L90.2571 70.7103L90.2638 70.7671L95.0828 112.924L60.9828 87.6728L60.9371 87.6385L60.8847 87.6161L21.9654 70.7099L60.8849 53.8052L60.9374 53.7825L60.9832 53.7481L95.0831 28.4959L90.264 70.6534Z"
                stroke="url(#paint6_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-2"
                d="M90.1946 72.3575L90.1828 72.4136L90.1845 72.4708L91.3109 114.887L59.5414 86.7601L59.499 86.722L59.4486 86.6951L22.151 66.4612L62.3957 53.0129L62.45 52.9949L62.4987 52.9646L98.6696 30.7805L90.1946 72.3575Z"
                stroke="url(#paint7_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-3"
                d="M89.977 74.0494L89.9603 74.1042L89.957 74.1613L87.3823 116.515L58.1852 85.7256L58.1462 85.6839L58.0984 85.6528L22.7062 62.2451L63.9699 52.3555L64.0255 52.3423L64.0766 52.3164L102.043 33.3692L89.977 74.0494Z"
                stroke="url(#paint8_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-1"
                d="M89.6127 75.7164L89.5913 75.7695L89.583 75.8262L83.3267 117.794L56.9242 84.5773L56.889 84.5324L56.8441 84.4972L23.6266 58.0939L65.5952 51.8384L65.6518 51.8301L65.705 51.8087L105.179 36.2427L89.6127 75.7164Z"
                stroke="url(#paint9_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-2"
                d="M89.1045 77.3442L89.0786 77.3953L89.0654 77.451L79.1752 118.714L55.7681 83.3224L55.737 83.2747L55.6953 83.2357L24.9055 54.0378L67.2596 51.4638L67.3167 51.4605L67.3715 51.4438L108.052 39.3774L89.1045 77.3442Z"
                stroke="url(#paint10_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-3"
                d="M88.4564 78.9221L88.4261 78.9707L88.4081 79.0251L74.9593 119.269L54.7259 81.9721L54.699 81.9218L54.6609 81.8793L26.533 50.109L68.9502 51.2363L69.0074 51.238L69.0635 51.2261L110.641 42.7511L88.4564 78.9221Z"
                stroke="url(#paint11_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-1"
                d="M87.6732 80.4378L87.6387 80.4836L87.6161 80.5361L70.7109 119.455L53.8051 80.5364L53.7827 80.4839L53.7485 80.4383L28.4966 46.3374L70.6542 51.1572L70.711 51.1639L70.7679 51.157L112.925 46.3379L87.6732 80.4378Z"
                stroke="url(#paint12_radial_1_92)"
                stroke-width="0.5"
            />
            <path
                class="animate-wobble-2"
                d="M86.7608 81.8791L86.7225 81.9218L86.6953 81.9721L66.4625 119.269L53.013 79.0256L52.9953 78.9713L52.9652 78.9229L30.7814 42.7509L72.3585 51.2267L72.4146 51.2383L72.4718 51.2364L114.889 50.1099L86.7608 81.8791Z"
                stroke="url(#paint13_radial_1_92)"
                stroke-width="0.5"
            />
        </g>

        <defs>
            {#each Array(14) as _, i}
                <radialGradient
                    id="paint{i}_radial_1_92"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate({91.7513 + i * 4} {1.38289 +
                        i * 4}) rotate({100 + i * 5}) scale(142.128)"
                >
                    <stop offset="0" stop-color="var(--color-primary-400)" />
                    <stop
                        offset="0.25"
                        stop-color="var(--color-secondary-400)"
                    />
                    <stop offset="0.5" stop-color="var(--color-tertiary-400)" />
                    <stop offset="0.75" stop-color="var(--color-primary-600)" />
                    <stop offset="1" stop-color="var(--color-secondary-600)" />
                </radialGradient>
            {/each}
        </defs>
    </svg>
</div>

<style>
    @keyframes slow-spin-hero {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes wobble-1 {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(2px, -2px) scale(1.02);
        }
        66% {
            transform: translate(-1px, 1px) scale(0.98);
        }
    }
    @keyframes wobble-2 {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(-2px, 2px) scale(1.02);
        }
        66% {
            transform: translate(1px, -1px) scale(0.98);
        }
    }
    @keyframes wobble-3 {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        50% {
            transform: translate(3px, 0px) scale(1.05);
        }
    }

    .animate-slow-spin-hero {
        animation: slow-spin-hero 120s linear infinite;
        transform-box: fill-box;
        transform-origin: center;
    }

    .animate-wobble-1 {
        animation: wobble-1 8s ease-in-out infinite;
        transform-box: fill-box;
        transform-origin: center;
    }
    .animate-wobble-2 {
        animation: wobble-2 9s ease-in-out infinite reverse;
        transform-box: fill-box;
        transform-origin: center;
    }
    .animate-wobble-3 {
        animation: wobble-3 10s ease-in-out infinite;
        transform-box: fill-box;
        transform-origin: center;
    }
</style>
