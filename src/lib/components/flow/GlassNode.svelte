<script lang="ts">
    import { Handle, Position, type NodeProps } from "@xyflow/svelte";

    let { data, selected }: NodeProps = $props();
</script>

<div class="glass-node" class:glass-node--selected={selected}>
    <!-- Frost spotlight on hover -->
    <div class="glass-node__spotlight"></div>

    {#if data.icon}
        <div class="glass-node__icon">
            <i class={data.icon}></i>
        </div>
    {/if}

    <div class="glass-node__label">
        {data.label ?? ""}
    </div>

    {#if data.description}
        <div class="glass-node__desc">
            {data.description}
        </div>
    {/if}

    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
</div>

<style>
    .glass-node {
        position: relative;
        min-width: 160px;
        padding: 14px 20px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 4px 24px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        overflow: hidden;
        color: #e2e8f0;
        text-align: center;
    }

    .glass-node:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(var(--color-primary-500-rgb), 0.35);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 30px rgba(var(--color-primary-500-rgb), 0.12),
            0 4px 24px rgba(0, 0, 0, 0.4);
    }

    .glass-node--selected {
        border-color: rgba(var(--color-primary-500-rgb), 0.6) !important;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 40px rgba(var(--color-primary-500-rgb), 0.2),
            0 4px 24px rgba(0, 0, 0, 0.5) !important;
    }

    .glass-node__spotlight {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        border-radius: 16px;
        background: radial-gradient(
            300px circle at 50% 50%,
            rgba(255, 255, 255, 0.1),
            transparent 60%
        );
    }

    .glass-node:hover .glass-node__spotlight {
        opacity: 1;
    }

    .glass-node__icon {
        font-size: 1.25rem;
        margin-bottom: 6px;
        color: rgb(var(--color-primary-500-rgb));
    }

    .glass-node__label {
        font-weight: 600;
        font-size: 0.875rem;
        letter-spacing: 0.02em;
    }

    .glass-node__desc {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 4px;
        line-height: 1.35;
    }

    /* Override default Svelte Flow handle styles */
    :global(.glass-node .svelte-flow__handle) {
        width: 8px;
        height: 8px;
        background: rgb(var(--color-primary-500-rgb));
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
    }

    :global(.glass-node .svelte-flow__handle:hover) {
        background: rgb(var(--color-primary-400-rgb, 140, 110, 255));
        box-shadow: 0 0 10px rgba(var(--color-primary-500-rgb), 0.5);
    }
</style>
