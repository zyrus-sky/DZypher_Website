<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { Float, Environment, OrbitControls } from "@threlte/extras";
    import { spring } from "svelte/motion";
    import Ticket from "./Ticket.svelte";

    // Mouse props for physics tilt
    export let mouseX = 0;
    export let mouseY = 0;
    export let scrollY = 0; // New scroll prop

    // Allow overriding camera Z from parent
    export let customCameraZ: number | null = null;

    const springRotationX = spring(0, { stiffness: 0.1, damping: 0.5 });
    const springRotationY = spring(0, { stiffness: 0.1, damping: 0.5 });

    // Reactively update spring targets
    $: {
        // Continuous Twist: Rotate continuously as the user scrolls
        // effectively creating a spiral/tumble effect.
        // Adjust multiplier (0.005) to control rotation speed relative to scroll.
        const scrollRotation = scrollY * 0.01;

        // Combining mouse interaction with scroll rotation
        springRotationY.set(mouseX * 0.3 + scrollRotation);
        springRotationX.set(-mouseY * 0.3 + Math.sin(scrollY * 0.002) * 0.1);
    }

    let time = 0;
    let wobble = 0;

    // Gentle wobble animation for "flex" feeling
    useTask((delta) => {
        time += delta;
        wobble = Math.sin(time * 2) * 0.05;
    });

    let innerWidth = 1200;

    // Default Logic:
    // Mobile (portrait): Move camera back (z=14)
    // Desktop: Keep z=9
    // If customCameraZ is provided, use it.
    let defaultCameraZ = 9;
    $: defaultCameraZ = innerWidth < 768 ? 14 : 9;

    $: cameraZ = customCameraZ !== null ? customCameraZ : defaultCameraZ;
</script>

<svelte:window bind:innerWidth />

<!-- Warm Key Light (Front Right) -->
<T.DirectionalLight
    position={[5, 10, 5]}
    intensity={2.0}
    color="#fff5e6"
    castShadow
    shadow.mapSize.width={2048}
    shadow.mapSize.height={2048}
/>
<!-- Warm Back Light (Back Left) - Symmetric to Key -->
<T.DirectionalLight position={[-5, 10, -5]} intensity={2.0} color="#fff5e6" />
<!-- Ambient Fill -->
<T.AmbientLight intensity={0.5} color="#fffaf0" />

<!-- Environment for reflections -->
<!-- Environment for reflections -->
<Environment {...{ preset: "city" } as any} />

<!-- Camera -->
<T.PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={45}>
    <OrbitControls
        enabled={innerWidth >= 768}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
    />
    <!-- Headlamp: Follows camera to light up whatever we look at -->
    <T.PointLight
        position={[0, 0, 0]}
        intensity={1.0}
        color="#fff5e6"
        decay={0}
    />
</T.PerspectiveCamera>

<!-- Floating Ticket Group -->
<!-- Combined Rotation: Wobble (Z) + Mouse Tilt (X/Y) -->
<T.Group
    rotation.x={$springRotationX}
    rotation.y={$springRotationY}
    rotation.z={wobble}
>
    <Float
        speed={3}
        rotationIntensity={0.5}
        floatIntensity={1}
        floatingRange={[-0.1, 0.1]}
    >
        <Ticket />
    </Float>
</T.Group>

<!-- Shadow Plane -->
<T.Mesh position.y={-4.5} rotation.x={-Math.PI / 2} receiveShadow>
    <T.PlaneGeometry args={[100, 100]} />
    <T.ShadowMaterial transparent opacity={0.2} color="#5a4d3b" />
</T.Mesh>
