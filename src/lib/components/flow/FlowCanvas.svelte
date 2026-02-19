<script lang="ts">
    import {
        SvelteFlow,
        Background,
        Controls,
        MiniMap,
        type Node,
        type Edge,
        type NodeTypes,
        type EdgeTypes,
    } from "@xyflow/svelte";
    import "@xyflow/svelte/dist/style.css";

    import GlassNode from "./GlassNode.svelte";

    /* ── Props ── */
    let {
        nodes = $bindable<Node[]>([]),
        edges = $bindable<Edge[]>([]),
        nodeTypes = { glass: GlassNode } as NodeTypes,
        edgeTypes = undefined as EdgeTypes | undefined,

        fitView = true,
        snapToGrid = false,
        colorMode = "dark" as "dark" | "light" | "system",

        showBackground = true,
        showControls = true,
        showMiniMap = true,

        class: className = "",
    }: {
        nodes?: Node[];
        edges?: Edge[];
        nodeTypes?: NodeTypes;
        edgeTypes?: EdgeTypes | undefined;
        fitView?: boolean;
        snapToGrid?: boolean;
        colorMode?: "dark" | "light" | "system";
        showBackground?: boolean;
        showControls?: boolean;
        showMiniMap?: boolean;
        class?: string;
    } = $props();
</script>

<div class="flow-canvas {className}">
    <SvelteFlow
        bind:nodes
        bind:edges
        {nodeTypes}
        {edgeTypes}
        {fitView}
        {snapToGrid}
        {colorMode}
        defaultEdgeOptions={{ type: "smoothstep", animated: true }}
    >
        {#if showBackground}
            <Background gap={20} size={1} />
        {/if}

        {#if showControls}
            <Controls />
        {/if}

        {#if showMiniMap}
            <MiniMap pannable zoomable />
        {/if}
    </SvelteFlow>
</div>

<style>
    .flow-canvas {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* ─── Dark-theme overrides for Svelte Flow ─── */

    /* Main canvas */
    :global(.flow-canvas .svelte-flow) {
        background: rgba(10, 10, 20, 0.85) !important;
    }

    /* Background dots */
    :global(.flow-canvas .svelte-flow__background pattern circle) {
        fill: rgba(var(--color-primary-500-rgb), 0.15) !important;
    }

    /* Default edges */
    :global(.flow-canvas .svelte-flow__edge-path) {
        stroke: rgba(var(--color-primary-500-rgb), 0.45) !important;
        stroke-width: 2 !important;
    }

    :global(.flow-canvas .svelte-flow__edge.animated path) {
        stroke: rgba(var(--color-primary-500-rgb), 0.55) !important;
    }

    /* Edge labels */
    :global(
            .flow-canvas .svelte-flow__edge-textwrapper .svelte-flow__edge-text
        ) {
        fill: #e2e8f0 !important;
    }

    :global(
            .flow-canvas
                .svelte-flow__edge-textwrapper
                .svelte-flow__edge-textbg
        ) {
        fill: rgba(15, 15, 30, 0.8) !important;
    }

    /* Connection line */
    :global(.flow-canvas .svelte-flow__connection-path) {
        stroke: rgb(var(--color-primary-500-rgb)) !important;
        stroke-width: 2 !important;
    }

    /* Controls panel */
    :global(.flow-canvas .svelte-flow__controls) {
        background: rgba(15, 15, 30, 0.85) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        overflow: hidden;
    }

    :global(.flow-canvas .svelte-flow__controls-button) {
        background: transparent !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        fill: #cbd5e1 !important;
        color: #cbd5e1 !important;
        width: 28px !important;
        height: 28px !important;
    }

    :global(.flow-canvas .svelte-flow__controls-button:hover) {
        background: rgba(var(--color-primary-500-rgb), 0.15) !important;
        fill: #f1f5f9 !important;
    }

    /* MiniMap */
    :global(.flow-canvas .svelte-flow__minimap) {
        background: rgba(15, 15, 30, 0.85) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
    }

    :global(.flow-canvas .svelte-flow__minimap-mask) {
        fill: rgba(var(--color-primary-500-rgb), 0.08) !important;
        stroke: rgba(var(--color-primary-500-rgb), 0.3) !important;
    }

    :global(.flow-canvas .svelte-flow__minimap-node) {
        fill: rgba(var(--color-primary-500-rgb), 0.35) !important;
        stroke: none !important;
    }

    /* Selection box */
    :global(.flow-canvas .svelte-flow__selection) {
        background: rgba(var(--color-primary-500-rgb), 0.08) !important;
        border: 1px solid rgba(var(--color-primary-500-rgb), 0.4) !important;
    }

    /* Attribution (hide if self-hosted / open-source use) */
    :global(.flow-canvas .svelte-flow__attribution) {
        display: none;
    }
</style>
