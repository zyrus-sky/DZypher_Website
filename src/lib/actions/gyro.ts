
import { spring } from "svelte/motion";

interface GyroOptions {
    intensity?: number; // Max rotation in degrees
    stiffness?: number;
    damping?: number;
}

export function gyro(node: HTMLElement, { intensity = 15, stiffness = 0.1, damping = 0.4 }: GyroOptions = {}) {
    // Spring stores for smooth animation
    const x = spring(0, { stiffness, damping });
    const y = spring(0, { stiffness, damping });

    let isMobile = false;

    // --- Desktop: Mouse Move ---
    function handleMouseMove(e: MouseEvent) {
        if (isMobile) return;

        // Normalize mouse from -1 to 1 based on window center
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = (e.clientY / window.innerHeight) * 2 - 1; // Inverted for tilt?

        // Tilt Logic:
        // Mouse Right (X=1) -> Rotate Y Positive
        // Mouse Down (Y=1) -> Rotate X Negative

        y.set(normalizedX * intensity);
        x.set(-normalizedY * intensity);
    }

    // --- Mobile: Device Orientation ---
    function handleOrientation(e: DeviceOrientationEvent) {
        isMobile = true;
        const gamma = e.gamma || 0; // Left-Right Tilt (-90 to 90)
        let beta = e.beta || 0;   // Front-Back Tilt (-180 to 180)

        // Clamp values for sanity
        const targetX = Math.min(Math.max((beta - 45) / 45, -1), 1); // Center around 45deg holding angle
        const targetY = Math.min(Math.max(gamma / 45, -1), 1);

        x.set(targetX * intensity); // Front/Back tilt maps to X rotation
        y.set(targetY * intensity); // Left/Right tilt maps to Y rotation
    }

    // --- Apply Transform ---
    const unsubscribeX = x.subscribe(($x) => {
        node.style.setProperty("--gyro-x", `${$x}deg`);
        updateTransform();
    });

    const unsubscribeY = y.subscribe(($y) => {
        node.style.setProperty("--gyro-y", `${$y}deg`);
        updateTransform();
    });

    function updateTransform() {
        // Use perspective to give it 3D depth
        node.style.transform = `perspective(1000px) rotateX(var(--gyro-x)) rotateY(var(--gyro-y))`;
    }

    // --- Event Listeners ---
    // We attach mousemove to WINDOW to track cursor globally (parallax feel)
    // We attach orientation to WINDOW
    if (typeof window !== "undefined") {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("deviceorientation", handleOrientation);
    }

    return {
        update(params: GyroOptions) {
            if (params.intensity !== undefined) intensity = params.intensity;
            if (params.stiffness !== undefined) {
                x.stiffness = params.stiffness;
                y.stiffness = params.stiffness;
            }
            if (params.damping !== undefined) {
                x.damping = params.damping;
                y.damping = params.damping;
            }
        },
        destroy() {
            if (typeof window !== "undefined") {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("deviceorientation", handleOrientation);
            }
            unsubscribeX();
            unsubscribeY();
            // Clean up style
            node.style.transform = "";
            node.style.removeProperty("--gyro-x");
            node.style.removeProperty("--gyro-y");
        }
    };
}
