<script lang="ts">
    import { isMenuOpen, themeStore } from "$lib/stores";
    import { spring } from "svelte/motion";

    // Svelte 5: Props using $props()
    let { className = "" }: { className?: string } = $props();

    // Tilt State
    let rotateX = spring(0, { stiffness: 0.1, damping: 0.3 });
    let rotateY = spring(0, { stiffness: 0.1, damping: 0.3 });

    function handleMouseMove(e: MouseEvent) {
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
        rotateX.set(0);
        rotateY.set(0);
    }
</script>

<div
    class={`relative ${className} {$isMenuOpen ? 'logo-particle-mode' : ''} transition-transform duration-100 ease-out perspective-container`}
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
                <img
                    src="/assets/vortix_logo_tx.svg"
                    alt="Vortix Logo"
                    class="w-full h-auto drop-shadow-neon relative z-10"
                />
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
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint1_linear_1_17808"
                        x1="3192.87"
                        y1="3510.39"
                        x2="3192.87"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint2_linear_1_17808"
                        x1="3524.3"
                        y1="3510.39"
                        x2="3524.3"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint3_linear_1_17808"
                        x1="3860.2"
                        y1="3510.39"
                        x2="3860.2"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint4_linear_1_17808"
                        x1="4204.25"
                        y1="3510.39"
                        x2="4204.25"
                        y2="3700.28"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint5_linear_1_17808"
                        x1="4728.86"
                        y1="0"
                        x2="4728.86"
                        y2="2398.84"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint6_linear_1_17808"
                        x1="1450.99"
                        y1="2351.37"
                        x2="1450.99"
                        y2="3333.45"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint7_linear_1_17808"
                        x1="4728.86"
                        y1="385.713"
                        x2="4728.86"
                        y2="2784.55"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint8_linear_1_17808"
                        x1="1348.67"
                        y1="1551.75"
                        x2="1348.67"
                        y2="2480.43"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint9_linear_1_17808"
                        x1="1930.69"
                        y1="507.361"
                        x2="1930.69"
                        y2="3302.29"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint10_linear_1_17808"
                        x1="4461.95"
                        y1="594.889"
                        x2="4461.95"
                        y2="3013.01"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint11_linear_1_17808"
                        x1="2580.93"
                        y1="3600.48"
                        x2="2580.93"
                        y2="3744.38"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint12_linear_1_17808"
                        x1="4558.33"
                        y1="3607.9"
                        x2="4558.33"
                        y2="3762.19"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint13_linear_1_17808"
                        x1="2440.06"
                        y1="3364.61"
                        x2="2440.06"
                        y2="3867.52"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#606060" /><stop
                            offset="1"
                            stop-color="#0A0A0A"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint14_linear_1_17808"
                        x1="4461.94"
                        y1="206.208"
                        x2="4461.94"
                        y2="2625.82"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint15_linear_1_17808"
                        x1="4386.32"
                        y1="2834.99"
                        x2="4386.32"
                        y2="2998.18"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint16_linear_1_17808"
                        x1="2594.27"
                        y1="3478.84"
                        x2="2594.27"
                        y2="3618.29"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint17_linear_1_17808"
                        x1="4526.45"
                        y1="3490.7"
                        x2="4526.45"
                        y2="3689.49"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint18_linear_1_17808"
                        x1="2580.19"
                        y1="3248.89"
                        x2="2580.19"
                        y2="3729.55"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint19_linear_1_17808"
                        x1="1795.75"
                        y1="602.306"
                        x2="1795.75"
                        y2="3395.75"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint20_linear_1_17808"
                        x1="1302.7"
                        y1="1615.54"
                        x2="1302.7"
                        y2="2533.84"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
                        /></linearGradient
                    >
                    <linearGradient
                        id="paint21_linear_1_17808"
                        x1="1407.98"
                        y1="2406.26"
                        x2="1407.98"
                        y2="3376.47"
                        gradientUnits="userSpaceOnUse"
                        ><stop stop-color="#8B0C15" /><stop
                            offset="1"
                            stop-color="#250306"
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
