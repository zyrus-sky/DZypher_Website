<script lang="ts">
    import { teamStore, fetchTeamData } from "$lib/stores";
    import TiltCard from "$lib/components/TiltCard.svelte";
    import { reveal } from "$lib/actions";
    import { onMount } from "svelte";

    onMount(() => {
        fetchTeamData();
    });
</script>

<div
    id="team"
    class="min-h-screen w-full py-12 md:py-24 snap-start flex flex-col justify-center"
>
    <div class="container mx-auto px-6">
        <h1
            use:reveal
            class="reveal-fade-up text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white"
        >
            Our Team
        </h1>

        <!-- Faculty Section -->
        {#if $teamStore.faculty.length > 0}
            <section class="mb-20">
                <h2
                    use:reveal
                    class="reveal-fade-up delay-100 text-2xl font-semibold text-red-400 mb-8 border-b border-red-900/50 pb-2"
                >
                    Faculty Coordinator
                </h2>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                    {#each $teamStore.faculty as member, i}
                        <div
                            use:reveal
                            class="reveal-scale"
                            style="transition-delay: {i * 100}ms"
                        >
                            <TiltCard>
                                <div
                                    class="h-full bg-gradient-to-br from-red-950/30 to-black border border-red-900/30 p-6 rounded-2xl hover:border-red-500/50 transition-all group"
                                >
                                    <div
                                        class="w-24 h-24 bg-stone-800 rounded-full mb-4 mx-auto overflow-hidden border-2 border-red-900 group-hover:border-red-500 transition-colors"
                                    >
                                        {#if member.image}
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                class="w-full h-full object-cover"
                                            />
                                        {:else}
                                            <div
                                                class="w-full h-full flex items-center justify-center text-stone-500 text-xs"
                                            >
                                                IMG
                                            </div>
                                        {/if}
                                    </div>
                                    <h3
                                        class="text-xl font-bold text-center text-white"
                                    >
                                        {member.name}
                                    </h3>
                                    <p
                                        class="text-center text-red-300 text-sm mt-1"
                                    >
                                        {member.role}
                                    </p>
                                </div>
                            </TiltCard>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        <!-- Core Team Section -->
        {#if $teamStore.core.length > 0}
            <section>
                <h2
                    use:reveal
                    class="reveal-fade-up text-2xl font-semibold text-red-400 mb-8 border-b border-red-900/50 pb-2"
                >
                    Core Team
                </h2>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
                >
                    {#each $teamStore.core as member, i}
                        <div
                            use:reveal
                            class="reveal-scale"
                            style="transition-delay: {i * 50}ms"
                        >
                            <TiltCard>
                                <div
                                    class="h-full bg-black/40 border border-stone-800 p-6 rounded-xl hover:bg-red-950/10 hover:border-red-800 transition-all"
                                >
                                    <h3 class="text-lg font-bold text-white">
                                        {member.name}
                                    </h3>
                                    <p class="text-red-400 text-sm">
                                        {member.role}
                                    </p>
                                </div>
                            </TiltCard>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</div>
