<script lang="ts">
    let { className = "", children }: { className?: string; children?: any } =
        $props();
</script>

<div class={`relative p-[1px] overflow-hidden rounded-xl group ${className}`}>
    <!-- Rotating Gradient Border -->
    <div
        class="absolute inset-[-50%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_50%,var(--color-primary-500)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"
        style="filter: blur(5px);"
    ></div>

    <!-- Content Container (Masking the border) -->
    <div
        class="relative bg-surface-900 rounded-[calc(0.75rem-1px)] h-full w-full z-10"
    >
        {@render children?.()}
    </div>
</div>

<style>
    @keyframes spin-slow {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .animate-spin-slow {
        animation: spin-slow 4s linear infinite;
    }

    /* Mobile Polish: Always show glow on touch devices */
    @media (hover: none) {
        .group-hover\:opacity-100 {
            opacity: 1 !important;
        }
    }
</style>
