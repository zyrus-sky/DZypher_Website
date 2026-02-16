<script lang="ts">
    import { teamStore } from "$lib/stores";
    import { reveal, viewport } from "$lib/actions";
    import { spring } from "svelte/motion";
    import Marquee from "$lib/components/Marquee.svelte";

    // Combine Faculty and Vortix Coordinators
    $: coordinators = [...$teamStore.faculty, ...$teamStore.vortix];

    // Unified Tilt Action (Mouse + Gyro + Idle)
    function tilt(
        node: HTMLElement,
        options: { inView: boolean; idle?: boolean },
    ) {
        // Physics constraints
        const rx = spring(0, { stiffness: 0.1, damping: 0.25 });
        const ry = spring(0, { stiffness: 0.1, damping: 0.25 });
        const tx = spring(0, { stiffness: 0.1, damping: 0.25 });
        const ty = spring(0, { stiffness: 0.1, damping: 0.25 });

        // Update CSS variables
        const unsubscribeRx = rx.subscribe((v) =>
            node.style.setProperty("--rx", `${v}deg`),
        );
        const unsubscribeRy = ry.subscribe((v) =>
            node.style.setProperty("--ry", `${v}deg`),
        );
        const unsubscribeTx = tx.subscribe((v) =>
            node.style.setProperty("--tx", `${v}px`),
        );
        const unsubscribeTy = ty.subscribe((v) =>
            node.style.setProperty("--ty", `${v}px`),
        );

        // State
        let hovering = false;
        let gyroActive = false;
        let animationId: number;
        let currentOptions = options;
        // Random phase for natural "desynchronized" feel
        const phase = Math.random() * Math.PI * 2;
        const speed = 0.0015; // Gentle float speed

        // Idle Animation Loop
        function animateIdle(time: number) {
            // Stop if hovering, gyro active, out of view, OR idle disabled
            if (
                hovering ||
                gyroActive ||
                !currentOptions.inView ||
                currentOptions.idle === false
            )
                return;

            // Gentle floating orbit (max 3-5 deg)
            const targetRx = Math.sin(time * speed + phase) * 4;
            const targetRy = Math.cos(time * speed + phase) * 4;

            // Subtle parallax float
            const targetTx = Math.cos(time * speed + phase) * -4;
            const targetTy = Math.sin(time * speed + phase) * -4;

            rx.set(targetRx);
            ry.set(targetRy);
            tx.set(targetTx);
            ty.set(targetTy);

            animationId = requestAnimationFrame(animateIdle);
        }

        // Start idle loop immediately if in view and enabled
        if (currentOptions.inView && currentOptions.idle !== false) {
            animationId = requestAnimationFrame(animateIdle);
        }

        // Mouse Move Handler
        function handleMouseMove(e: MouseEvent) {
            if (!hovering) {
                hovering = true;
                cancelAnimationFrame(animationId);
            }

            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt (max 15 deg)
            const targetRx = ((y - centerY) / centerY) * -15;
            const targetRy = ((x - centerX) / centerX) * 15;

            // Calculate parallax (max 20px)
            const targetTx = ((x - centerX) / centerX) * -20;
            const targetTy = ((y - centerY) / centerY) * -20;

            rx.set(targetRx);
            ry.set(targetRy);
            tx.set(targetTx);
            ty.set(targetTy);
        }

        function handleMouseLeave() {
            hovering = false;
            // Resume idle loop ONLY if in view and enabled
            if (currentOptions.inView && currentOptions.idle !== false) {
                animationId = requestAnimationFrame(animateIdle);
            } else {
                // If idle disabled, reset spring
                rx.set(0);
                ry.set(0);
                tx.set(0);
                ty.set(0);
            }
        }

        // Gyro Handler (Mobile)
        // We only listen if device supports it and mouse isn't active
        function handleOrientation(e: DeviceOrientationEvent) {
            if (!currentOptions.inView) return;

            // Check for mobile/touch capability roughly
            if (window.matchMedia("(hover: none)").matches) {
                gyroActive = true;
                cancelAnimationFrame(animationId);

                // Clamp values
                const beta = Math.min(Math.max(e.beta || 0, -45), 45); // X-axis (-180 to 180)
                const gamma = Math.min(Math.max(e.gamma || 0, -45), 45); // Y-axis (-90 to 90)

                // Map to tilt (-15 to 15)
                // Normalize beta (-45 to 45 -> -1 to 1) * 15
                const targetRx = (beta / 45) * -15;
                const targetRy = (gamma / 45) * 15;

                // Parallax
                const targetTx = (gamma / 45) * -20;
                const targetTy = (beta / 45) * -20;

                rx.set(targetRx);
                ry.set(targetRy);
                tx.set(targetTx);
                ty.set(targetTy);
            }
        }

        node.addEventListener("mousemove", handleMouseMove);
        node.addEventListener("mouseleave", handleMouseLeave);
        // Only add gyro listener if window exists
        if (typeof window !== "undefined") {
            window.addEventListener("deviceorientation", handleOrientation);
        }

        return {
            update(newOptions: { inView: boolean; idle?: boolean }) {
                const prevInView = currentOptions.inView;
                currentOptions = newOptions;

                // If we entered view, resume animation (if enabled)
                if (
                    currentOptions.inView &&
                    !prevInView &&
                    !hovering &&
                    !gyroActive &&
                    currentOptions.idle !== false
                ) {
                    cancelAnimationFrame(animationId);
                    animationId = requestAnimationFrame(animateIdle);
                } else if (!currentOptions.inView) {
                    // If we exited view, stop animation
                    cancelAnimationFrame(animationId);
                }
            },
            destroy() {
                cancelAnimationFrame(animationId);
                node.removeEventListener("mousemove", handleMouseMove);
                node.removeEventListener("mouseleave", handleMouseLeave);
                if (typeof window !== "undefined") {
                    window.removeEventListener(
                        "deviceorientation",
                        handleOrientation,
                    );
                }
                unsubscribeRx();
                unsubscribeRy();
                unsubscribeTx();
                unsubscribeTy();
            },
        };
    }

    let inView = false;
