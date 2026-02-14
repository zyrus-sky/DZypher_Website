<script lang="ts">
    import { isMenuOpen, themeStore } from "$lib/stores";
    import { spring } from "svelte/motion";

    // Svelte 5: Props using $props()
    let { className = "" }: { className?: string } = $props();

    import { onMount, onDestroy } from "svelte";

    // Tilt State
    let rotateX = spring(0, { stiffness: 0.1, damping: 0.3 });
    let rotateY = spring(0, { stiffness: 0.1, damping: 0.3 });

    let animationFrame: number;
    let isMobile = false;

    function handleMouseMove(e: MouseEvent) {
        if (isMobile) return; // Disable mouse interaction if in mobile mode (though unlikely to fire)
        const target = e.currentTarget as HTMLElement;
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const limit = 15; // Max rotation degrees

        rotateY.set(((x - centerX) / centerX) * limit);
        rotateX.set(-((y - centerY) / centerY) * limit);
    }

    function handleMouseLeave() {
        if (isMobile) return;
        rotateX.set(0);
        rotateY.set(0);
    }

    function autoAnimate(time: number) {
        // Gentle Sway
        const swaySpeed = 0.002;
        const swayAmount = 8;

        rotateX.set(Math.sin(time * swaySpeed) * swayAmount);
        rotateY.set(Math.cos(time * swaySpeed * 0.7) * swayAmount);

        animationFrame = requestAnimationFrame(autoAnimate);
    }

    onMount(() => {
        const mediaQuery = window.matchMedia("(hover: none)");
        isMobile = mediaQuery.matches;

        if (isMobile) {
            animationFrame = requestAnimationFrame(autoAnimate);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    });
</script>

<div
    class={`relative ${className} {$isMenuOpen ? 'logo-particle-mode' : ''} ${isMobile ? "logo-mobile-mode" : ""} transition-transform duration-100 ease-out perspective-container group`}
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    role="img"
>
    <!-- 3D Container -->
    <div
        class="relative w-full h-full transform-style-3d"
        style="transform: rotateX({$rotateX}deg) rotateY({$rotateY}deg);"
    >
        {#if $isMenuOpen}
            <!-- Particle Effects Layer (only visible when menu is open) -->
            <div class="absolute inset-0 z-0 pointer-events-none">
                {#each Array(20) as _, i}
                    <div
                        class="absolute w-1 h-1 bg-primary-500 rounded-full animate-particle"
                        style="
                            left: {50 + (Math.random() * 40 - 20)}%; 
                            top: {50 + (Math.random() * 40 - 20)}%;
                            animation-delay: {Math.random() * 2}s;
                            animation-duration: {1 + Math.random() * 2}s;
                        "
                    ></div>
                {/each}
            </div>
        {/if}

        {#if $themeStore?.logo?.includes("VORTIX")}
            <!-- VORTIX Logo SVG -->
            <div class="relative group">
                <svg
                    width="322"
                    height="279"
                    viewBox="0 0 322 279"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-full h-auto drop-shadow-neon relative z-10"
                >
                    <g opacity="0.4">
                        <g filter="url(#filter0_n_755_880)">
                            <path
                                d="M302.433 145.774C302.433 145.774 254.868 78.5936 166.001 42.7949L166.001 79.9102C189.187 96.3301 210.084 116.989 228.023 144.317L243.42 112.066L302.433 145.774Z"
                                fill="#E80A89"
                            />
                        </g>
                    </g>
                    <g opacity="0.4" filter="url(#filter1_n_755_880)">
                        <path
                            d="M276.302 40.7829L168.512 269.86L182.963 228.662L168.512 201.82L267.887 0L276.302 40.7829Z"
                            fill="#E80A89"
                        />
                    </g>
                    <g opacity="0.4" filter="url(#filter2_n_755_880)">
                        <path
                            d="M166.058 79.5523C238.164 27.5976 321.406 22.3463 321.406 22.3463C260.466 14.7387 208.431 25.2214 166 42.7656L166.058 79.5523Z"
                            fill="#E80A89"
                        />
                    </g>
                    <g opacity="0.4" filter="url(#filter3_n_755_880)">
                        <path
                            d="M43.2704 40.7829L151.06 269.86L136.609 228.662L151.061 201.82L51.6854 0L43.2704 40.7829Z"
                            fill="#3EC7EF"
                        />
                    </g>
                    <g opacity="0.4" filter="url(#filter4_n_755_880)">
                        <path
                            d="M155.347 79.4751C83.2413 27.5204 -0.000228882 22.2692 -0.000228882 22.2692C60.9393 14.6616 112.975 25.1443 155.405 42.6885L155.347 79.4751Z"
                            fill="#3EC7EF"
                        />
                    </g>
                    <g opacity="0.4" filter="url(#filter5_n_755_880)">
                        <path
                            d="M19.1398 145.812C19.1398 145.812 66.7047 78.6317 155.571 42.833L155.571 79.9482C132.386 96.3682 111.488 117.027 93.5493 144.355L78.1519 112.104L19.1398 145.812Z"
                            fill="#3EC7EF"
                        />
                    </g>
                    <g filter="url(#filter6_d_755_880)">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M112.017 171.527L116.788 181.873L116.535 194.542L111.762 184.191L112.017 171.527ZM105.674 157.77L110.447 168.121L110.191 180.785L105.421 170.439L105.674 157.77ZM97.9147 140.918L104.101 154.359L103.845 167.023L102.432 154.359L97.9147 144.159V140.918ZM126.29 215.698L118.247 198.255L118.549 183.316L64.9024 67.3688L64.89 64.1337L126.357 197.436L126.29 215.698ZM58.0998 49.4196L63.2458 60.5795L63.2717 63.8083L58.1258 52.6486L58.0998 49.4196ZM51.3065 34.687L56.4574 45.8576L56.4784 49.076L51.3328 37.9164L51.3065 34.687ZM44.7657 21.6572L49.8231 31.4704L49.8494 34.6994L44.7657 25.546L12.358 22.3054L44.7657 21.6572ZM47.3584 32.0278L97.0945 139.235L97.1094 143.214L47.3734 36.0067L47.3659 34.0172L47.3584 32.0278ZM47.3457 41.8838L102.432 160.91L102.442 162.905L102.452 164.9L47.3584 45.8576L47.3521 43.8707L47.3457 41.8838ZM129.077 209.172L134.576 221.097L134.532 225.926L149.119 265.364L144.381 254.931L129.035 221.652L129.077 209.172Z"
                            fill="white"
                            fill-opacity="0.67"
                            shape-rendering="crispEdges"
                        />
                    </g>
                    <g filter="url(#filter7_d_755_880)">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M207.555 171.527L202.784 181.873L203.037 194.542L207.811 184.191L207.555 171.527ZM213.898 157.77L209.125 168.121L209.381 180.785L214.152 170.439L213.898 157.77ZM221.658 140.918L215.471 154.359L215.727 167.023L217.141 154.359L221.658 144.159V140.918ZM193.283 215.698L201.325 198.255L201.024 183.316L254.67 67.3688L254.682 64.1337L193.216 197.436L193.283 215.698ZM261.472 49.4196L256.326 60.5795L256.301 63.8083L261.446 52.6486L261.472 49.4196ZM268.266 34.687L263.115 45.8576L263.094 49.076L268.24 37.9164L268.266 34.687ZM274.807 21.6572L269.749 31.4704L269.723 34.6994L274.807 25.546L307.214 22.3054L274.807 21.6572ZM272.214 32.0278L222.478 139.235L222.463 143.214L272.199 36.0067L272.206 34.0172L272.214 32.0278ZM272.227 41.8838L217.141 160.91L217.131 162.905L217.121 164.9L272.214 45.8576L272.22 43.8707L272.227 41.8838ZM190.495 209.172L184.996 221.097L185.04 225.926L170.453 265.364L175.191 254.931L190.537 221.652L190.495 209.172Z"
                            fill="white"
                            fill-opacity="0.67"
                            shape-rendering="crispEdges"
                        />
                    </g>
                    <defs>
                        <filter
                            id="filter0_n_755_880"
                            x="166.001"
                            y="42.7949"
                            width="136.432"
                            height="102.979"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.22966468334198 1.22966468334198"
                                stitchTiles="stitch"
                                numOctaves="3"
                                result="noise"
                                seed="2128"
                            />
                            <feColorMatrix
                                in="noise"
                                type="luminanceToAlpha"
                                result="alphaNoise"
                            />
                            <feComponentTransfer
                                in="alphaNoise"
                                result="coloredNoise1"
                            >
                                <feFuncA
                                    type="discrete"
                                    tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                                />
                            </feComponentTransfer>
                            <feComposite
                                operator="in"
                                in2="shape"
                                in="coloredNoise1"
                                result="noise1Clipped"
                            />
                            <feFlood
                                flood-color="rgba(0, 0, 0, 0.25)"
                                result="color1Flood"
                            />
                            <feComposite
                                operator="in"
                                in2="noise1Clipped"
                                in="color1Flood"
                                result="color1"
                            />
                            <feMerge result="effect1_noise_755_880">
                                <feMergeNode in="shape" />
                                <feMergeNode in="color1" />
                            </feMerge>
                        </filter>
                        <filter
                            id="filter1_n_755_880"
                            x="168.512"
                            y="0"
                            width="107.79"
                            height="269.86"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.22966468334198 1.22966468334198"
                                stitchTiles="stitch"
                                numOctaves="3"
                                result="noise"
                                seed="8515"
                            />
                            <feColorMatrix
                                in="noise"
                                type="luminanceToAlpha"
                                result="alphaNoise"
                            />
                            <feComponentTransfer
                                in="alphaNoise"
                                result="coloredNoise1"
                            >
                                <feFuncA
                                    type="discrete"
                                    tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                                />
                            </feComponentTransfer>
                            <feComposite
                                operator="in"
                                in2="shape"
                                in="coloredNoise1"
                                result="noise1Clipped"
                            />
                            <feFlood
                                flood-color="rgba(0, 0, 0, 0.25)"
                                result="color1Flood"
                            />
                            <feComposite
                                operator="in"
                                in2="noise1Clipped"
                                in="color1Flood"
                                result="color1"
                            />
                            <feMerge result="effect1_noise_755_880">
                                <feMergeNode in="shape" />
                                <feMergeNode in="color1" />
                            </feMerge>
                        </filter>
                        <filter
                            id="filter2_n_755_880"
                            x="166"
                            y="19.833"
                            width="155.405"
                            height="59.7197"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.22966468334198 1.22966468334198"
                                stitchTiles="stitch"
                                numOctaves="3"
                                result="noise"
                                seed="2128"
                            />
                            <feColorMatrix
                                in="noise"
                                type="luminanceToAlpha"
                                result="alphaNoise"
                            />
                            <feComponentTransfer
                                in="alphaNoise"
                                result="coloredNoise1"
                            >
                                <feFuncA
                                    type="discrete"
                                    tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                                />
                            </feComponentTransfer>
                            <feComposite
                                operator="in"
                                in2="shape"
                                in="coloredNoise1"
                                result="noise1Clipped"
                            />
                            <feFlood
                                flood-color="rgba(0, 0, 0, 0.25)"
                                result="color1Flood"
                            />
                            <feComposite
                                operator="in"
                                in2="noise1Clipped"
                                in="color1Flood"
                                result="color1"
                            />
                            <feMerge result="effect1_noise_755_880">
                                <feMergeNode in="shape" />
                                <feMergeNode in="color1" />
                            </feMerge>
                        </filter>
                        <filter
                            id="filter3_n_755_880"
                            x="43.2705"
                            y="0"
                            width="107.79"
                            height="269.86"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.22966468334198 1.22966468334198"
                                stitchTiles="stitch"
                                numOctaves="3"
                                result="noise"
                                seed="2128"
                            />
                            <feColorMatrix
                                in="noise"
                                type="luminanceToAlpha"
                                result="alphaNoise"
                            />
                            <feComponentTransfer
                                in="alphaNoise"
                                result="coloredNoise1"
                            >
                                <feFuncA
                                    type="discrete"
                                    tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                                />
                            </feComponentTransfer>
                            <feComposite
                                operator="in"
                                in2="shape"
                                in="coloredNoise1"
                                result="noise1Clipped"
                            />
                            <feFlood
                                flood-color="rgba(0, 0, 0, 0.25)"
                                result="color1Flood"
                            />
                            <feComposite
                                operator="in"
                                in2="noise1Clipped"
                                in="color1Flood"
                                result="color1"
                            />
                            <feMerge result="effect1_noise_755_880">
                                <feMergeNode in="shape" />
                                <feMergeNode in="color1" />
                            </feMerge>
                        </filter>
                        <filter
                            id="filter4_n_755_880"
                            x="0"
                            y="19.7559"
                            width="155.405"
                            height="59.7197"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.22966468334198 1.22966468334198"
                                stitchTiles="stitch"
                                numOctaves="3"
                                result="noise"
                                seed="2128"
                            />
                            <feColorMatrix
                                in="noise"
                                type="luminanceToAlpha"
                                result="alphaNoise"
                            />
                            <feComponentTransfer
                                in="alphaNoise"
                                result="coloredNoise1"
                            >
                                <feFuncA
                                    type="discrete"
                                    tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                                />
                            </feComponentTransfer>
                            <feComposite
                                operator="in"
                                in2="shape"
                                in="coloredNoise1"
                                result="noise1Clipped"
                            />
                            <feFlood
                                flood-color="rgba(0, 0, 0, 0.25)"
                                result="color1Flood"
                            />
                            <feComposite
                                operator="in"
                                in2="noise1Clipped"
                                in="color1Flood"
                                result="color1"
                            />
                            <feMerge result="effect1_noise_755_880">
                                <feMergeNode in="shape" />
                                <feMergeNode in="color1" />
                            </feMerge>
                        </filter>
                        <filter
                            id="filter5_n_755_880"
                            x="19.1396"
                            y="42.833"
                            width="136.432"
                            height="102.979"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="1.22966468334198 1.22966468334198"
                                stitchTiles="stitch"
                                numOctaves="3"
                                result="noise"
                                seed="2128"
                            />
                            <feColorMatrix
                                in="noise"
                                type="luminanceToAlpha"
                                result="alphaNoise"
                            />
                            <feComponentTransfer
                                in="alphaNoise"
                                result="coloredNoise1"
                            >
                                <feFuncA
                                    type="discrete"
                                    tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
                                />
                            </feComponentTransfer>
                            <feComposite
                                operator="in"
                                in2="shape"
                                in="coloredNoise1"
                                result="noise1Clipped"
                            />
                            <feFlood
                                flood-color="rgba(0, 0, 0, 0.25)"
                                result="color1Flood"
                            />
                            <feComposite
                                operator="in"
                                in2="noise1Clipped"
                                in="color1Flood"
                                result="color1"
                            />
                            <feMerge result="effect1_noise_755_880">
                                <feMergeNode in="shape" />
                                <feMergeNode in="color1" />
                            </feMerge>
                        </filter>
                        <filter
                            id="filter6_d_755_880"
                            x="5.85256"
                            y="21.6572"
                            width="149.772"
                            height="256.719"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dy="6.50584" />
                            <feGaussianBlur stdDeviation="3.25292" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0"
                            />
                            <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_755_880"
                            />
                            <feBlend
                                mode="normal"
                                in="BackgroundImageFix"
                                in2="effect1_dropShadow_755_880"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                        </filter>
                        <filter
                            id="filter7_d_755_880"
                            x="163.947"
                            y="21.6572"
                            width="149.772"
                            height="256.719"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                            />
                            <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                            />
                            <feOffset dy="6.50584" />
                            <feGaussianBlur stdDeviation="3.25292" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0"
                            />
                            <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_755_880"
                            />
                            <feBlend
                                mode="normal"
                                in="BackgroundImageFix"
                                in2="effect1_dropShadow_755_880"
                                result="BackgroundImageFix"
                            />
                            <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                            />
                        </filter>
                    </defs>
                </svg>
            </div>
        {:else}
            <!-- DZypher Logo SVG (Defaults) -->
            <svg
                class="w-full h-auto drop-shadow-red animate-pulse-slow relative z-10"
                viewBox="0 0 6144 3868"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- DZypher SVG paths preserved from original -->
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2945.21 3700.28H2814.72V3680.18L2919.3 3531.78L2918.34 3528.9H2818.54V3510.39H2944.56V3530.51L2839.98 3679.21L2840.93 3681.78H2945.21V3700.28Z"
                    fill="url(#paint0_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3203.93 3700.28H3181.8V3625.93L3115.76 3510.39H3140.45L3191.75 3599.43H3194.96L3245.94 3510.39H3269.97L3203.93 3625.93V3700.28Z"
                    fill="url(#paint1_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3527.15 3510.39C3539.96 3510.39 3551.02 3512.79 3560.35 3517.42C3569.6 3522.13 3576.64 3528.83 3581.54 3537.52C3586.36 3546.29 3588.8 3556.51 3588.8 3568.16C3588.8 3580.13 3586.36 3590.43 3581.54 3599.12C3576.64 3607.65 3569.6 3614.28 3560.35 3618.91C3551.02 3623.61 3539.96 3625.93 3527.15 3625.93H3481.93V3700.28H3459.79V3510.39H3527.15ZM3526.52 3607.1C3552.61 3607.1 3565.73 3594.16 3565.73 3568.16C3565.73 3542.46 3552.61 3529.54 3526.52 3529.54H3481.93V3607.1H3526.52Z"
                    fill="url(#paint2_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3909.18 3587.62V3510.39H3931.37V3700.28H3909.18V3606.46H3811.22V3700.28H3789.02V3510.39H3811.22V3587.62H3909.18Z"
                    fill="url(#paint3_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4167.2 3610.93V3681.78H4263.57V3700.28H4144.94V3510.39H4261.34V3528.9H4167.2V3592.41H4250.21V3610.93H4167.2Z"
                    fill="url(#paint4_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3629.76 2398.84L6142.04 0H3829.59L3315.69 385.571H5085.75L3629.76 2398.84Z"
                    fill="url(#paint5_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1301.96 2479.45C1358.19 2452.63 1376.93 2429.71 1490.12 2351.37C1573.16 2586.46 1617.33 2775.55 1593.65 3004.33L1555.84 3068.02C1555.84 3068.02 1517.88 3194.85 1472.09 3333.45C1530.16 2896.07 1301.96 2479.45 1301.96 2479.45Z"
                    fill="url(#paint6_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4373.63 2393.01L5846.17 385.713L3314.21 2773.74L5626.46 2784.55L6143.52 2401.21L4373.63 2393.01Z"
                    fill="url(#paint7_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1490.28 2352.39C1410.32 2452.75 1451.86 2429.28 1302.61 2480.43C1215.18 2247.11 1194.5 2112.15 1213.59 1883.04L1250.03 1818.67C1250.03 1818.67 1285.51 1691.1 1328.47 1551.75C1279.06 1990 1490.28 2352.39 1490.28 2352.39Z"
                    fill="url(#paint8_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1863.4 507.8C2439.77 507.8 2890.15 655.214 3296.99 860.91C3551.37 991.016 3726.44 1153.88 3726.44 1153.88C3726.44 1153.88 3645.43 1506.89 3268.76 2025.23C2971.17 2405.47 2733.69 2591.81 2449.32 2805.32C1965.2 3152.76 1567.74 3302.15 1567.74 3302.15C1567.74 3302.15 1548.79 3316.15 1886 3067.64C2144.34 2864.56 2157.24 2840.42 2157.24 2840.42C2157.24 2840.42 2181.99 2761.04 2202.75 2687.31C2879.01 2210.05 3106.86 1381.06 3106.86 1381.06C2379.52 758.185 1441.52 787.316L1403.87 682.531C1403.87 682.531 1262.68 661.411 933.115 671.135C1405.86 490.615 1863.4 507.8 1863.4 507.8ZM1120.62 957.578C2055.53 949.448 2605.14 1598.87 2605.14 1598.87C2605.14 1598.87 2513 2033.35 2190.27 2400.86C2236.44 2013.11 2231.02 1724.69 2231.02 1724.69C2231.02 1724.69 1771.64 1235.59 1120.62 1247.68C510.509 1251.82 134.938 1649.59 134.938 1649.59C134.938 1649.59 377.441 1288.28 762.402 1073.29C762.402 1073.29 725.155 1022.56 682.655 1004.32C682.496 1004.25 882.977 961.553 1120.62 957.578Z"
                    fill="url(#paint9_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4103.69 2618.31L5588.58 594.889L3035.43 3002.11L5367.1 3013.01L5888.46 2626.6L4103.69 2618.31Z"
                    fill="url(#paint10_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2461.63 3607.8C2461.63 3609.16 2461.63 3610.42 2461.63 3611.71C2461.63 3648.21 2476.43 3681.44 2500.29 3705.4C2524.22 3729.47 2557.19 3744.38 2593.56 3744.38H2725.51V3678.15C2656.1 3614.41 2546.81 3586.12 2436.35 3607.56C2444.83 3607.32 2453.31 3607.49 2461.63 3607.8ZM2664.33 3688.51H2593.56C2572.57 3688.51 2553.47 3679.9 2539.6 3665.97C2526.36 3652.64 2517.97 3634.57 2517.17 3614.65C2574.54 3626.3 2625.98 3651.8 2664.33 3688.51Z"
                    fill="url(#paint11_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4372.97 3611C4372.97 3611 4554.15 3623.98 4648.24 3762.19H4743.69C4743.69 3762.19 4611.58 3582.28 4372.97 3611Z"
                    fill="url(#paint12_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2343.54 3616.09C2343.54 3483.75 2445.87 3375.33 2575.74 3365.41C2569.22 3364.86 2562.76 3364.61 2556.17 3364.61C2417.13 3364.61 2304.38 3477.23 2304.38 3616.09C2304.38 3754.95 2417.13 3867.52 2556.17 3867.52C2562.76 3867.52 2569.22 3867.28 2575.74 3866.8C2445.87 3856.78 2343.54 3748.36 2343.54 3616.09Z"
                    fill="url(#paint13_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3353.59 2625.82L5886.98 206.208H3555.1L3036.91 595.088H4821.75L3353.59 2625.82Z"
                    fill="url(#paint14_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4030.57 2881H3924.22L3817.83 2998.18H3924.22L4030.57 2881ZM4171.96 2881H4065.58L3959.23 2998.18H4065.58L4171.96 2881ZM4313.39 2881H4207.04L4100.66 2998.18H4207.04L4313.39 2881ZM3600.33 2998.18H3779.65L3905.1 2859.96L5097.59 2863.45L5125.06 2834.99H3754.9L3600.33 2998.18ZM5276.35 2835.08H5161.65L5134.19 2863.22H5248.92L5276.35 2835.08ZM5427.75 2835.08H5312.95L5285.61 2863.22H5400.31L5427.75 2835.08ZM5575.58 2835.08H5460.85L5433.4 2863.22H5548.13L5575.58 2835.08ZM5232.68 2881.63H4362.64L4328.83 2916.63H5198.87L5232.68 2881.63ZM5163.62 2962.86H4293.66L4259.86 2997.85H5129.89L5163.62 2962.86ZM3644.72 2886.72H3522.19L3481.4 2930.43L3197.06 2927.62V2998.18H3539.16L3644.72 2886.72Z"
                    fill="url(#paint15_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2697.7 3478.84H2593.61C2557.25 3478.84 2524.28 3493.8 2500.36 3518C2480.79 3537.86 2467.24 3563.89 2463.04 3592.89C2482.3 3588.81 2502.26 3585.77 2522.46 3584.09C2526.36 3574.14 2532.27 3565.1 2539.66 3557.65C2553.51 3543.64 2572.61 3534.97 2593.61 3534.97H2669.97V3580.07C2637.48 3577.28 2603.42 3577.99 2568.89 3582.96C2625.93 3584.8 2680.43 3596.66 2725.51 3618.29V3478.84H2697.7Z"
                    fill="url(#paint16_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4372.97 3490.7C4372.97 3490.7 4387.12 3547.63 4485.18 3548.67H4559.7C4559.7 3548.67 4598.03 3546.91 4600.42 3571.81C4602.88 3596.63 4578.69 3601.79 4559.06 3602.5C4539.34 3603.21 4482.4 3602.5 4482.4 3602.5 4607.71 3613.57 4679.93 3689.49L4641.28 3636.06C4641.28 3636.06 4675.79 3618.17 4673 3570.77C4670.3 3523.37 4621.16 3491.09 4563.36 3490.7H4372.97Z"
                    fill="url(#paint17_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2275.52 3627.85C2275.52 3472.1 2401.78 3345.9 2557.5 3345.9C2591.41 3345.9 2623.96 3351.95 2654.06 3362.93L2580.19 3430.98C2776.76 3415.37 2901.97 3472.99 2901.97 3472.99C2857.7 3342.65 2734.33 3248.89 2588.95 3248.89C2406.41 3248.89 2258.4 3396.83 2258.4 3579.3C2258.4 3633.42 2271.39 3684.42 2294.45 3729.55C2282.2 3697.95 2275.52 3663.67 2275.52 3627.85Z"
                    fill="url(#paint18_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1728.47 602.753C2304.83 602.753 2755.12 750.09 3162.05 955.604C3416.35 1085.63 3591.5 1248.42 3591.5 1248.42C3591.5 1248.42 3510.42 1601.33 3133.71 2119.33C2836.15 2499.38 2598.66 2685.72 2314.31 2899.09C1830.26 3246.28 1432.81 3395.61 1432.81 3395.61C1432.81 3395.61 1413.85 3409.62 1751.06 3161.22C2009.33 2958.24 2022.3 2934.12 2022.3 2934.12C2022.3 2934.12 2046.98 2854.84 2067.74 2781.14C2744 2304.06 2971.84 1475.5 2971.84 1475.5C2971.84 1475.5 2244.59 852.908 1306.49 882.044L1268.85 777.374C1268.85 777.374 1127.66 756.204 798.095 765.922C1270.84 585.474 1728.47 602.753 1728.47 602.753ZM985.682 1052.23C1920.52 1044.1 2470.13 1693.27 2470.13 1693.27C2470.13 1693.27 2377.97 2127.52 2055.25 2494.78C2101.4 2107.31 2096.08 1819.01 2096.08 1819.01C2096.08 1819.01 1636.63 1330.07 985.682 1342.18C375.49 1346.32 0 1743.88 0 1743.88C0 1743.88 242.422 1382.84 627.382 1167.85C627.382 1167.85 590.215 1117.25 547.638 1099.03C547.476 1098.87 747.956 1056.2 985.682 1052.23Z"
                    fill="url(#paint19_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1444.31 2405.86C1365.84 2505.68 1406.75 2482.21 1259.22 2533.84C1170.86 2303.79 1149.33 2170.54 1166.55 1943.92L1202.28 1879.97C1202.28 1879.97 1236.49 1753.63 1278.04 1615.54C1232.26 2049.16 1444.31 2405.86 1444.31 2405.86Z"
                    fill="url(#paint20_linear_1_17808)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1258.96 2534.19C1314.37 2507.24 1332.73 2484.5 1444.28 2406.26C1528.2 2637.88 1573.31 2824.25 1551.58 3050.46L1514.62 3113.68C1514.62 3113.68 1477.9 3239.23 1433.58 3376.47C1487.88 2944 1258.96 2534.19 1258.96 2534.19Z"
                    fill="url(#paint21_linear_1_17808)"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_1_17808"
                        x1="2879.96"
                        y1="3510.39"
                        x2="2879.96"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint1_linear_1_17808"
                        x1="3192.87"
                        y1="3510.39"
                        x2="3192.87"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint2_linear_1_17808"
                        x1="3524.3"
                        y1="3510.39"
                        x2="3524.3"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint3_linear_1_17808"
                        x1="3860.2"
                        y1="3510.39"
                        x2="3860.2"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint4_linear_1_17808"
                        x1="4204.25"
                        y1="3510.39"
                        x2="4204.25"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint5_linear_1_17808"
                        x1="4728.86"
                        y1="0"
                        x2="4728.86"
                        y2="2398.84"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint6_linear_1_17808"
                        x1="1450.99"
                        y1="2351.37"
                        x2="1450.99"
                        y2="3333.45"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint7_linear_1_17808"
                        x1="4728.86"
                        y1="385.713"
                        x2="4728.86"
                        y2="2784.55"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint8_linear_1_17808"
                        x1="1348.67"
                        y1="1551.75"
                        x2="1348.67"
                        y2="2480.43"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint9_linear_1_17808"
                        x1="1930.69"
                        y1="507.361"
                        x2="1930.69"
                        y2="3302.29"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint10_linear_1_17808"
                        x1="4461.95"
                        y1="594.889"
                        x2="4461.95"
                        y2="3013.01"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint11_linear_1_17808"
                        x1="2580.93"
                        y1="3600.48"
                        x2="2580.93"
                        y2="3744.38"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint12_linear_1_17808"
                        x1="4558.33"
                        y1="3607.9"
                        x2="4558.33"
                        y2="3762.19"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint13_linear_1_17808"
                        x1="2440.06"
                        y1="3364.61"
                        x2="2440.06"
                        y2="3867.52"
                        gradientUnits="userSpaceOnUse"
                        ><stop
                            stop-color="var(--color-surface-400, #606060)"
                        /><stop
                            offset="1"
                            stop-color="var(--color-surface-950, #0A0A0A)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint14_linear_1_17808"
                        x1="4461.94"
                        y1="206.208"
                        x2="4461.94"
                        y2="2625.82"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint15_linear_1_17808"
                        x1="4386.32"
                        y1="2834.99"
                        x2="4386.32"
                        y2="2998.18"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint16_linear_1_17808"
                        x1="2594.27"
                        y1="3478.84"
                        x2="2594.27"
                        y2="3618.29"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint17_linear_1_17808"
                        x1="4526.45"
                        y1="3490.7"
                        x2="4526.45"
                        y2="3689.49"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint18_linear_1_17808"
                        x1="2580.19"
                        y1="3248.89"
                        x2="2580.19"
                        y2="3729.55"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint19_linear_1_17808"
                        x1="1795.75"
                        y1="602.306"
                        x2="1795.75"
                        y2="3395.75"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint20_linear_1_17808"
                        x1="1302.7"
                        y1="1615.54"
                        x2="1302.7"
                        y2="2533.84"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint21_linear_1_17808"
                        x1="1407.98"
                        y1="2406.26"
                        x2="1407.98"
                        y2="3376.47"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="var(--color-primary-600)" /><stop
                            offset="1"
                            stop-color="var(--color-primary-950)"
                        /></linearGradient
                    >
                </defs>
            </svg>
        {/if}
    </div>
</div>

<style>
    .perspective-container {
        perspective: 1000px;
    }
    .transform-style-3d {
        transform-style: preserve-3d;
    }

    /* 3D Disassemble Effect - ENHANCED */
    /* When the container is hovered, move paths and groups in Z-space with force */

    /* Layer 1: Forward Pop */
    :global(.group:hover) path:nth-child(2n),
    :global(.group:hover) g:nth-child(2n) {
        transform: translateZ(50px) rotateX(5deg);
    }

    /* Layer 2: Mid Pop */
    :global(.group:hover) path:nth-child(2n + 1),
    :global(.group:hover) g:nth-child(2n + 1) {
        transform: translateZ(25px) rotateY(-5deg);
    }

    /* Layer 3: Extreme Pop */
    :global(.group:hover) path:nth-child(3n),
    :global(.group:hover) g:nth-child(3n) {
        transform: translateZ(80px) rotateZ(2deg);
    }

    /* Layer 4: Push Back */
    :global(.group:hover) path:nth-child(5n),
    :global(.group:hover) g:nth-child(5n) {
        transform: translateZ(-30px) scale(0.95);
    }

    /* Ensure paths transition smoothly with spring physics */
    path,
    g {
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Custom spring */
        transform-box: fill-box;
        transform-origin: center;
        will-change: transform;
    }

    .drop-shadow-red {
        filter: drop-shadow(0 0 15px var(--color-primary-500));
    }
    .drop-shadow-neon {
        /* Brighter neon glow */
        filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))
            drop-shadow(0 0 10px rgba(236, 72, 153, 0.6));
    }

    .animate-pulse-slow {
        animation: pulse 8s ease-in-out infinite;
    }
    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
            filter: drop-shadow(0 0 15px var(--color-primary-500));
        }
        50% {
            opacity: 0.9;
            transform: scale(1.02);
            filter: drop-shadow(0 0 25px var(--color-primary-400));
        }
    }

    .logo-particle-mode svg {
        filter: drop-shadow(0 0 30px var(--color-primary-500));
    }

    .animate-particle {
        animation: float-particle linear infinite;
    }

    @keyframes float-particle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        50% {
            opacity: 1;
            transform: translate(0, 0) scale(1.1);
        }
        100% {
            transform: translate(var(--tx, 100px), var(--ty, -100px)) scale(0);
            opacity: 0;
        }
    }
</style>
