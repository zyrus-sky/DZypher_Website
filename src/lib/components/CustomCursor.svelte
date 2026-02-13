<script lang="ts">
    import { spring } from "svelte/motion";

    let coords = spring(
        { x: -50, y: -50 },
        {
            stiffness: 1.0,
            damping: 1.0,
        },
    );

    let trailCoords = spring(
        { x: -50, y: -50 },
        {
            stiffness: 0.05,
            damping: 0.2,
        },
    );

    let size = spring(10, { stiffness: 0.3, damping: 0.6 });
    let isHovering = $state(false);

    // Particle trail system
    interface Particle {
        x: number;
        y: number;
        opacity: number;
        size: number;
        life: number;
    }

    let particles = $state<Particle[]>([]);
    let lastX = 0;
    let lastY = 0;
    let rafId: number;

    function handleMouseMove(e: MouseEvent) {
        coords.set({ x: e.clientX, y: e.clientY });
        trailCoords.set({ x: e.clientX, y: e.clientY });

        // Spawn particles on fast movement
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 8 && particles.length < 20) {
            particles.push({
                x: e.clientX + (Math.random() - 0.5) * 6,
                y: e.clientY + (Math.random() - 0.5) * 6,
                opacity: 0.7,
                size: 2 + Math.random() * 2,
                life: 0,
            });
            // Force reactive update
            particles = particles;
        }

        lastX = e.clientX;
        lastY = e.clientY;
    }

    function updateParticles() {
        if (particles.length > 0) {
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].life++;
                particles[i].opacity -= 0.04;
                particles[i].size *= 0.96;
                particles[i].y -= 0.3; // gentle float up

                if (particles[i].opacity <= 0 || particles[i].life > 25) {
                    particles.splice(i, 1);
                }
            }
            particles = particles; // trigger reactivity
        }
        rafId = requestAnimationFrame(updateParticles);
    }

    function handleMouseDown() {
        size.set(20);
    }

    function handleMouseUp() {
        size.set(isHovering ? 50 : 10);
    }

    function addHoverListeners() {
        const elements = document.querySelectorAll(
            "a, button, input, .interactive",
        );
        elements.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                isHovering = true;
                size.set(50);
            });
            el.addEventListener("mouseleave", () => {
                isHovering = false;
                size.set(10);
            });
        });
    }

    $effect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        addHoverListeners();
        rafId = requestAnimationFrame(updateParticles);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            observer.disconnect();
            cancelAnimationFrame(rafId);
        };
    });
</script>

<div class="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block">
    <!-- Particle Trail -->
    {#each particles as particle}
        <div
            class="absolute rounded-full bg-primary-400"
            style="
                left: {particle.x}px;
                top: {particle.y}px;
                width: {particle.size}px;
                height: {particle.size}px;
                opacity: {particle.opacity};
                transform: translate(-50%, -50%);
                filter: blur(1px);
            "
        ></div>
    {/each}

    <!-- Trail Cursor -->
    <div
        class="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-400/50 blur-[2px]"
        style="transform: translate({$trailCoords.x}px, {$trailCoords.y}px)"
    ></div>

    <!-- Main Cursor -->
    <div
        class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500 bg-primary-500/10 backdrop-blur-[1px]"
        style="transform: translate({$coords.x}px, {$coords.y}px); width: {$size}px; height: {$size}px; transition: width 0.1s, height 0.1s"
    >
        <div
            class="absolute inset-0 rounded-full bg-primary-500 opacity-40 blur-md"
        ></div>
    </div>

    <!-- Dot -->
    <div
        class="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgb(var(--color-primary-500-rgb))]"
        style="transform: translate({$coords.x}px, {$coords.y}px)"
    ></div>
</div>