</script>

<div
    class="py-24 relative overflow-visible"
    use:viewport
    onenterViewport={() => (inView = true)}
    onexitViewport={() => (inView = false)}
>
    <div class="container mx-auto px-6 mb-16 text-center">
        <h2
            use:reveal
            class="reveal-fade-up text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-white mb-4"
        >
            Coordination Team
        </h2>
        <div class="h-1 w-24 bg-primary-500 mx-auto rounded-full"></div>
    </div>

    <!-- Static Grid Layout (Desktop Only) -->
    <div
        class="container mx-auto px-6 hidden md:flex flex-wrap justify-center gap-10 md:gap-12 pb-24"
    >
        {#each coordinators as member, i}
            <!-- Card Wrapper with Zig-Zag offset -->
            <div
                class="group relative flex flex-col items-center transition-all duration-500"
                class:md:mt-0={i % 2 === 0}
                class:md:mt-16={i % 2 !== 0}
            >
                <!-- 3D Tilt Container (Desktop) -->
                <div
                    class="relative w-[300px] h-[380px] perspective-1000"
                    use:tilt={{ inView, idle: true }}
                    role="presentation"
                >
                    <!-- The Tilting Card -->
                    <div
                        class="w-full h-full relative transition-transform duration-100 ease-out preserve-3d group-hover:scale-105"
                        style="transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));"
                    >
                        <!-- Colored Shadow/Glow (Behind) -->
                        <div
                            class="absolute inset-0 bg-primary-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-6"
                            style="transform: translateZ(-20px);"
                        ></div>

                        <!-- Card Content (Masked) -->
                        <div
                            class="absolute inset-0 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 shadow-2xl"
                        >
                            <!-- Image Parallax Layer -->
                            <div
                                class="absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-100 ease-out"
                                style="transform: translateX(var(--tx, 0px)) translateY(var(--ty, 0px)) scale(1.1);"
                            >
                                {#if member.image}
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
                                    ></div>
                                {:else}
                                    <div
                                        class="w-full h-full bg-stone-800 flex items-center justify-center"
                                    >
                                        <i
                                            class="fas fa-user text-6xl text-stone-600"
                                        ></i>
                                    </div>
                                {/if}
                            </div>

                            <!-- Social Icons (Bottom Right INSIDE Card) -->
                            <div
                                class="absolute bottom-3 right-3 flex gap-2 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                {#if member.socials?.linkedin}
                                    <a
                                        href={member.socials.linkedin}
                                        target="_blank"
                                        class="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-md text-white hover:bg-white/20 transition-all shadow-lg"
                                        aria-label="LinkedIn Profile"
                                        onclick={(e) => e.stopPropagation()}
                                    >
                                        <i class="fab fa-linkedin-in text-sm"
                                        ></i>
                                    </a>
                                {/if}
                                {#if member.socials?.github}
                                    <a
                                        href={member.socials.github}
                                        target="_blank"
                                        class="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-md text-white hover:bg-white/20 transition-all shadow-lg"
                                        aria-label="GitHub Profile"
                                        onclick={(e) => e.stopPropagation()}
                                    >
                                        <i class="fab fa-github text-sm"></i>
                                    </a>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Text Below Card -->
                <div class="mt-4 text-left w-full pl-2">
                    <h3
                        class="text-xl font-bold text-white font-neuropol tracking-wide group-hover:text-primary-400 transition-colors uppercase leading-tight"
                    >
                        {member.name}
                    </h3>
                    <p
                        class="text-white/60 text-sm font-medium tracking-wider mt-1"
                    >
                        {member.role}
                    </p>
                </div>
            </div>
        {/each}
    </div>

    <!-- Mobile Zig-Zag Marquee (Mobile Only) -->
    <div class="w-full overflow-hidden block md:hidden mb-24">
        <Marquee speed={30} direction="left" pauseOnHover={true}>
            <div class="flex gap-8 px-4 py-8 items-start">
                {#each coordinators as member, i}
                    <!-- Card Wrapper with Zig-Zag offset (Mobile: mt-12 vs mt-0) -->
                    <div
                        class="group relative flex flex-col items-center flex-shrink-0"
                        class:mt-0={i % 2 === 0}
                        class:mt-12={i % 2 !== 0}
                    >
                        <!-- 3D Tilt Container (Mobile Sized) -->
                        <div
                            class="relative w-[260px] h-[340px] perspective-1000"
                            use:tilt={{ inView, idle: true }}
                        >
                            <!-- The Tilting Card -->
                            <div
                                class="w-full h-full relative transition-transform duration-100 ease-out preserve-3d"
                                style="transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));"
                            >
                                <!-- Colored Shadow/Glow (Behind) -->
                                <div
                                    class="absolute inset-0 bg-primary-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4"
                                    style="transform: translateZ(-20px);"
                                ></div>

                                <!-- Card Content (Masked) -->
                                <div
                                    class="absolute inset-0 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 shadow-2xl"
                                >
                                    <!-- Image Parallax Layer -->
                                    <div
                                        class="absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-100 ease-out"
                                        style="transform: translateX(var(--tx, 0px)) translateY(var(--ty, 0px)) scale(1.1);"
                                    >
                                        {#if member.image}
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                            <div
                                                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
                                            ></div>
                                        {:else}
                                            <div
                                                class="w-full h-full bg-stone-800 flex items-center justify-center"
                                            >
                                                <i
                                                    class="fas fa-user text-6xl text-stone-600"
                                                ></i>
                                            </div>
                                        {/if}
                                    </div>

                                    <!-- Social Icons -->
                                    <div
                                        class="absolute bottom-3 right-3 flex gap-2 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        {#if member.socials?.linkedin}
                                            <a
                                                href={member.socials.linkedin}
                                                target="_blank"
                                                class="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-md text-white hover:bg-white/20 transition-all shadow-lg"
                                                aria-label="LinkedIn Profile"
                                                onclick={(e) =>
                                                    e.stopPropagation()}
                                            >
                                                <i
                                                    class="fab fa-linkedin-in text-sm"
                                                ></i>
                                            </a>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Text Below Card -->
                        <div class="mt-4 text-left w-full pl-2">
                            <h3
                                class="text-lg font-bold text-white font-neuropol tracking-wide group-hover:text-primary-400 transition-colors uppercase leading-tight"
                            >
                                {member.name}
                            </h3>
                            <p
                                class="text-white/60 text-xs font-medium tracking-wider mt-1"
                            >
                                {member.role}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </Marquee>
    </div>

    <!-- Core Team Marquee -->
    {#if $teamStore.core.length > 0}
        <div class="w-full border-t border-white/5 pt-12">
            <div class="container mx-auto px-6 mb-12 text-center">
                <h3
                    use:reveal
                    class="reveal-fade-up text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-400 to-white"
                >
                    Core Team
                </h3>
            </div>

            <div class="w-full overflow-hidden">
                <Marquee speed={40} direction="left" pauseOnHover={true}>
                    <div class="flex gap-12 px-4 py-12 items-start">
                        <!-- Increased gap and padding for tilt/zig-zag -->
                        {#each $teamStore.core as member, i}
                            <!-- Marquee Item with Zig-Zag -->
                            <div
                                class="group relative flex flex-col items-center flex-shrink-0"
                                class:mt-16={i % 2 !== 0}
                                class:mt-0={i % 2 === 0}
                            >
                                <!-- 3D Tilt Container (Smaller for marquee) -->
                                <div
                                    class="relative w-[220px] h-[280px] perspective-1000"
                                    use:tilt={{ inView, idle: false }}
                                >
                                    <div
                                        class="w-full h-full relative transition-transform duration-100 ease-out preserve-3d group-hover:scale-105"
                                        style="transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));"
                                    >
                                        <!-- Colored Shadow -->
                                        <div
                                            class="absolute inset-0 bg-primary-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style="transform: translateZ(-20px);"
                                        ></div>

                                        <!-- Card Content -->
                                        <div
                                            class="absolute inset-0 rounded-xl overflow-hidden bg-stone-900 border border-white/10"
                                        >
                                            <!-- Image Parallax -->
                                            <div
                                                class="absolute inset-[-10%] w-[120%] h-[120%] transition-transform duration-100 ease-out"
                                                style="transform: translateX(var(--tx, 0px)) translateY(var(--ty, 0px)) scale(1.1);"
                                            >
                                                {#if member.image}
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                {:else}
                                                    <div
                                                        class="w-full h-full bg-stone-800 flex items-center justify-center"
                                                    >
                                                        <i
                                                            class="fas fa-user text-4xl text-stone-600"
                                                        ></i>
                                                    </div>
                                                {/if}
                                            </div>
                                            <!-- Socials -->
                                            <div
                                                class="absolute bottom-2 right-2 flex gap-1 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                                            >
                                                {#if member.socials?.linkedin}
                                                    <a
                                                        href={member.socials
                                                            .linkedin}
                                                        target="_blank"
                                                        aria-label="LinkedIn Profile"
                                                        class="w-6 h-6 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/30 rounded text-white hover:bg-white/20 text-xs transition-all"
                                                        ><i
                                                            class="fab fa-linkedin-in"
                                                        ></i></a
                                                    >
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 text-left w-full pl-1">
                                    <h4
                                        class="text-base font-bold text-white font-neuropol uppercase leading-tight truncate w-[220px]"
                                    >
                                        {member.name}
                                    </h4>
                                    <p
                                        class="text-white/50 text-xs uppercase tracking-wider"
                                    >
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </Marquee>
            </div>
        </div>
    {/if}
</div>

<style>
    .perspective-1000 {
        perspective: 1000px;
    }
    .preserve-3d {
        transform-style: preserve-3d;
    }
</style>
