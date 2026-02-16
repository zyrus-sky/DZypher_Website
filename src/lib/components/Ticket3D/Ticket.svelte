<script lang="ts">
    import { T } from "@threlte/core";
    import { useTexture } from "@threlte/extras";
    import { FrontSide } from "three";

    // Load textures
    const map = useTexture({
        front: "/pass/ticket-front.png",
        back: "/pass/ticket-back.png",
    });

    // Material settings: Opaque but Glossy (Laminated/Plastic feel)
    // No transmission (refraction) to avoid darkness issues.
    const materialParams = {
        roughness: 0.2, // Smooth
        metalness: 0.1, // Slight metal for reflections
        clearcoat: 1.0, // High gloss top coat
        clearcoatRoughness: 0.1,
        transparent: true, // Needed for PNG alpha channel (cutouts)
        alphaTest: 0.5, // Cut out the transparent parts of the PNG
        opacity: 1.0, // Solid body
        side: FrontSide, // Render front face only (we use 2 meshes)
    };

    const depth = 0.02;
</script>

{#await map then value}
    <T.Group>
        <!-- Front Face -->
        <T.Mesh position.z={depth / 2}>
            <T.PlaneGeometry args={[3, 5.6]} />
            <T.MeshPhysicalMaterial map={value.front} {...materialParams} />
        </T.Mesh>

        <!-- Back Face -->
        <T.Mesh position.z={-depth / 2} rotation.y={Math.PI}>
            <T.PlaneGeometry args={[3, 5.6]} />
            <T.MeshPhysicalMaterial map={value.back} {...materialParams} />
        </T.Mesh>
    </T.Group>
{/await}
