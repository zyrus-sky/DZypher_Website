<script lang="ts">
    import { fade, scale } from "svelte/transition";

    // Svelte 5: Props using $props() with $bindable for isOpen
    let {
        member,
        isOpen = $bindable(false),
        onclose,
    }: {
        member: any;
        isOpen?: boolean;
        onclose?: () => void;
    } = $props();

    function close() {
        onclose?.();
    }
</script>

{#if isOpen && member}
    <div
        class="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onclick={(e) => e.target === e.currentTarget && close()}
        onkeydown={(e) => e.key === "Escape" && close()}
        role="dialog"
        aria-modal="true"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden glass-panel relative"
            transition:scale={{ start: 0.9, duration: 200 }}
        >
            <!-- Close Button -->
            <button
                class="absolute top-4 right-4 text-gray-400 hover:text-white z-20 bg-black/20 p-2 rounded-full backdrop-blur-sm"
                onclick={close}
            >
                <i class="fas fa-times"></i>
            </button>

            <div class="grid md:grid-cols-2">
                <!-- Image Side -->
                <div
                    class="relative h-64 md:h-auto bg-gray-900 overflow-hidden group"
                >
                    {#if member.image}
                        <img
                            src={member.image}
                            alt={member.name}
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent opacity-80 md:hidden"
                        ></div>
                    {:else}
                        <div
                            class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600"
                        >
                            <i class="fas fa-user-circle text-6xl"></i>
                        </div>
                    {/if}
                </div>

                <!-- Info Side -->
                <div class="p-8 relative">
                    <div class="mb-6">
                        <h2
                            class="text-3xl font-bold text-white mb-1 leading-tight"
                        >
                            {member.name}
                        </h2>
                        <div
                            class="text-red-500 font-medium tracking-wide uppercase text-sm"
                        >
                            {member.role}
                        </div>
                    </div>

                    <p class="text-gray-300 leading-relaxed mb-8">
                        {member.bio ||
                            "A core member of the DZypher team, contributing code and caffeine to the cause."}
                    </p>

                    <!-- Stats / Skills (Placeholder RPG stats) -->
                    <div class="space-y-3 mb-8">
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-mono text-gray-500 w-16"
                                >CODE</span
                            >
                            <div
                                class="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden"
                            >
                                <div
                                    class="h-full bg-primary-500 w-[85%]"
                                ></div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-mono text-gray-500 w-16"
                                >DESIGN</span
                            >
                            <div
                                class="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden"
                            >
                                <div class="h-full bg-blue-500 w-[70%]"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Socials -->
                    <div class="flex gap-4">
                        {#if member.github}
                            <a
                                href={member.github}
                                target="_blank"
                                class="text-gray-400 hover:text-white text-xl"
                                ><i class="fab fa-github"></i></a
                            >
                        {/if}
                        {#if member.linkedin}
                            <a
                                href={member.linkedin}
                                target="_blank"
                                class="text-gray-400 hover:text-white text-xl"
                                ><i class="fab fa-linkedin"></i></a
                            >
                        {/if}
                        {#if member.twitter}
                            <a
                                href={member.twitter}
                                target="_blank"
                                class="text-gray-400 hover:text-white text-xl"
                                ><i class="fab fa-twitter"></i></a
                            >
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
