<script lang="ts">
    import { teamStore, fetchTeamData } from "$lib/stores";
    import TiltCard from "$lib/components/TiltCard.svelte";
    import Marquee from "$lib/components/Marquee.svelte";
    import Portal from "$lib/components/Portal.svelte";
    import { reveal } from "$lib/actions";
    import { fade, scale } from "svelte/transition";

    let selectedMember = $state<any>(null);
    let isModalOpen = $state(false);

    function openModal(member: any) {
        selectedMember = member;
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
        setTimeout(() => (selectedMember = null), 200); // Clear after animation
    }

    // Svelte 5: Use $effect instead of onMount
    $effect(() => {
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
            class="reveal-fade-up text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-white"
        >
            Our Team
        </h1>

        <!-- Faculty Section -->
        {#if $teamStore.faculty.length > 0}
            <section class="mb-20">
                <h2
                    use:reveal
                    class="reveal-fade-up delay-100 text-2xl font-semibold text-primary-400 mb-8 border-b border-primary-900/50 pb-2"
                >
                    Faculty Coordinator
                </h2>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                    {#each $teamStore.faculty as member, i}
                        <div
                            use:reveal
                            class="reveal-scale cursor-pointer"
                            style="transition-delay: {i * 100}ms"
                            onclick={() => openModal(member)}
                            role="button"
                            tabindex="0"
                            onkeydown={(e: KeyboardEvent) =>
                                e.key === "Enter" && openModal(member)}
                        >
                            <TiltCard>
                                <div
                                    class="h-full bg-gradient-to-br from-primary-950/30 to-black border border-primary-900/30 p-6 rounded-2xl hover:border-primary-500/50 transition-all group"
                                >
                                    <div
                                        class="w-24 h-24 bg-stone-800 rounded-full mb-4 mx-auto overflow-hidden border-2 border-primary-900 group-hover:border-primary-500 transition-colors"
                                    >
                                        {#if member.image}
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                class="w-full h-full object-cover"
                                                referrerpolicy="no-referrer"
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
                                        class="text-center text-primary-300 text-sm mt-1"
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
            <section class="overflow-hidden">
                <h2
                    use:reveal
                    class="reveal-fade-up text-2xl font-semibold text-primary-400 mb-8 border-b border-primary-900/50 pb-2"
                >
                    Core Team
                </h2>

                <div class="w-full">
                    <Marquee speed={40} direction="left" pauseOnHover={true}>
                        <div class="flex gap-8 px-4">
                            {#each $teamStore.core as member}
                                <button
                                    class="group relative flex-shrink-0 w-64 text-left transition-transform hover:scale-105 focus:outline-none"
                                    onclick={() => openModal(member)}
                                    aria-label="View details for {member.name}"
                                >
                                    <TiltCard>
                                        <div
                                            class="h-full bg-black/40 border border-stone-800 p-6 rounded-2xl hover:bg-primary-950/10 hover:border-primary-800 transition-all duration-300 grayscale group-hover:grayscale-0"
                                        >
                                            <!-- Image: 3D Curved Vertex Square (Rounded-3xl + Rotate) -->
                                            <div
                                                class="w-32 h-32 bg-stone-800 rounded-3xl mx-auto mb-6 overflow-hidden border-2 border-stone-700 group-hover:border-primary-500 transition-colors shadow-lg transform rotate-3 group-hover:rotate-0 duration-300"
                                            >
                                                {#if member.image}
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        class="w-full h-full object-cover"
                                                        referrerpolicy="no-referrer"
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
                                                class="text-lg font-bold text-white text-center mb-1 bg-black/50 backdrop-blur-sm rounded-lg py-1"
                                            >
                                                {member.name}
                                            </h3>
                                            <p
                                                class="text-primary-400 text-sm text-center"
                                            >
                                                {member.role}
                                            </p>
                                        </div>
                                    </TiltCard>
                                </button>
                            {/each}
                        </div>
                    </Marquee>
                </div>
            </section>
        {/if}
    </div>

    <!-- INLINED MODAL COMPONENT -->
    {#if isModalOpen && selectedMember}
        <Portal>
            <div
                class="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                onclick={(e) => e.target === e.currentTarget && closeModal()}
                onkeydown={(e) => e.key === "Escape" && closeModal()}
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                transition:fade={{ duration: 200 }}
            >
                <div
                    class="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden glass-panel relative flex flex-col max-h-[85vh] overflow-y-auto"
                    transition:scale={{ start: 0.9, duration: 200 }}
                >
                    <button
                        class="absolute top-4 right-4 text-stone-400 hover:text-white z-20 bg-black/20 p-2 rounded-full backdrop-blur-sm"
                        onclick={closeModal}
                        aria-label="Close Member Details"
                    >
                        <i class="fas fa-times"></i>
                    </button>

                    <div class="grid md:grid-cols-2">
                        <div
                            class="relative h-48 sm:h-64 md:h-auto bg-stone-900 overflow-hidden group shrink-0"
                        >
                            {#if selectedMember.image}
                                <img
                                    src={selectedMember.image}
                                    alt={selectedMember.name}
                                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent opacity-80 md:hidden"
                                ></div>
                            {:else}
                                <div
                                    class="w-full h-full flex items-center justify-center bg-stone-800 text-stone-600"
                                >
                                    <i class="fas fa-user-circle text-6xl"></i>
                                </div>
                            {/if}
                        </div>

                        <div class="p-6 md:p-8 relative">
                            <div class="mb-6">
                                <h2
                                    class="text-3xl font-bold text-white mb-1 leading-tight"
                                >
                                    {selectedMember.name}
                                </h2>
                                <div
                                    class="text-primary-500 font-medium tracking-wide uppercase text-sm"
                                >
                                    {selectedMember.role}
                                </div>
                            </div>

                            <p class="text-stone-300 leading-relaxed mb-8">
                                {selectedMember.bio ||
                                    "A core member of the DZypher team, contributing code and caffeine to the cause."}
                            </p>

                            <div class="space-y-3 mb-8">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-xs font-mono text-stone-500 w-16"
                                        >CODE</span
                                    >
                                    <div
                                        class="h-1 flex-1 bg-stone-800 rounded-full overflow-hidden"
                                    >
                                        <div
                                            class="h-full bg-primary-500 w-[85%]"
                                        ></div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-xs font-mono text-stone-500 w-16"
                                        >DESIGN</span
                                    >
                                    <div
                                        class="h-1 flex-1 bg-stone-800 rounded-full overflow-hidden"
                                    >
                                        <div
                                            class="h-full bg-primary-400 w-[70%]"
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-4">
                                {#if selectedMember.github}
                                    <a
                                        href={selectedMember.github}
                                        target="_blank"
                                        class="text-stone-400 hover:text-white text-xl"
                                        aria-label="GitHub Profile"
                                        ><i class="fab fa-github"></i></a
                                    >
                                {/if}
                                {#if selectedMember.linkedin}
                                    <a
                                        href={selectedMember.linkedin}
                                        target="_blank"
                                        class="text-stone-400 hover:text-white text-xl"
                                        aria-label="LinkedIn Profile"
                                        ><i class="fab fa-linkedin"></i></a
                                    >
                                {/if}
                                {#if selectedMember.twitter}
                                    <a
                                        href={selectedMember.twitter}
                                        target="_blank"
                                        class="text-stone-400 hover:text-white text-xl"
                                        aria-label="Twitter/X Profile"
                                        ><i class="fab fa-twitter"></i></a
                                    >
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    {/if}
</div>
