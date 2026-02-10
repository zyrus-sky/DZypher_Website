<script lang="ts">
    import type { Resource } from "$lib/data";

    export let resource: Resource;

    // Map categories to colors/icons
    const categoryConfig = {
        Python: {
            color: "text-blue-400",
            border: "border-blue-500/30",
            icon: "fab fa-python",
        },
        Mathematics: {
            color: "text-purple-400",
            border: "border-purple-500/30",
            icon: "fas fa-square-root-alt",
        },
        "Machine Learning": {
            color: "text-green-400",
            border: "border-green-500/30",
            icon: "fas fa-brain",
        },
        "Deep Learning": {
            color: "text-red-400",
            border: "border-red-500/30",
            icon: "fas fa-network-wired",
        },
        Other: {
            color: "text-gray-400",
            border: "border-gray-500/30",
            icon: "fas fa-file-alt",
        },
    };

    $: config = categoryConfig[resource.category] || categoryConfig["Other"];
</script>

<div
    class="group relative bg-black/40 backdrop-blur-md border {config.border} p-6 rounded-xl overflow-hidden hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] flex flex-col h-full"
>
    <!-- Decorator Glow -->
    <div
        class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl group-hover:from-white/20 transition-all"
    ></div>

    <div class="flex justify-between items-start mb-4 relative z-10">
        <div class="p-3 bg-white/5 rounded-lg {config.color}">
            <i class="{config.icon} text-2xl"></i>
        </div>
        <span
            class="text-xs font-mono text-stone-500 px-2 py-1 bg-black/50 rounded border border-white/5"
        >
            {resource.size || "PDF"}
        </span>
    </div>

    <h3
        class="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-1"
    >
        {resource.title}
    </h3>

    <p class="text-stone-400 text-sm mb-6 flex-grow line-clamp-3">
        {resource.description}
    </p>

    <a
        href={resource.link}
        class="inline-flex items-center gap-2 text-sm font-semibold {config.color} hover:text-white transition-colors mt-auto"
    >
        <span>Download PDF</span>
        <i
            class="fas fa-download text-xs transform group-hover:translate-y-0.5 transition-transform"
        ></i>
    </a>
</div>
