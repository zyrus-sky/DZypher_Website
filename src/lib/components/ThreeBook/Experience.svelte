<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import {
        Float,
        OrbitControls,
        Environment,
        useCursor,
    } from "@threlte/extras";
    import Book from "./Book.svelte";
    import { spring } from "svelte/motion";
    import { Vector3, Group } from "three";

    export let pages: any[] = [];
    export let interactive: boolean = false;

    let group: Group;

    // Responsive Scale Logic
    const { size } = useThrelte();
    let scale = 1;
    let cameraZ = 4;
    let bookY = 0;

    let isMobile = false;

    $: {
        const width = $size.width;
        if (width < 768) {
            // Mobile
            scale = 0.7;
            cameraZ = 4.5;
            bookY = 0; // Centered
            isMobile = true;
        } else {
            // Desktop
            scale = 1.1;
            cameraZ = 3.5;
            bookY = 0;
            isMobile = false;
        }
    }

    // Mouse interaction state (Tilt)
    const rotationSpring = spring(
        { x: 0, y: 0 },
        { stiffness: 0.1, damping: 0.5 },
    );

    let mouseX = 0;
    let mouseY = 0;

    // Separate state for additive blending
    // Touch drag removed as per request
    let gyroRot = { x: 0, y: 0 };
    let time = 0;

    function handleMouseMove(e: MouseEvent) {
        if (!interactive || isMobile) return;
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        rotationSpring.set({ x: mouseY * 0.2, y: mouseX * 0.2 });
    }

    function handleOrientation(e: DeviceOrientationEvent) {
        if (!interactive || !isMobile) return;

        const gamma = e.gamma || 0;
        const beta = e.beta || 0;

        const targetX = Math.min(Math.max(gamma / 45, -1), 1);
        const targetY = Math.min(Math.max((beta - 45) / 45, -1), 1);

        // Update Gyro Offset (Subtle)
        gyroRot = { x: targetY * 0.5, y: targetX * 0.5 };
    }

    useTask((delta) => {
        if (isMobile) {
            time += delta;
            // Idle Sway (Breathing effect) - Increased amplitude
            const idleX = Math.sin(time * 0.5) * 0.08;
            const idleY = Math.cos(time * 0.3) * 0.08;

            // Combine Gyro (Offset) + Idle (Live)
            // No touchRot anymore
            rotationSpring.set({
                x: gyroRot.x + idleX,
                y: gyroRot.y + idleY,
            });
        }
    });
</script>

<svelte:window
    on:mousemove={handleMouseMove}
    on:deviceorientation={handleOrientation}
/>

<!-- Center camera x=0 -->
<T.PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={45}>
    {#if !isMobile}
        <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.1}
            rotateSpeed={0.5}
            target.y={0}
        />
    {/if}
</T.PerspectiveCamera>

<Float
    rotation.x={-0.5}
    floatIntensity={interactive ? 0 : 1}
    speed={interactive ? 0 : 2}
    rotationIntensity={interactive ? 0 : 2}
>
    <!-- Wrap Book in a group for tilt and position adjustment -->
    <T.Group
        bind:ref={group}
        {scale}
        position.y={bookY}
        rotation.x={$rotationSpring.x}
        rotation.y={$rotationSpring.y}
    >
        <Book {pages} />
    </T.Group>
</Float>

<T.DirectionalLight
    position={[2, 5, 2]}
    intensity={2.5}
    castShadow
    shadow.mapSize.width={2048}
    shadow.mapSize.height={2048}
    shadow.bias={-0.0001}
/>

<!-- Back Light to illuminate the rear cover -->
<T.DirectionalLight position={[0, 2, -5]} intensity={1.5} />

<!-- Ambient Light for global illumination -->
<T.AmbientLight intensity={0.8} />

<T.Mesh position.y={-1.5} rotation.x={-Math.PI / 2} receiveShadow>
    <T.PlaneGeometry args={[100, 100]} />
    <T.ShadowMaterial transparent opacity={0.2} />
</T.Mesh>
