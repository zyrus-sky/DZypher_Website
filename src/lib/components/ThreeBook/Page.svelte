<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import { useTexture, useCursor } from "@threlte/extras";
    import {
        Bone,
        BoxGeometry,
        Color,
        Float32BufferAttribute,
        MathUtils,
        MeshStandardMaterial,
        Skeleton,
        SkinnedMesh,
        SRGBColorSpace,
        Uint16BufferAttribute,
        Vector3,
        Group,
    } from "three";
    import { degToRad } from "three/src/math/MathUtils.js";
    import { pageAtom } from "./store";
    import { easing } from "maath";

    export let number: number;
    export let front: string;
    export let back: string;
    export let page: number; // current page state for animation
    export let opened: boolean;
    export let bookClosed: boolean;
    export let totalPages: number;

    let group: Group;
    let skinnedMesh: SkinnedMesh;

    // Geometry Constants
    const PAGE_WIDTH = 1.28;
    const PAGE_HEIGHT = 1.71;
    const PAGE_DEPTH = 0.003;
    const PAGE_SEGMENTS = 30;
    const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

    const pageGeometry = new BoxGeometry(
        PAGE_WIDTH,
        PAGE_HEIGHT,
        PAGE_DEPTH,
        PAGE_SEGMENTS,
        2,
    );

    pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

    const position = pageGeometry.attributes.position;
    const vertex = new Vector3();
    const skinIndexes: number[] = [];
    const skinWeights: number[] = [];

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        const x = vertex.x;
        const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
        let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
        skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
        skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    pageGeometry.setAttribute(
        "skinIndex",
        new Uint16BufferAttribute(skinIndexes, 4),
    );
    pageGeometry.setAttribute(
        "skinWeight",
        new Float32BufferAttribute(skinWeights, 4),
    );

    const whiteColor = new Color("white");
    const emissiveColor = new Color("orange");

    const pageMaterials = [
        new MeshStandardMaterial({ color: whiteColor }),
        new MeshStandardMaterial({ color: "#111" }),
        new MeshStandardMaterial({ color: whiteColor }),
        new MeshStandardMaterial({ color: whiteColor }),
    ];

    const getTexturePath = (name: string) => {
        // User moved all WebP files to static/textures/
        // References: 1.webp, ..., 11.webp, book-back.webp
        return `/textures/${name}.webp`;
    };

    const dummyCoverRoughness = "/textures/book-cover-roughness.webp";

    // Load textures
    const texturePromise = useTexture([
        getTexturePath(front),
        getTexturePath(back),
        ...(number === 0 || number === totalPages - 1
            ? [dummyCoverRoughness]
            : []),
    ]);

    let manualSkinnedMesh: SkinnedMesh;

    async function setupMesh() {
        try {
            const textures = await texturePromise;
            // @ts-ignore
            const [picture, picture2, pictureRoughness] = textures;

            picture.colorSpace = SRGBColorSpace;
            picture2.colorSpace = SRGBColorSpace;

            const bones: Bone[] = [];
            for (let i = 0; i <= PAGE_SEGMENTS; i++) {
                let bone = new Bone();
                bones.push(bone);
                if (i === 0) {
                    bone.position.x = 0;
                } else {
                    bone.position.x = SEGMENT_WIDTH;
                }
                if (i > 0) {
                    bones[i - 1].add(bone);
                }
            }
            const skeleton = new Skeleton(bones);

            const materials = [
                ...pageMaterials,
                new MeshStandardMaterial({
                    color: whiteColor,
                    map: picture,
                    ...(number === 0
                        ? { roughnessMap: pictureRoughness }
                        : { roughness: 0.1 }),
                    emissive: emissiveColor,
                    emissiveIntensity: 0,
                }),
                new MeshStandardMaterial({
                    color: whiteColor,
                    map: picture2,
                    ...(number === totalPages - 1
                        ? { roughnessMap: pictureRoughness }
                        : { roughness: 0.1 }),
                    emissive: emissiveColor,
                    emissiveIntensity: 0,
                }),
            ];

            // Debug: Check if last page textures are valid
            if (number === totalPages - 1) {
                console.log(`Page ${number} (Back Cover):`, {
                    frontTexture: picture,
                    backTexture: picture2, // This should be 'book-back'
                    roughness: pictureRoughness,
                });

                // Fix orientation for back cover if needed
                if (picture2) {
                    picture2.center.set(0.5, 0.5);
                    // The back texture might need rotation if it appears upside down,
                    // but if it's black, it might be UVs or lighting.
                    // mirror logic?
                    picture2.repeat.set(-1, 1); // Flip horizontally
                }
            }

            const mesh = new SkinnedMesh(pageGeometry, materials);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = false;
            mesh.add(skeleton.bones[0]);
            mesh.bind(skeleton);

            manualSkinnedMesh = mesh;
            skinnedMesh = mesh;
            return mesh;
        } catch (error) {
            console.error("Failed to setup mesh for page " + number, error);
            throw error;
        }
    }

    let meshPromise = setupMesh();

    // Animation Logic
    let turnedAt = 0;
    let lastOpened = opened;

    // Easing constants
    const easingFactor = 0.5;
    const easingFactorFold = 0.3;
    const insideCurveStrength = 0.18;
    const outsideCurveStrength = 0.05;
    const turningCurveStrength = 0.09;

    useTask((delta) => {
        if (!skinnedMesh) return;

        if (lastOpened !== opened) {
            turnedAt = Date.now();
            lastOpened = opened;
        }

        let turningTime = Math.min(400, Date.now() - turnedAt) / 400;
        turningTime = Math.sin(turningTime * Math.PI);

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
        if (!bookClosed) {
            targetRotation += degToRad(number * 0.8);
        }

        const bones = skinnedMesh.skeleton.bones;
        for (let i = 0; i < bones.length; i++) {
            const target = i === 0 ? group : bones[i];

            const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
            const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
            const turningIntensity =
                Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

            let rotationAngle =
                insideCurveStrength * insideCurveIntensity * targetRotation -
                outsideCurveStrength * outsideCurveIntensity * targetRotation +
                turningCurveStrength * turningIntensity * targetRotation;

            let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);

            if (bookClosed) {
                if (i === 0) {
                    rotationAngle = targetRotation;
                    foldRotationAngle = 0;
                } else {
                    rotationAngle = 0;
                    foldRotationAngle = 0;
                }
            }

            easing.dampAngle(
                target.rotation,
                "y",
                rotationAngle,
                easingFactor,
                delta,
            );

            const foldIntensity =
                i > 8
                    ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) *
                      turningTime
                    : 0;
            easing.dampAngle(
                target.rotation,
                "x",
                foldRotationAngle * foldIntensity,
                easingFactorFold,
                delta,
            );
        }

        // Emissive update using type assertion since material array access is complex in TS
        const emissiveIntensity = highlighted ? 0.22 : 0;
        // Material indices 4 and 5
        const mats = skinnedMesh.material as MeshStandardMaterial[];
        if (Array.isArray(mats)) {
            if (mats[4]) {
                mats[4].emissiveIntensity = MathUtils.lerp(
                    mats[4].emissiveIntensity,
                    emissiveIntensity,
                    0.1,
                );
            }
            if (mats[5]) {
                mats[5].emissiveIntensity = MathUtils.lerp(
                    mats[5].emissiveIntensity,
                    emissiveIntensity,
                    0.1,
                );
            }
        }
    });

    // Interactivity
    let highlighted = false;
    const { onPointerEnter, onPointerLeave } = useCursor();

    function handlePointerEnter(e: any) {
        e.stopPropagation();
        highlighted = true;
        onPointerEnter();
    }

    function handlePointerLeave(e: any) {
        e.stopPropagation();
        highlighted = false;
        onPointerLeave();
    }

    function handleClick(e: any) {
        e.stopPropagation();
        $pageAtom = opened ? number : number + 1;
        highlighted = false;
    }
</script>

{#await meshPromise then mesh}
    <T.Group
        bind:ref={group}
        on:pointerenter={handlePointerEnter}
        on:pointerleave={handlePointerLeave}
        on:click={handleClick}
    >
        <T is={mesh} position.z={-number * PAGE_DEPTH + page * PAGE_DEPTH} />
    </T.Group>
{:catch error}
    <T.Group>
        <!-- Error placeholder -->
        <T.Mesh>
            <T.BoxGeometry args={[1, 1.5, 0.1]} />
            <T.MeshBasicMaterial color="red" />
        </T.Mesh>
    </T.Group>
{/await}
