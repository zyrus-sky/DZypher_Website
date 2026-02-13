<script lang="ts">
    import { selectedFanfic } from "$lib/stores";
    import { fade, scale } from "svelte/transition";
    import { typewriter } from "$lib/actions";

    let visible = $state(false);
    let loading = $state(false);
    let content = $state("");
    let pages = $state<string[]>([]);
    let currentPage = $state(0);
    let theme = $state<"light" | "dark">("light");

    function toggleTheme() {
        theme = theme === "light" ? "dark" : "light";
    }

    // Svelte 5: Use $effect to subscribe to store
    $effect(() => {
        if ($selectedFanfic) {
            visible = true;
            loadContent($selectedFanfic);
        } else {
            visible = false;
            content = "";
            pages = [];
            currentPage = 0;
        }
    });

    function close() {
        $selectedFanfic = null;
    }

    async function loadContent(fic: any) {
        loading = true;
        content = "";
        // Reset pages
        pages = [];
        currentPage = 0;

        try {
            if (fic.link.includes("docs.google.com/document/d/")) {
                const match = fic.link.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match && match[1]) {
                    const docId = match[1];
                    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`;

                    const res = await fetch(proxyUrl);
                    if (res.ok) {
                        const text = await res.text();
                        if (
                            text.length < 50 ||
                            text.trim().startsWith("<!DOCTYPE")
                        ) {
                            throw new Error("Invalid content");
                        }
                        content = text;
                        paginate(content);
                    } else {
                        throw new Error("Fetch failed");
                    }
                }
            } else {
                // Fallback for non-doc links
                content = fic.description || "No content available.";
                paginate(content);
            }
        } catch (e) {
            console.error(e);
            content =
                "Failed to load story content. Please try the external link.";
            pages = [content];
        } finally {
            loading = false;
        }
    }

    function paginate(text: string) {
        // Split by newlines to preserve paragraphs
        // We look for double newlines as paragraph breaks, single as link breaks
        // But to be safe, let's keep all lines and group them.

        const lines = text.split("\n");
        const chunks: string[] = [];
        let currentChunk = "";
        const MAX_CHARS = 1200; // Approx chars per page

        for (let line of lines) {
            // If adding this line exceeds max chars, push current chunk and start new
            if (
                currentChunk.length + line.length > MAX_CHARS &&
                currentChunk.length > 200
            ) {
                chunks.push(currentChunk);
                currentChunk = "";
            }

            // Append line. If it was a blank line in source, it stays blank.
            // We use <br> for visual spacing in HTML later, but here we keep raw text structure mostly.
            // actually, let's normalize:
            // If the line is empty, it's a paragraph break.
            currentChunk += line + "\n";
        }

        if (currentChunk.trim().length > 0) chunks.push(currentChunk);

        if (chunks.length === 0) chunks.push("");
        pages = chunks;
    }

    function nextPage() {
        if (currentPage < pages.length - 1) {
            currentPage++;
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
        }
    }
</script>

{#if visible && $selectedFanfic}
    <div
        class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        transition:fade={{ duration: 300 }}
    >
        <!-- Controls -->
        <div class="absolute top-4 right-4 md:top-8 md:right-8 flex gap-4 z-50">
            <button
                class="text-stone-400 hover:text-white transition-colors"
                onclick={toggleTheme}
                title="Toggle Theme"
            >
                <i
                    class="fas {theme === 'light'
                        ? 'fa-moon'
                        : 'fa-sun'} text-2xl"
                ></i>
            </button>
            <button
                class="text-stone-400 hover:text-white transition-colors"
                onclick={close}
            >
                <i class="fas fa-times text-3xl"></i>
            </button>
        </div>

        <!-- Book Container -->
        <div
            class="relative w-full max-w-5xl aspect-[3/4] md:aspect-[3/2] rounded-lg shadow-2xl overflow-hidden flex perspective-1000 transition-colors duration-500 {theme ===
            'light'
                ? 'bg-[#fdfbf7]'
                : 'bg-stone-900 border border-stone-800'}"
            in:scale={{ start: 0.9, duration: 400 }}
        >
            <!-- Left Page (Desktop: Cover/Meta, Mobile: Hidden if > 0?) -->
            <!-- For simplicity in this version, we show Meta on Left, Content on Right for Desktop 
                 OR Two-page text spread. Let's do Meta + Text for Page 0, then Text + Text. -->

            <!-- We will stick to a Left-Right Layout where Left is always previous/meta and Right is current.
                 Actually, simpler: Just show the current 'Spread'. -->

            <div
                class="hidden md:flex flex-1 border-r flex-col relative transition-colors duration-500 {theme ===
                'light'
                    ? 'bg-[#f4ebd0] border-[#dcd6ca]'
                    : 'bg-[#1c1917] border-stone-800'}"
            >
                <div
                    class="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] invert-0 {theme ===
                    'dark'
                        ? 'invert'
                        : ''}"
                ></div>

                <!-- Inner Content Left -->
                <div
                    class="relative z-10 flex flex-col h-full justify-center items-center text-center"
                >
                    {#if currentPage === 0}
                        <h2
                            class="font-serif font-bold mb-4 transition-colors duration-300 {$selectedFanfic
                                .title.length > 20
                                ? 'text-xl'
                                : 'text-3xl'} {theme === 'light'
                                ? 'text-primary-900'
                                : 'text-primary-400'}"
                        >
                            {$selectedFanfic.title}
                        </h2>
                        <div
                            class="w-16 h-1 mb-6 {theme === 'light'
                                ? 'bg-primary-900/20'
                                : 'bg-primary-400/20'}"
                        ></div>
                        <p
                            class="font-serif italic transition-colors {theme ===
                            'light'
                                ? 'text-stone-600'
                                : 'text-stone-400'}"
                        >
                            by {$selectedFanfic.author}
                        </p>
                        <p
                            class="mt-8 text-sm font-serif max-w-xs leading-relaxed transition-colors {theme ===
                            'light'
                                ? 'text-stone-700'
                                : 'text-stone-300'}"
                        >
                            {$selectedFanfic.description}
                        </p>
                    {:else}
                        <!-- Previous page content could act here, but let's keep it simple: Left is even, Right is odd? 
                              Or just Left is "Previous Context". let's just use Left for Meta/Decor for now to ensure readability 
                              without complex book logic, or show Page N-1 -->
                        <div
                            class="font-serif leading-loose text-lg text-justify opacity-60 blur-[1px] transition-colors {theme ===
                            'light'
                                ? 'text-stone-800'
                                : 'text-stone-400'}"
                        >
                            {pages[currentPage - 1]
                                ? "..." + pages[currentPage - 1].slice(-500)
                                : ""}
                        </div>
                        <div
                            class="mt-auto text-center font-sans text-xs transition-colors {theme ===
                            'light'
                                ? 'text-stone-500'
                                : 'text-stone-600'}"
                        >
                            Page {currentPage} of {pages.length}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Right Page (Active Content) -->
            <div
                class="flex-1 p-8 md:p-12 relative flex flex-col transition-colors duration-500 {theme ===
                'light'
                    ? 'bg-[#fffbf0]'
                    : 'bg-[#0f0f0f]'}"
            >
                <div
                    class="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] {theme ===
                    'dark'
                        ? 'invert opacity-5'
                        : ''}"
                ></div>

                {#if loading}
                    <div class="flex-1 flex items-center justify-center">
                        <i
                            class="fas fa-circle-notch fa-spin text-2xl {theme ===
                            'light'
                                ? 'text-primary-900/50'
                                : 'text-primary-500/50'}"
                        ></i>
                    </div>
                {:else}
                    <div class="flex-1 overflow-hidden relative z-10">
                        <div
                            class="prose font-serif text-lg leading-loose text-justify h-full overflow-y-auto pr-4 custom-scrollbar transition-colors {theme ===
                            'light'
                                ? 'text-black prose-stone'
                                : 'text-stone-200 prose-invert'}"
                        >
                            {#if pages[currentPage]}
                                {@html pages[currentPage].replace(
                                    /\n/g,
                                    "<br/><br/>",
                                )}
                            {:else}
                                <p class="italic text-stone-500">
                                    End of story.
                                </p>
                            {/if}
                        </div>
                    </div>

                    <!-- Controls -->
                    <div
                        class="mt-6 flex justify-between items-center z-20 pt-4 transition-colors {theme ===
                        'light'
                            ? 'border-t border-stone-200'
                            : 'border-t border-stone-800'}"
                    >
                        <button
                            class="font-bold disabled:opacity-30 transition {theme ===
                            'light'
                                ? 'text-primary-900 hover:text-primary-700'
                                : 'text-primary-400 hover:text-primary-300'}"
                            disabled={currentPage === 0}
                            onclick={prevPage}
                        >
                            <i class="fas fa-arrow-left mr-2"></i> Prev
                        </button>

                        <span
                            class="text-xs font-mono {theme === 'light'
                                ? 'text-stone-400'
                                : 'text-stone-600'}"
                        >
                            {currentPage + 1} / {pages.length}
                        </span>

                        <button
                            class="font-bold disabled:opacity-30 transition {theme ===
                            'light'
                                ? 'text-primary-900 hover:text-primary-700'
                                : 'text-primary-400 hover:text-primary-300'}"
                            disabled={currentPage >= pages.length - 1}
                            onclick={nextPage}
                        >
                            Next <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                {/if}
            </div>

            <!-- Center Fold Shadow -->
            <div
                class="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r pointer-events-none z-10 hidden md:block {theme ===
                'light'
                    ? 'from-black/10'
                    : 'from-black/40'} to-transparent"
            ></div>
        </div>
    </div>
{/if}

<style>
    .perspective-1000 {
        perspective: 1000px;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #d6d3cd;
        border-radius: 2px;
    }
</style>
