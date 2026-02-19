<script lang="ts">
    import type { Node, Edge } from "@xyflow/svelte";
    import { FlowCanvas } from "$lib/components/flow";

    let nodes = $state.raw<Node[]>([
        {
            id: "1",
            type: "glass",
            position: { x: 250, y: 0 },
            data: {
                label: "DZypher",
                icon: "fas fa-rocket",
                description: "Club portal",
            },
        },
        {
            id: "2",
            type: "glass",
            position: { x: 80, y: 150 },
            data: {
                label: "Events",
                icon: "fas fa-calendar-alt",
                description: "Workshops & hackathons",
            },
        },
        {
            id: "3",
            type: "glass",
            position: { x: 420, y: 150 },
            data: {
                label: "Resources",
                icon: "fas fa-book",
                description: "Learning materials",
            },
        },
        {
            id: "4",
            type: "glass",
            position: { x: 80, y: 320 },
            data: {
                label: "VORTIX '26",
                icon: "fas fa-bolt",
                description: "Annual tech fest",
            },
        },
        {
            id: "5",
            type: "glass",
            position: { x: 420, y: 320 },
            data: {
                label: "Showcase",
                icon: "fas fa-star",
                description: "Project gallery",
            },
        },
        {
            id: "6",
            type: "glass",
            position: { x: 250, y: 470 },
            data: {
                label: "Community",
                icon: "fas fa-users",
                description: "Join the crew",
            },
        },
    ]);

    let edges = $state.raw<Edge[]>([
        {
            id: "e1-2",
            source: "1",
            target: "2",
            type: "smoothstep",
            animated: true,
        },
        {
            id: "e1-3",
            source: "1",
            target: "3",
            type: "smoothstep",
            animated: true,
        },
        {
            id: "e2-4",
            source: "2",
            target: "4",
            type: "smoothstep",
            animated: true,
        },
        {
            id: "e3-5",
            source: "3",
            target: "5",
            type: "smoothstep",
            animated: true,
        },
        {
            id: "e4-6",
            source: "4",
            target: "6",
            type: "smoothstep",
            animated: true,
        },
        {
            id: "e5-6",
            source: "5",
            target: "6",
            type: "smoothstep",
            animated: true,
        },
    ]);
</script>

<svelte:head>
    <title>Svelte Flow Demo — DZypher</title>
</svelte:head>

<div class="demo-page">
    <h1 class="demo-title">Flow <span class="demo-accent">Demo</span></h1>
    <p class="demo-subtitle">
        Interactive node-based diagram — drag nodes, zoom, and pan.
    </p>

    <div class="demo-container">
        <FlowCanvas bind:nodes bind:edges />
    </div>
</div>

<style>
    .demo-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 6rem 1.5rem 3rem;
        min-height: 100vh;
    }

    .demo-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #f1f5f9;
        margin-bottom: 0.25rem;
        font-family: "Neuropol X Free", "Inter", sans-serif;
    }

    .demo-accent {
        color: rgb(var(--color-primary-500-rgb));
    }

    .demo-subtitle {
        color: rgba(255, 255, 255, 0.45);
        font-size: 0.9rem;
        margin-bottom: 2rem;
    }

    .demo-container {
        width: 100%;
        max-width: 900px;
        height: 600px;
        border-radius: 20px;
        box-shadow:
            0 0 60px rgba(var(--color-primary-500-rgb), 0.06),
            0 8px 32px rgba(0, 0, 0, 0.35);
    }
</style>
